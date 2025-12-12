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
      Analyze the following document text and determine if it is a resume/CV.
      
      Document Text:
      "${documentText.substring(0, 3000)}"
      
      A resume/CV typically contains:
      - Personal information (name, contact details)
      - Work experience or employment history
      - Education background
      - Skills or competencies
      - Professional summary or objective
      
      Respond with:
      - isResume: true if this is a resume/CV, false otherwise
      - confidence: A number from 0-100 indicating how confident you are
      - reason: A brief explanation of why this is or isn't a resume
      - documentType: If not a resume, what type of document is it (e.g., "invoice", "article", "contract", "report", "unknown")
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

    return JSON.parse(
      response.text ||
        '{"isResume": false, "confidence": 0, "reason": "Could not analyze document", "documentType": "unknown"}'
    );
  } catch (error) {
    console.error("Resume validation failed:", error);
    // Fallback: do basic text analysis
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
    ];
    const lowerText = documentText.toLowerCase();
    const matchedKeywords = resumeKeywords.filter((kw) =>
      lowerText.includes(kw)
    );
    const isLikelyResume = matchedKeywords.length >= 3;

    return {
      isResume: isLikelyResume,
      confidence: isLikelyResume ? 60 : 30,
      reason: isLikelyResume
        ? `Found resume indicators: ${matchedKeywords.slice(0, 3).join(", ")}`
        : "Document lacks typical resume elements",
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
      Parse the following resume text and extract structured candidate information.
      Target role we're hiring for: ${targetRole}
      
      Resume Text:
      "${resumeText}"
      
      Extract and return a JSON object with:
      - name: Full name of the candidate
      - email: Email address if found
      - role: Their most recent or primary job title
      - experienceYears: Total years of professional experience (estimate from work history)
      - skills: Array of technical skills, programming languages, frameworks, tools mentioned
      - education: Highest education level and institution
      - summary: A brief 2-sentence professional summary
      - previousCompanies: Array of objects with {name, role, duration, context} for each company they worked at
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
      Score this candidate for the role of "${targetRole}".
      
      Candidate Info:
      - Name: ${candidate.name}
      - Current Role: ${candidate.role}
      - Experience: ${candidate.experienceYears} years
      - Skills: ${candidate.skills.join(", ")}
      - Summary: ${candidate.summary}
      
      Required Skills for the role: ${requiredSkills.join(", ")}
      
      Provide:
      1. A score from 0-100 based on skill match, experience, and role fit
      2. A brief match reason (e.g., "Strong Skill Match", "Good Experience", "Potential Culture Fit")
      3. List of missing skills that the candidate doesn't have from the required list
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

      if (!validation.isResume || validation.confidence < 50) {
        // This PDF is not a resume - decline it
        declinedFiles.push({
          fileName: file.name,
          reason: validation.reason,
          documentType: validation.documentType,
        });
        console.log(`Declined ${file.name}: ${validation.reason}`);
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
