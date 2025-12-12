import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface ParsedCandidate {
  name: string;
  email?: string;
  role: string;
  experienceYears: number;
  skills: string[];
  education?: string;
  summary: string;
  previousCompanies: {
    name: string;
    role: string;
    duration: string;
    context: string;
  }[];
}

export interface ResumeValidationResult {
  isResume: boolean;
  confidence: number;
  reason: string;
  documentType?: string;
}

// Validate if the document is actually a resume
export const validateIsResume = async (
  documentText: string
): Promise<ResumeValidationResult> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert document classifier. Analyze the following document text and determine if it is a legitimate resume/CV.
      
      Document Text (first 4000 characters):
      "${documentText.substring(0, 4000)}"
      
      A VALID resume/CV MUST contain MOST of these elements:
      - Personal/Contact information (name, email, phone, or address)
      - Work experience or employment history with job titles and companies
      - Education section with degrees, institutions, or certifications
      - Skills section (technical or soft skills)
      - Professional summary, objective, or about section
      
      REJECT documents that are:
      - Invoices, receipts, or financial documents
      - Articles, blog posts, or news content
      - Contracts, legal documents, or agreements
      - Reports, research papers, or academic papers
      - Marketing materials, brochures, or advertisements
      - Random text, gibberish, or unrelated content
      - Cover letters ONLY (without resume content)
      - Job descriptions or job postings
      - Reference letters or recommendation letters only
      
      Be STRICT in your evaluation. Only accept documents that are clearly resumes/CVs.
      
      Respond with:
      - isResume: true ONLY if this is clearly a resume/CV, false for anything else
      - confidence: A number from 0-100 indicating how confident you are (be conservative)
      - reason: A specific explanation of why this is or isn't a resume (mention what elements you found or didn't find)
      - documentType: If not a resume, categorize it (e.g., "invoice", "article", "contract", "report", "cover_letter", "job_posting", "unknown")
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isResume: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            documentType: { type: Type.STRING },
          },
        },
      },
    });

    const result = JSON.parse(
      response.text ||
        '{"isResume": false, "confidence": 0, "reason": "Could not analyze document", "documentType": "unknown"}'
    );

    // Extra safety: if confidence is below 60, treat as not a resume even if isResume is true
    if (result.isResume && result.confidence < 60) {
      result.isResume = false;
      result.reason = `Low confidence (${result.confidence}%): ${result.reason}`;
    }

    return result;
  } catch (error) {
    console.error("Resume validation failed:", error);
    // Fallback: do comprehensive text analysis
    const resumeKeywords = [
      "experience",
      "education",
      "skills",
      "work history",
      "employment",
      "resume",
      "cv",
      "curriculum vitae",
      "objective",
      "summary",
      "references",
      "certifications",
      "achievements",
      "responsibilities",
      "bachelor",
      "master",
      "degree",
      "university",
      "college",
      "gpa",
      "professional",
      "career",
    ];

    const nonResumeKeywords = [
      "invoice",
      "receipt",
      "payment",
      "total amount",
      "bill to",
      "ship to",
      "order number",
      "article",
      "published",
      "abstract",
      "introduction",
      "conclusion",
      "methodology",
      "contract",
      "agreement",
      "hereby",
      "whereas",
      "terms and conditions",
      "advertisement",
      "buy now",
      "discount",
      "sale",
      "price",
    ];

    const lowerText = documentText.toLowerCase();
    const matchedResumeKeywords = resumeKeywords.filter((kw) =>
      lowerText.includes(kw)
    );
    const matchedNonResumeKeywords = nonResumeKeywords.filter((kw) =>
      lowerText.includes(kw)
    );

    // Must have at least 4 resume keywords and fewer non-resume keywords
    const isLikelyResume =
      matchedResumeKeywords.length >= 4 && matchedNonResumeKeywords.length < 3;

    return {
      isResume: isLikelyResume,
      confidence: isLikelyResume ? 55 : 25,
      reason: isLikelyResume
        ? `Found resume indicators: ${matchedResumeKeywords
            .slice(0, 4)
            .join(", ")}`
        : matchedNonResumeKeywords.length >= 3
        ? `Document appears to be non-resume content. Found: ${matchedNonResumeKeywords
            .slice(0, 3)
            .join(", ")}`
        : "Document lacks typical resume elements (need work history, education, skills)",
      documentType: isLikelyResume ? undefined : "unknown",
    };
  }
};

// Parse resume text from PDF and extract candidate info using Gemini
export const parseResumeWithGemini = async (
  resumeText: string,
  targetRole: string = "Software Engineer"
): Promise<ParsedCandidate> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert resume parser. Carefully analyze the following resume text and extract comprehensive candidate information.
      
      Target role we're hiring for: ${targetRole}
      
      Resume Text:
      "${resumeText}"
      
      IMPORTANT PARSING RULES:
      1. Extract the EXACT name as it appears on the resume
      2. Find the email address - look for patterns like name@domain.com
      3. Identify their most recent/senior job title as their primary role
      4. Calculate total years of experience by adding up all work durations
      5. Extract ALL technical skills, tools, technologies, and methodologies mentioned
      6. Find the highest education credential
      7. Write a professional summary based on their actual experience
      8. List ALL previous companies with accurate details
      
      If any field cannot be determined with confidence, use reasonable defaults:
      - Unknown names: "Candidate"
      - Missing emails: leave as empty string
      - Unclear experience: estimate based on graduation year or job history
      
      Extract and return a JSON object with:
      - name: Full name of the candidate (required)
      - email: Email address if found (can be empty)
      - role: Their most recent or primary job title
      - experienceYears: Total years of professional experience (number)
      - skills: Array of ALL technical skills, languages, frameworks, tools mentioned
      - education: Highest education level and institution
      - summary: A professional 2-sentence summary highlighting key qualifications
      - previousCompanies: Array of objects with {name, role, duration, context} for each position
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            role: { type: Type.STRING },
            experienceYears: { type: Type.NUMBER },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            education: { type: Type.STRING },
            summary: { type: Type.STRING },
            previousCompanies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  context: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Resume Parsing Failed:", error);
    throw error;
  }
};

// Score and rank a candidate based on job requirements
export const scoreCandidateWithGemini = async (
  candidate: ParsedCandidate,
  targetRole: string,
  requiredSkills: string[] = ["JavaScript", "React", "TypeScript", "Node.js"]
): Promise<{ score: number; matchReason: string; missingSkills: string[] }> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert HR recruiter evaluating a candidate for the role of "${targetRole}".
      
      CANDIDATE PROFILE:
      - Name: ${candidate.name}
      - Current/Most Recent Role: ${candidate.role}
      - Years of Experience: ${candidate.experienceYears}
      - Technical Skills: ${candidate.skills.join(", ")}
      - Professional Summary: ${candidate.summary}
      - Previous Companies: ${
        candidate.previousCompanies
          ?.map((c) => `${c.role} at ${c.name} (${c.duration})`)
          .join("; ") || "Not specified"
      }
      - Education: ${candidate.education || "Not specified"}
      
      REQUIRED SKILLS FOR THIS ROLE: ${requiredSkills.join(", ")}
      
      SCORING CRITERIA (evaluate each):
      1. Skill Match (0-40 points): How many required skills does the candidate have? Consider equivalent technologies.
      2. Experience Level (0-25 points): Is their experience appropriate for the role?
      3. Role Relevance (0-20 points): How relevant is their previous work to this position?
      4. Career Progression (0-15 points): Shows growth, leadership, increasing responsibility?
      
      IMPORTANT:
      - Be fair but realistic in scoring
      - Consider similar/equivalent technologies (e.g., Vue.js experience is relevant for React roles)
      - Entry-level candidates can still score well if they show potential
      - Senior candidates should be evaluated for leadership qualities
      
      Provide:
      1. A total score from 0-100 based on the criteria above
      2. A match reason: Choose from "Excellent Match", "Strong Skill Match", "Good Fit", "Potential Fit", "Partial Match", "Needs Development", or "Not a Match"
      3. List ONLY the skills from the required list that the candidate is genuinely missing (be accurate)
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            matchReason: { type: Type.STRING },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    return JSON.parse(
      response.text ||
        '{ "score": 50, "matchReason": "Under Review", "missingSkills": [] }'
    );
  } catch (error) {
    console.error("Gemini Scoring Failed:", error);
    // Fallback scoring based on skill overlap
    const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());
    const matchedSkills = requiredSkills.filter((s) =>
      candidateSkillsLower.includes(s.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(
      (s) => !candidateSkillsLower.includes(s.toLowerCase())
    );
    const skillScore = (matchedSkills.length / requiredSkills.length) * 60;
    const expScore = Math.min(candidate.experienceYears * 5, 40);

    return {
      score: Math.round(skillScore + expScore),
      matchReason:
        matchedSkills.length >= 3
          ? "Strong Skill Match"
          : matchedSkills.length >= 1
          ? "Partial Match"
          : "Needs Review",
      missingSkills,
    };
  }
};

// Extract text from PDF using FileReader (basic text extraction)
export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);

        // Simple text extraction - look for text between stream markers
        let text = "";
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const rawText = decoder.decode(bytes);

        // Extract readable ASCII text from PDF
        const matches = rawText.match(/[\x20-\x7E\n\r\t]+/g);
        if (matches) {
          text = matches
            .filter((m) => m.length > 3)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
        }

        // If we got meaningful text, return it; otherwise return filename as fallback
        if (text.length > 100) {
          resolve(text.substring(0, 10000)); // Limit to 10k chars
        } else {
          // Fallback - use filename to generate mock data
          resolve(`Resume for candidate from file: ${file.name}`);
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Mocks the extraction analysis but actually uses Gemini to generate the reasoning text dynamically
export const analyzeCandidateProfile = async (
  candidateName: string,
  role: string,
  rawText: string
) => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Analyze the following candidate resume text for the role of ${role}.
      Candidate Name: ${candidateName}
      Resume Text: "${rawText}"
      
      Provide a JSON response with:
      1. A professional summary (2 sentences).
      2. Key technical strengths (array of strings).
      3. A "culture fit" assessment based on the text.
      4. Three specific interview questions tailored to their experience.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            cultureFit: { type: Type.STRING },
            interviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback data if API fails or key is missing
    return {
      summary:
        "Highly experienced engineer with strong background in scalable systems.",
      strengths: ["Python", "System Design", "Leadership"],
      cultureFit: "Shows strong alignment with mission-driven engineering.",
      interviewQuestions: [
        "Tell me about a time you scaled a database.",
        "How do you handle technical debt?",
        "Describe your experience with microservices.",
      ],
    };
  }
};

export const generateEmailDraft = async (
  candidateName: string,
  status: "Interview" | "Reject" | "Confirmed" | "Waitlist",
  keyHighlights: string[]
) => {
  try {
    const model = "gemini-2.5-flash";

    let statusInstruction = "";
    if (status === "Confirmed" || status === "Interview") {
      statusInstruction =
        "Interview Invitation - Congratulations! The candidate made it to the top 20% and is being invited for an interview.";
    } else if (status === "Waitlist") {
      statusInstruction =
        "Waitlist Notification - The candidate is in the middle 60% and is placed on the waitlist. Be encouraging but explain they may be contacted if positions become available.";
    } else {
      statusInstruction =
        "Rejection - The candidate did not make the cut. Be constructive and respectful.";
    }

    const prompt = `
      Write a recruitment email for ${candidateName}.
      Status: ${statusInstruction}
      Key Highlights verified from web: ${keyHighlights.join(", ")}.
      
      Tone: Professional, personalized, and engaging.
      For Interview/Confirmed: Mention specific achievements and congratulate them on being selected.
      For Waitlist: Be encouraging, mention they showed promise, and explain the waitlist process.
      For Reject: Be constructive and respectful, encourage them to apply again in the future.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Email Generation Failed:", error);
    if (status === "Confirmed" || status === "Interview") {
      return `Dear ${candidateName},\n\nCongratulations! We are pleased to inform you that you have been selected for an interview. You are among our top candidates and we look forward to meeting you.\n\nBest regards,\nThe Recruitment Team`;
    } else if (status === "Waitlist") {
      return `Dear ${candidateName},\n\nThank you for your application. We were impressed with your profile and have placed you on our waitlist. We will contact you if a position becomes available.\n\nBest regards,\nThe Recruitment Team`;
    }
    return `Dear ${candidateName},\n\nThank you for your interest in our company. After careful review, we have decided to move forward with other candidates at this time. We encourage you to apply again in the future.\n\nBest regards,\nThe Recruitment Team`;
  }
};

// Rank candidates by score and assign application status
// Top 20% = confirmed (interview), Middle 60% = waitlist, Bottom 20% = rejected
export const rankAndCategorizeCandidates = (
  candidates: Array<{
    id: string;
    name: string;
    email?: string;
    score: number;
    [key: string]: any;
  }>
): {
  confirmed: typeof candidates;
  waitlist: typeof candidates;
  rejected: typeof candidates;
  allRanked: typeof candidates;
} => {
  // Sort candidates by score in descending order
  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  const total = sorted.length;
  const top20Index = Math.ceil(total * 0.2);
  const bottom20Index = Math.floor(total * 0.8);

  const confirmed = sorted
    .slice(0, top20Index)
    .map((c) => ({ ...c, applicationStatus: "confirmed" as const }));
  const waitlist = sorted
    .slice(top20Index, bottom20Index)
    .map((c) => ({ ...c, applicationStatus: "waitlist" as const }));
  const rejected = sorted
    .slice(bottom20Index)
    .map((c) => ({ ...c, applicationStatus: "rejected" as const }));

  const allRanked = [...confirmed, ...waitlist, ...rejected];

  return {
    confirmed,
    waitlist,
    rejected,
    allRanked,
  };
};

// Process multiple resumes and return ranked candidates with status
export const processAndRankResumes = async (
  files: File[],
  targetRole: string = "Software Engineer",
  requiredSkills: string[] = ["JavaScript", "React", "TypeScript", "Node.js"]
): Promise<{
  confirmed: any[];
  waitlist: any[];
  rejected: any[];
  allRanked: any[];
  declined: { fileName: string; reason: string; documentType?: string }[];
  emailsSent: {
    name: string;
    email?: string;
    status: string;
    emailContent: string;
  }[];
}> => {
  const processedCandidates: any[] = [];
  const declinedFiles: {
    fileName: string;
    reason: string;
    documentType?: string;
  }[] = [];

  // Process each resume
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(file);

      // Validate if this is actually a resume
      const validation = await validateIsResume(resumeText);

      // Stricter validation: must be a resume AND have at least 70% confidence
      if (!validation.isResume || validation.confidence < 70) {
        // This PDF is not a resume or confidence is too low - decline it
        declinedFiles.push({
          fileName: file.name,
          reason:
            validation.confidence < 70 && validation.isResume
              ? `Low confidence (${validation.confidence}%): May not be a complete resume. ${validation.reason}`
              : validation.reason,
          documentType: validation.documentType,
        });
        console.log(
          `Declined ${file.name}: ${validation.reason} (confidence: ${validation.confidence}%)`
        );
        continue; // Skip to next file
      }

      // Parse resume with Gemini
      const parsedCandidate = await parseResumeWithGemini(
        resumeText,
        targetRole
      );

      // Score the candidate
      const scoreResult = await scoreCandidateWithGemini(
        parsedCandidate,
        targetRole,
        requiredSkills
      );

      // Create candidate object
      const candidate = {
        id: `${Date.now()}-${i}`,
        name: parsedCandidate.name || `Candidate ${i + 1}`,
        email: parsedCandidate.email,
        role: parsedCandidate.role || targetRole,
        score: scoreResult.score,
        status: "New" as const,
        experienceYears: parsedCandidate.experienceYears || 0,
        matchReason: scoreResult.matchReason,
        skills: parsedCandidate.skills || [],
        missingSkills: scoreResult.missingSkills || [],
        previousCompanies: parsedCandidate.previousCompanies || [],
        webVerification: {
          salaryBenchmark: {
            min: 0,
            max: 0,
            currency: "USD",
            location: "Unknown",
          },
          redFlags: [],
          linkedin: { verified: false, roleMatch: false },
        },
      };

      processedCandidates.push(candidate);
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);
      // Add to declined files instead of creating a fallback candidate
      declinedFiles.push({
        fileName: file.name,
        reason: "Failed to process file - may be corrupted or unreadable",
        documentType: "unreadable",
      });
    }
  }

  // Rank and categorize candidates
  const ranked = rankAndCategorizeCandidates(processedCandidates);

  // Generate and "send" emails for each category
  const emailsSent: {
    name: string;
    email?: string;
    status: string;
    emailContent: string;
  }[] = [];

  // Send confirmation emails to top 20%
  for (const candidate of ranked.confirmed) {
    const emailContent = await generateEmailDraft(
      candidate.name,
      "Confirmed",
      candidate.skills.slice(0, 3)
    );
    emailsSent.push({
      name: candidate.name,
      email: candidate.email,
      status: "confirmed",
      emailContent: emailContent || "",
    });
  }

  // Send waitlist emails to middle 60%
  for (const candidate of ranked.waitlist) {
    const emailContent = await generateEmailDraft(
      candidate.name,
      "Waitlist",
      candidate.skills.slice(0, 3)
    );
    emailsSent.push({
      name: candidate.name,
      email: candidate.email,
      status: "waitlist",
      emailContent: emailContent || "",
    });
  }

  // Send rejection emails to bottom 20%
  for (const candidate of ranked.rejected) {
    const emailContent = await generateEmailDraft(
      candidate.name,
      "Reject",
      candidate.skills.slice(0, 3)
    );
    emailsSent.push({
      name: candidate.name,
      email: candidate.email,
      status: "rejected",
      emailContent: emailContent || "",
    });
  }

  return {
    ...ranked,
    declined: declinedFiles,
    emailsSent,
  };
};

// AI-powered candidate overview generation
export interface CandidateOverview {
  recommendation: "Strong Hire" | "Hire" | "Maybe" | "No Hire";
  summary: string;
  keyStrengths: string[];
  areasToProbe: string[];
  scoreBreakdown: {
    technicalSkills: number;
    experienceRelevance: number;
    educationPedigree: number;
    cultureSoftSkills: number;
  };
}

export const generateCandidateOverview = async (
  candidateName: string,
  role: string,
  skills: string[],
  missingSkills: string[],
  experienceYears: number,
  previousCompanies: {
    name: string;
    role: string;
    duration: string;
    context: string;
  }[],
  score: number
): Promise<CandidateOverview> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert HR recruiter analyzing a candidate for the role of "${role}".
      
      CANDIDATE PROFILE:
      - Name: ${candidateName}
      - Years of Experience: ${experienceYears}
      - Technical Skills: ${skills.join(", ")}
      - Missing Skills: ${missingSkills.join(", ") || "None identified"}
      - Overall Score: ${score}/100
      - Previous Companies: ${
        previousCompanies
          .map((c) => `${c.role} at ${c.name} (${c.duration}) - ${c.context}`)
          .join("; ") || "Not specified"
      }
      
      Provide a comprehensive AI-powered overview with:
      1. recommendation: One of "Strong Hire", "Hire", "Maybe", or "No Hire" based on the profile
      2. summary: A 2-3 sentence executive summary highlighting why this candidate is or isn't a good fit
      3. keyStrengths: Array of 3-4 specific strengths based on their skills and experience
      4. areasToProbe: Array of 2-3 areas that need deeper investigation during interviews
      5. scoreBreakdown: Detailed scores (0-100) for:
         - technicalSkills: Based on skill match and depth
         - experienceRelevance: Based on previous roles and companies
         - educationPedigree: Estimated based on career progression
         - cultureSoftSkills: Estimated based on role diversity and growth
      
      Be specific and reference actual skills and companies mentioned.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasToProbe: { type: Type.ARRAY, items: { type: Type.STRING } },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                technicalSkills: { type: Type.NUMBER },
                experienceRelevance: { type: Type.NUMBER },
                educationPedigree: { type: Type.NUMBER },
                cultureSoftSkills: { type: Type.NUMBER },
              },
            },
          },
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Overview Generation Failed:", error);
    // Fallback response
    return {
      recommendation:
        score >= 85
          ? "Strong Hire"
          : score >= 70
          ? "Hire"
          : score >= 50
          ? "Maybe"
          : "No Hire",
      summary: `${candidateName} demonstrates ${experienceYears} years of experience with expertise in ${skills
        .slice(0, 3)
        .join(", ")}. Their background at ${
        previousCompanies[0]?.name || "previous companies"
      } shows potential for the ${role} position.`,
      keyStrengths: skills.slice(0, 4).map((s) => `${s} expertise`),
      areasToProbe:
        missingSkills.length > 0
          ? missingSkills.slice(0, 2).map((s) => `Limited ${s} evidence`)
          : ["Leadership experience", "Team collaboration"],
      scoreBreakdown: {
        technicalSkills: Math.min(100, score + 3),
        experienceRelevance: Math.min(100, score - 4),
        educationPedigree: Math.min(100, score + 6),
        cultureSoftSkills: Math.min(100, score - 2),
      },
    };
  }
};

// AI-powered interview questions generation
export interface InterviewGuide {
  questions: {
    topic: string;
    question: string;
    lookingFor: string;
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
  scorecardCriteria: string[];
  interviewTips: string[];
}

export const generateInterviewGuide = async (
  candidateName: string,
  role: string,
  skills: string[],
  missingSkills: string[],
  previousCompanies: {
    name: string;
    role: string;
    duration: string;
    context: string;
  }[],
  experienceYears: number
): Promise<InterviewGuide> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert technical interviewer creating a personalized interview guide for a candidate.
      
      CANDIDATE PROFILE:
      - Name: ${candidateName}
      - Target Role: ${role}
      - Years of Experience: ${experienceYears}
      - Strong Skills: ${skills.join(", ")}
      - Skills to Probe: ${missingSkills.join(", ") || "None identified"}
      - Previous Experience: ${
        previousCompanies
          .map((c) => `${c.role} at ${c.name} (${c.duration}) - ${c.context}`)
          .join("; ") || "Not specified"
      }
      
      Generate a comprehensive interview guide with:
      
      1. questions: Array of 5-6 tailored interview questions, each with:
         - topic: The skill or area being assessed (e.g., "System Design", "Python/Django", "Leadership")
         - question: A specific, thoughtful question referencing their actual experience or skills
         - lookingFor: What a good answer should include (2-3 key points)
         - difficulty: "Easy", "Medium", or "Hard"
      
      2. scorecardCriteria: Array of 4-5 evaluation criteria specific to this role (e.g., "Technical Proficiency", "System Design", "Communication")
      
      3. interviewTips: Array of 2-3 tips for the interviewer specific to this candidate
      
      Make questions specific to:
      - Their stated skills (${skills.slice(0, 3).join(", ")})
      - Their previous companies and roles
      - Any missing skills that need verification
      
      Include at least one behavioral question and one technical deep-dive question.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  question: { type: Type.STRING },
                  lookingFor: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
              },
            },
            scorecardCriteria: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            interviewTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Interview Guide Generation Failed:", error);
    // Fallback response
    return {
      questions: [
        {
          topic: "System Design",
          question: `Can you describe a time you had to optimize a slow database query in ${
            skills[0] || "your tech stack"
          }? What was your approach?`,
          lookingFor:
            "Indexing knowledge, ORM understanding, performance analysis tools",
          difficulty: "Medium",
        },
        {
          topic: `Experience at ${
            previousCompanies[0]?.name || "Previous Role"
          }`,
          question: `You mentioned working on ${
            previousCompanies[0]?.context || "complex projects"
          }. What was the biggest technical bottleneck you faced?`,
          lookingFor:
            "Problem-solving approach, technical depth, collaboration skills",
          difficulty: "Medium",
        },
        {
          topic: "Culture Fit",
          question:
            "Describe a situation where you disagreed with a product decision. How did you handle it?",
          lookingFor:
            "Communication skills, conflict resolution, professional maturity",
          difficulty: "Easy",
        },
        {
          topic: "Technical Skills",
          question: `How would you architect a scalable microservices solution using ${skills
            .slice(0, 2)
            .join(" and ")}?`,
          lookingFor:
            "Architecture knowledge, scalability concepts, practical experience",
          difficulty: "Hard",
        },
      ],
      scorecardCriteria: [
        "Technical Proficiency",
        "System Design",
        "Communication",
        "Culture Fit",
        "Problem Solving",
      ],
      interviewTips: [
        `Focus on their ${skills[0]} experience mentioned in their resume`,
        `Probe deeper into their work at ${
          previousCompanies[0]?.name || "previous companies"
        }`,
        "Look for specific examples rather than theoretical answers",
      ],
    };
  }
};

// AI-powered score analysis generation
export interface ScoreAnalysis {
  overallAssessment: string;
  technicalAnalysis: string;
  experienceAnalysis: string;
  growthPotential: string;
  riskFactors: string[];
}

export const generateScoreAnalysis = async (
  candidateName: string,
  role: string,
  score: number,
  skills: string[],
  missingSkills: string[],
  experienceYears: number,
  previousCompanies: {
    name: string;
    role: string;
    duration: string;
    context: string;
  }[]
): Promise<ScoreAnalysis> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert HR analyst providing a detailed score analysis for a candidate.
      
      CANDIDATE PROFILE:
      - Name: ${candidateName}
      - Target Role: ${role}
      - Overall Score: ${score}/100
      - Years of Experience: ${experienceYears}
      - Skills: ${skills.join(", ")}
      - Missing Skills: ${missingSkills.join(", ") || "None"}
      - Previous Companies: ${
        previousCompanies.map((c) => `${c.role} at ${c.name}`).join(", ") ||
        "Not specified"
      }
      
      Provide a detailed analysis with:
      1. overallAssessment: A 2-sentence assessment of the candidate's fit (reference their actual score)
      2. technicalAnalysis: Analysis of their technical capabilities based on skills (1-2 sentences)
      3. experienceAnalysis: Analysis of their experience relevance (1-2 sentences)
      4. growthPotential: Assessment of their growth trajectory and potential (1-2 sentences)
      5. riskFactors: Array of 2-3 potential risk factors to consider
      
      Be specific and reference actual data from their profile.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAssessment: { type: Type.STRING },
            technicalAnalysis: { type: Type.STRING },
            experienceAnalysis: { type: Type.STRING },
            growthPotential: { type: Type.STRING },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Score Analysis Failed:", error);
    // Fallback response
    return {
      overallAssessment: `With a score of ${score}/100, ${candidateName} shows ${
        score >= 80 ? "strong" : score >= 60 ? "good" : "moderate"
      } alignment with the ${role} position. Their ${experienceYears} years of experience provide a solid foundation.`,
      technicalAnalysis: `Strong capabilities in ${skills
        .slice(0, 3)
        .join(", ")}. ${
        missingSkills.length > 0
          ? `May need development in ${missingSkills[0]}.`
          : "No significant skill gaps identified."
      }`,
      experienceAnalysis: `Previous experience at ${
        previousCompanies[0]?.name || "industry companies"
      } demonstrates relevant background for this role.`,
      growthPotential:
        "Shows career progression and ability to take on increasing responsibilities.",
      riskFactors: [
        missingSkills.length > 0
          ? `Limited ${missingSkills[0]} experience`
          : "May need onboarding time",
        "Salary expectations to be verified",
        "Cultural fit requires in-person assessment",
      ],
    };
  }
};

// Intelligent Candidate Search - Chat Interface
export interface SearchResult {
  matchedCandidates: {
    id: string;
    name: string;
    relevanceScore: number;
    matchReason: string;
  }[];
  explanation: string;
  suggestedFollowUp: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  candidates?: {
    id: string;
    name: string;
    relevanceScore: number;
    matchReason: string;
  }[];
  timestamp: Date;
}

// Semantic search for candidates using natural language
export const searchCandidatesWithAI = async (
  query: string,
  candidates: Array<{
    id: string;
    name: string;
    role: string;
    score: number;
    skills: string[];
    experienceYears: number;
    previousCompanies: {
      name: string;
      role: string;
      duration: string;
      context: string;
    }[];
    webVerification: {
      github?: {
        handle: string;
        contributions: number;
        topLanguages: string[];
        notableProject: string;
        verified: boolean;
      };
      linkedin?: {
        verified: boolean;
        roleMatch: boolean;
        connections?: number;
      };
      salaryBenchmark: {
        min: number;
        max: number;
        currency: string;
        location: string;
      };
      redFlags: string[];
    };
    matchReason: string;
    missingSkills: string[];
    status: string;
    applicationStatus?: string;
  }>,
  conversationHistory: ChatMessage[] = []
): Promise<SearchResult> => {
  try {
    const model = "gemini-2.5-flash";

    // Build candidate database context
    const candidateContext = candidates
      .map(
        (c, idx) => `
      Candidate ${idx + 1}:
      - ID: ${c.id}
      - Name: ${c.name}
      - Current Role: ${c.role}
      - AI Score: ${c.score}/100
      - Years of Experience: ${c.experienceYears}
      - Skills: ${c.skills.join(", ")}
      - Missing Skills: ${c.missingSkills.join(", ") || "None"}
      - Previous Companies: ${
        c.previousCompanies
          .map((p) => `${p.role} at ${p.name} (${p.context})`)
          .join("; ") || "Not specified"
      }
      - GitHub: ${
        c.webVerification.github
          ? `@${c.webVerification.github.handle}, ${c.webVerification.github.contributions} contributions, notable project: ${c.webVerification.github.notableProject}`
          : "Not verified"
      }
      - LinkedIn: ${
        c.webVerification.linkedin?.verified ? "Verified" : "Not verified"
      }
      - Location: ${c.webVerification.salaryBenchmark.location}
      - Status: ${c.status}
      - Application Status: ${c.applicationStatus || "pending"}
      - Match Reason: ${c.matchReason}
    `
      )
      .join("\n");

    // Build conversation context
    const conversationContext =
      conversationHistory.length > 0
        ? `\nPrevious conversation:\n${conversationHistory
            .slice(-6)
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n")}\n`
        : "";

    const prompt = `
      You are an intelligent HR assistant helping recruiters find the best candidates using semantic search.
      You have access to a candidate database and can answer natural language queries about candidates.
      
      CANDIDATE DATABASE:
      ${candidateContext}
      
      ${conversationContext}
      
      USER QUERY: "${query}"
      
      INSTRUCTIONS:
      1. Understand the user's intent - they might be asking about:
         - Skills and technical expertise ("Who knows Python and Go?")
         - Experience and background ("Who scaled databases at fintech companies?")
         - Availability and status ("Who could start immediately?")
         - Leadership potential ("Best candidate for leadership role?")
         - Online presence ("Strongest portfolio?")
         - Market insights ("Candidates from companies with recent layoffs?")
         - Comparisons ("Which candidate is best for X?")
      
      2. Search the candidate database semantically - look for:
         - Exact skill matches
         - Related/similar skills (e.g., "databases" could match PostgreSQL, MySQL, MongoDB)
         - Company context clues (fintech companies like Stripe, Square, etc.)
         - Experience patterns that suggest the queried capability
         - GitHub/LinkedIn data for online presence queries
      
      3. Rank candidates by relevance to the query (0-100 relevance score)
      
      4. Provide a conversational, helpful explanation
      
      5. Suggest relevant follow-up questions
      
      Respond with:
      - matchedCandidates: Array of matching candidates with {id, name, relevanceScore (0-100), matchReason (specific reason this candidate matches the query)}
      - explanation: A helpful, conversational explanation of your findings (2-4 sentences)
      - suggestedFollowUp: Array of 2-3 relevant follow-up questions the user might want to ask
      
      If no candidates match, return empty matchedCandidates array and explain why.
      Always be helpful and provide actionable insights.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedCandidates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  relevanceScore: { type: Type.NUMBER },
                  matchReason: { type: Type.STRING },
                },
              },
            },
            explanation: { type: Type.STRING },
            suggestedFollowUp: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    return JSON.parse(
      response.text ||
        '{"matchedCandidates": [], "explanation": "Unable to process query", "suggestedFollowUp": []}'
    );
  } catch (error) {
    console.error("AI Search Failed:", error);
    // Fallback: basic keyword search
    const queryLower = query.toLowerCase();
    const matchedCandidates = candidates
      .filter((c) => {
        const searchText = `${c.name} ${c.role} ${c.skills.join(
          " "
        )} ${c.previousCompanies.map((p) => p.name).join(" ")}`.toLowerCase();
        return (
          searchText.includes(queryLower) ||
          queryLower.split(" ").some((word) => searchText.includes(word))
        );
      })
      .map((c) => ({
        id: c.id,
        name: c.name,
        relevanceScore: 70,
        matchReason: "Keyword match found in profile",
      }));

    return {
      matchedCandidates,
      explanation:
        matchedCandidates.length > 0
          ? `Found ${matchedCandidates.length} candidate(s) matching your search.`
          : "No candidates found matching your criteria.",
      suggestedFollowUp: [
        "Show me all candidates with Python experience",
        "Who has the highest AI score?",
        "Which candidates are available for interviews?",
      ],
    };
  }
};

// Compare candidates using AI
export const compareCandidatesWithAI = async (
  candidateIds: string[],
  candidates: Array<{
    id: string;
    name: string;
    role: string;
    score: number;
    skills: string[];
    experienceYears: number;
    previousCompanies: {
      name: string;
      role: string;
      duration: string;
      context: string;
    }[];
    webVerification: any;
    matchReason: string;
    missingSkills: string[];
  }>,
  criteria?: string
): Promise<{
  comparison: string;
  recommendation: string;
  winner?: { id: string; name: string; reason: string };
}> => {
  try {
    const model = "gemini-2.5-flash";

    const selectedCandidates = candidates.filter((c) =>
      candidateIds.includes(c.id)
    );

    const candidateContext = selectedCandidates
      .map(
        (c, idx) => `
      Candidate ${idx + 1}: ${c.name}
      - Role: ${c.role}
      - AI Score: ${c.score}/100
      - Experience: ${c.experienceYears} years
      - Skills: ${c.skills.join(", ")}
      - Previous: ${c.previousCompanies
        .map((p) => `${p.role} at ${p.name}`)
        .join("; ")}
      - Strengths: ${c.matchReason}
      - Gaps: ${c.missingSkills.join(", ") || "None"}
    `
      )
      .join("\n");

    const prompt = `
      Compare these candidates${criteria ? ` for ${criteria}` : ""}:
      
      ${candidateContext}
      
      Provide:
      1. comparison: A detailed comparison highlighting key differences (3-4 sentences)
      2. recommendation: Your recommendation on which to prioritize and why
      3. winner: If one clearly stands out, provide {id, name, reason}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comparison: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            winner: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    return JSON.parse(
      response.text ||
        '{"comparison": "Unable to compare", "recommendation": "Please try again"}'
    );
  } catch (error) {
    console.error("AI Comparison Failed:", error);
    return {
      comparison: "Unable to generate comparison at this time.",
      recommendation: "Please review candidates manually.",
    };
  }
};
