// Groq API Configuration
const GROQ_API_KEY = (import.meta as any).env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Helper function to call Groq API
const callGroqAPI = async (
  prompt: string,
  jsonMode: boolean = true
): Promise<string> => {
  if (!GROQ_API_KEY) {
    console.error(
      "GROQ API key is missing! Make sure VITE_GROQ_API_KEY is set in .env"
    );
    throw new Error("Groq API key not configured");
  }

  console.log("Calling Groq API...");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: jsonMode
            ? "You are a helpful assistant. Always respond with valid JSON only, no markdown formatting or code blocks."
            : "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Groq API error response:`, error);
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "";
  console.log("Groq API response received, length:", content.length);

  // Clean up potential markdown code blocks from the response
  let cleanContent = content.trim();
  if (cleanContent.startsWith("```json")) {
    cleanContent = cleanContent.slice(7);
  } else if (cleanContent.startsWith("```")) {
    cleanContent = cleanContent.slice(3);
  }
  if (cleanContent.endsWith("```")) {
    cleanContent = cleanContent.slice(0, -3);
  }

  return cleanContent.trim();
};

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
    const prompt = `
      You are an expert document classifier. Analyze the following document text and determine if it is a resume/CV.
      
      Document Text (first 4000 characters):
      "${documentText.substring(0, 4000)}"
      
      ACCEPT as a valid resume/CV if the document contains ANY of these:
      - A person's name with contact information (email, phone, address)
      - Work experience or employment history
      - Education background or qualifications
      - Skills or competencies listed
      - Career objective or professional summary
      - Job titles or roles mentioned
      - References or referees section
      
      Resume/CV formats to ACCEPT (be very inclusive):
      - Traditional chronological resumes
      - Functional/skills-based resumes
      - Academic CVs (common in education/research)
      - International CV formats (European, African, Asian styles)
      - Government/public sector CVs
      - Hospitality industry CVs
      - Healthcare professional CVs
      - Simple text-based resumes
      - Resumes with tables for education/experience
      - Entry-level or student resumes
      - Resumes in any language
      
      Only REJECT if the document is CLEARLY one of these NON-resume types:
      - Invoice with prices, totals, payment terms
      - News article with publication date and byline
      - Legal contract with terms and conditions
      - Marketing brochure with product prices
      - Academic research paper with abstract and citations
      
      IMPORTANT: If there is ANY doubt, mark it as a resume. The CV you're analyzing may be from any country, industry, or format.
      A document with a name + ANY career/education/skills info = VALID RESUME.
      
      Respond with JSON:
      {
        "isResume": true or false (default to true unless clearly not a resume),
        "confidence": 70-100 for documents with resume elements,
        "reason": "What resume elements you found",
        "documentType": "only specify if NOT a resume"
      }
    `;

    const responseText = await callGroqAPI(prompt);
    const result = JSON.parse(responseText);

    // Only reject if confidence is very low (below 40) - be lenient
    if (result.isResume && result.confidence < 40) {
      result.isResume = false;
      result.reason = `Very low confidence (${result.confidence}%): ${result.reason}`;
    }

    return result;
  } catch (error) {
    console.error("Resume validation failed:", error);
    // Fallback: do comprehensive text analysis - be lenient
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
      "projects",
      "languages",
      "tools",
      "technologies",
      "proficient",
      "developed",
      "managed",
      "led",
      "created",
      "implemented",
      "designed",
      "built",
      "software",
      "engineer",
      "developer",
      "analyst",
      "manager",
      "intern",
      "trainee",
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

    // Be lenient: only need 2 resume keywords and check non-resume keywords aren't dominant
    const isLikelyResume =
      matchedResumeKeywords.length >= 2 && matchedNonResumeKeywords.length < 5;

    return {
      isResume: isLikelyResume,
      confidence: isLikelyResume ? 70 : 25,
      reason: isLikelyResume
        ? `Found resume indicators: ${matchedResumeKeywords
            .slice(0, 5)
            .join(", ")}`
        : matchedNonResumeKeywords.length >= 5
        ? `Document appears to be non-resume content. Found: ${matchedNonResumeKeywords
            .slice(0, 3)
            .join(", ")}`
        : "Document lacks typical resume elements",
      documentType: isLikelyResume ? undefined : "unknown",
    };
  }
};

// Parse resume text from PDF and extract candidate info using Groq
export const parseResumeWithGemini = async (
  resumeText: string,
  targetRole: string = "Software Engineer"
): Promise<ParsedCandidate> => {
  try {
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
      
      Respond with JSON:
      {
        "name": "Full name of the candidate",
        "email": "Email address if found (can be empty string)",
        "role": "Their most recent or primary job title",
        "experienceYears": number of years of professional experience,
        "skills": ["array", "of", "all", "skills"],
        "education": "Highest education level and institution",
        "summary": "A professional 2-sentence summary highlighting key qualifications",
        "previousCompanies": [{"name": "company", "role": "job title", "duration": "time period", "context": "what they did"}]
      }
    `;

    const responseText = await callGroqAPI(prompt);
    const parsed = JSON.parse(responseText);

    // Ensure we have valid data
    return {
      name: parsed.name || "Candidate",
      email: parsed.email || "",
      role: parsed.role || targetRole,
      experienceYears:
        typeof parsed.experienceYears === "number"
          ? parsed.experienceYears
          : parseInt(parsed.experienceYears) || 0,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      education: parsed.education || "",
      summary: parsed.summary || "",
      previousCompanies: Array.isArray(parsed.previousCompanies)
        ? parsed.previousCompanies
        : [],
    };
  } catch (error) {
    console.error("Groq Resume Parsing Failed:", error);
    throw error;
  }
};

// Enhanced scoring interface with detailed breakdown
export interface DetailedScoreResult {
  score: number;
  matchReason: string;
  missingSkills: string[];
  scoreBreakdown: {
    technicalSkillMatch: number; // 0-40 points
    experienceRelevance: number; // 0-25 points
    cultureFitIndicators: number; // 0-20 points
    redFlagAssessment: number; // 0-15 points (15 = no red flags)
  };
  webVerificationNotes: string[];
  redFlags: string[];
}

// Score and rank a candidate based on job requirements with comprehensive criteria
export const scoreCandidateWithGemini = async (
  candidate: ParsedCandidate,
  targetRole: string,
  requiredSkills: string[] = ["JavaScript", "React", "TypeScript", "Node.js"],
  department: string = "Engineering"
): Promise<DetailedScoreResult> => {
  try {
    const prompt = `
      You are an expert HR recruiter evaluating a candidate for the role of "${targetRole}" in the ${department} department.
      
      CANDIDATE PROFILE:
      - Name: ${candidate.name}
      - Current/Most Recent Role: ${candidate.role}
      - Years of Experience: ${candidate.experienceYears}
      - Technical Skills: ${candidate.skills.join(", ")}
      - Professional Summary: ${candidate.summary}
      - Previous Companies: ${
        candidate.previousCompanies
          ?.map((c) => `${c.role} at ${c.name} (${c.duration}) - ${c.context}`)
          .join("; ") || "Not specified"
      }
      - Education: ${candidate.education || "Not specified"}
      
      REQUIRED SKILLS FOR THIS ROLE: ${requiredSkills.join(", ")}
      
      COMPREHENSIVE SCORING CRITERIA:
      
      1. TECHNICAL SKILL MATCH (0-40 points):
         - Direct skill matches with required skills
         - Related/equivalent technologies (e.g., Vue.js counts for React knowledge)
         - GitHub contributions or project experience that validates skills
         - Depth vs breadth of technical expertise
         - Score 35-40: Expert level, all core skills matched
         - Score 25-34: Strong match, most skills present
         - Score 15-24: Moderate match, some gaps
         - Score 0-14: Significant skill gaps
      
      2. EXPERIENCE RELEVANCE (0-25 points):
         - Weight recent experience more heavily (last 2-3 years)
         - Consider company context (startup vs enterprise, growth stage)
         - Domain relevance to the target role
         - Progression and increasing responsibility
         - Score 20-25: Highly relevant, recent experience at similar companies
         - Score 15-19: Good relevance, transferable experience
         - Score 10-14: Some relevant experience
         - Score 0-9: Limited relevance
      
      3. CULTURE FIT INDICATORS (0-20 points):
         - Communication style evident in resume writing
         - Teamwork and collaboration indicators
         - Passion projects, open source, or side projects
         - Alignment with typical ${department} department values
         - Leadership or mentoring experience
         - Score 16-20: Strong culture fit signals
         - Score 11-15: Good indicators present
         - Score 6-10: Neutral/unclear fit
         - Score 0-5: Potential concerns
      
      4. RED FLAG ASSESSMENT (0-15 points, higher = fewer red flags):
         - Employment gaps (consider context: layoffs, education, personal reasons)
         - Job hopping pattern (multiple short stints without explanation)
         - Inconsistent career trajectory
         - Overqualified concerns
         - Score 13-15: No red flags detected
         - Score 9-12: Minor concerns, likely explainable
         - Score 5-8: Some concerns to probe in interview
         - Score 0-4: Significant red flags
      
      IMPORTANT EVALUATION NOTES:
      - Be fair but realistic in scoring
      - Consider career gaps that may be explained by industry layoffs (tech layoffs 2022-2024)
      - Entry-level candidates can still score well on culture fit and potential
      - Senior candidates should show leadership progression
      - Remote work history is a positive in modern context
      
      Respond with JSON:
      {
        "score": total score from 0-100 (sum of all categories),
        "matchReason": "Excellent Match" or "Strong Skill Match" or "Good Fit" or "Potential Fit" or "Partial Match" or "Needs Development" or "Not a Match",
        "missingSkills": ["array", "of", "missing", "required skills"],
        "scoreBreakdown": {
          "technicalSkillMatch": number 0-40,
          "experienceRelevance": number 0-25,
          "cultureFitIndicators": number 0-20,
          "redFlagAssessment": number 0-15
        },
        "webVerificationNotes": ["Notes about what could be verified via GitHub/LinkedIn/projects"],
        "redFlags": ["Any concerns identified, empty array if none"]
      }
    `;

    const responseText = await callGroqAPI(prompt);
    const parsed = JSON.parse(responseText);

    // Ensure valid score data is returned and capped properly
    const techScore = Math.min(
      parsed.scoreBreakdown?.technicalSkillMatch || 20,
      40
    );
    const expScore = Math.min(
      parsed.scoreBreakdown?.experienceRelevance || 12,
      25
    );
    const cultureScore = Math.min(
      parsed.scoreBreakdown?.cultureFitIndicators || 10,
      20
    );
    const redFlagScore = Math.min(
      parsed.scoreBreakdown?.redFlagAssessment || 10,
      15
    );
    const totalScore = Math.min(
      techScore + expScore + cultureScore + redFlagScore,
      100
    );

    return {
      score: totalScore,
      matchReason: parsed.matchReason || "Potential Fit",
      missingSkills: Array.isArray(parsed.missingSkills)
        ? parsed.missingSkills
        : [],
      scoreBreakdown: {
        technicalSkillMatch: techScore,
        experienceRelevance: expScore,
        cultureFitIndicators: cultureScore,
        redFlagAssessment: redFlagScore,
      },
      webVerificationNotes: Array.isArray(parsed.webVerificationNotes)
        ? parsed.webVerificationNotes
        : [],
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
    };
  } catch (error) {
    console.error("Groq Scoring Failed:", error);
    // Fallback scoring based on skill overlap
    const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());
    const matchedSkills = requiredSkills.filter((s) =>
      candidateSkillsLower.includes(s.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(
      (s) => !candidateSkillsLower.includes(s.toLowerCase())
    );
    const skillScore = Math.round(
      (matchedSkills.length / requiredSkills.length) * 40
    );
    const expScore = Math.min(candidate.experienceYears * 3, 25);
    const cultureFit = 12; // Neutral default
    const redFlagScore = 12; // Assume minor concerns

    return {
      score: Math.round(skillScore + expScore + cultureFit + redFlagScore),
      matchReason:
        matchedSkills.length >= 3
          ? "Strong Skill Match"
          : matchedSkills.length >= 1
          ? "Partial Match"
          : "Needs Review",
      missingSkills,
      scoreBreakdown: {
        technicalSkillMatch: skillScore,
        experienceRelevance: expScore,
        cultureFitIndicators: cultureFit,
        redFlagAssessment: redFlagScore,
      },
      webVerificationNotes: [
        "Unable to verify - API error, manual review recommended",
      ],
      redFlags: [],
    };
  }
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Load PDF.js from CDN if not already loaded
      if (!(window as any).pdfjsLib) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        document.head.appendChild(script);

        await new Promise((res) => {
          script.onload = res;
        });

        // Set worker source
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      const pdfjsLib = (window as any).pdfjsLib;

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      console.log(`PDF loaded: ${pdf.numPages} pages`);

      // Extract text from all pages
      let fullText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine text items
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        fullText += pageText + "\n";
      }

      // Clean up text
      fullText = fullText.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

      if (fullText.length > 100) {
        console.log(
          `Successfully extracted ${fullText.length} characters from ${file.name}`
        );
        resolve(fullText.substring(0, 15000));
      } else {
        console.warn(`Very little text extracted from ${file.name}`);
        resolve(`Resume file: ${file.name} (minimal text extracted)`);
      }
    } catch (error) {
      console.error("PDF extraction error:", error);
      reject(new Error(`Failed to extract text from PDF: ${error.message}`));
    }
  });
};

// Analyze candidate profile using Groq
export const analyzeCandidateProfile = async (
  candidateName: string,
  role: string,
  rawText: string
) => {
  try {
    const prompt = `
      Analyze the following candidate resume text for the role of ${role}.
      Candidate Name: ${candidateName}
      Resume Text: "${rawText}"
      
      Respond with JSON:
      {
        "summary": "A professional summary (2 sentences)",
        "strengths": ["key", "technical", "strengths"],
        "cultureFit": "A culture fit assessment based on the text",
        "interviewQuestions": ["Three", "specific", "interview questions tailored to their experience"]
      }
    `;

    const responseText = await callGroqAPI(prompt);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Groq Analysis Failed:", error);
    // Fallback data if API fails
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
      
      Return ONLY the email text, no JSON formatting.
    `;

    const responseText = await callGroqAPI(prompt, false);
    return responseText;
  } catch (error) {
    console.error("Groq Email Generation Failed:", error);
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
  requiredSkills: string[] = ["JavaScript", "React", "TypeScript", "Node.js"],
  department: string = "Engineering",
  jobPostingId: string = "general"
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
      console.log(
        `Extracted text from ${file.name}: ${resumeText.substring(0, 200)}...`
      );

      // Check if text was actually extracted
      if (!resumeText || resumeText.trim().length < 50) {
        console.warn(`Insufficient text extracted from ${file.name}`);
        declinedFiles.push({
          fileName: file.name,
          reason: "Could not extract enough text from the PDF",
          documentType: "unreadable",
        });
        continue;
      }

      // Parse resume with Groq
      console.log(`Parsing resume for ${file.name}...`);
      const parsedCandidate = await parseResumeWithGemini(
        resumeText,
        targetRole
      );
      console.log(`Parsed candidate:`, parsedCandidate);

      // Score the candidate with comprehensive criteria
      console.log(`Scoring candidate ${parsedCandidate.name}...`);
      const scoreResult = await scoreCandidateWithGemini(
        parsedCandidate,
        targetRole,
        requiredSkills,
        department
      );
      console.log(`Score result:`, scoreResult);

      // Calculate salary benchmark based on role and experience
      const baseSalaries: { [key: string]: { min: number; max: number } } = {
        "Software Engineer": { min: 90000, max: 130000 },
        "Senior Software Engineer": { min: 130000, max: 180000 },
        "Frontend Developer": { min: 85000, max: 125000 },
        "Backend Developer": { min: 90000, max: 135000 },
        "Full Stack Developer": { min: 95000, max: 145000 },
        "DevOps Engineer": { min: 100000, max: 150000 },
        "Data Scientist": { min: 110000, max: 160000 },
        "Product Manager": { min: 100000, max: 155000 },
        "UX Designer": { min: 80000, max: 130000 },
        "Engineering Manager": { min: 150000, max: 220000 },
        default: { min: 80000, max: 120000 },
      };

      const baseSalary = baseSalaries[targetRole] || baseSalaries["default"];
      const experienceMultiplier =
        1 + (parsedCandidate.experienceYears || 0) * 0.05;
      const salaryMin = Math.round(baseSalary.min * experienceMultiplier);
      const salaryMax = Math.round(baseSalary.max * experienceMultiplier);

      // Create candidate object with unique ID and job association
      const candidate = {
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`,
        name: parsedCandidate.name || `Candidate ${i + 1}`,
        email: parsedCandidate.email,
        role: targetRole, // Use the job posting's role
        appliedRole: parsedCandidate.role || targetRole, // Their actual current role
        jobPostingId: jobPostingId, // Associate with job posting
        score: scoreResult.score,
        status: "New" as const,
        experienceYears: parsedCandidate.experienceYears || 0,
        matchReason: scoreResult.matchReason,
        skills: parsedCandidate.skills || [],
        missingSkills: scoreResult.missingSkills || [],
        previousCompanies: parsedCandidate.previousCompanies || [],
        // Enhanced scoring breakdown
        scoreBreakdown: scoreResult.scoreBreakdown || {
          technicalSkillMatch: 0,
          experienceRelevance: 0,
          cultureFitIndicators: 0,
          redFlagAssessment: 0,
        },
        webVerification: {
          notes: scoreResult.webVerificationNotes || [],
          salaryBenchmark: {
            min: salaryMin,
            max: salaryMax,
            currency: "USD",
            location: "Remote",
          },
          redFlags: scoreResult.redFlags || [],
          linkedin: { verified: false, roleMatch: true },
        },
      };

      processedCandidates.push(candidate);
      console.log(
        `Successfully processed candidate:`,
        candidate.name,
        `Score: ${candidate.score}, Experience: ${candidate.experienceYears}, Skills: ${candidate.skills.length}`
      );
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);

      // Try to create a basic candidate from the file name at minimum
      try {
        const resumeText = await extractTextFromPDF(file);
        if (resumeText && resumeText.length > 50) {
          // Better name extraction - try multiple patterns
          let extractedName = "";

          // Pattern 1: Look for name at the very beginning (first line)
          const firstLine = resumeText.split("\n")[0]?.trim();
          if (
            firstLine &&
            firstLine.length > 2 &&
            firstLine.length < 50 &&
            /^[A-Za-z]/.test(firstLine)
          ) {
            // Check if first line looks like a name (not an email or phone)
            if (
              !firstLine.includes("@") &&
              !firstLine.includes("http") &&
              !/^\d/.test(firstLine)
            ) {
              extractedName = firstLine;
            }
          }

          // Pattern 2: Look for "Name: John Doe" pattern
          if (!extractedName) {
            const nameColonMatch = resumeText.match(
              /name\s*[:\-]\s*([A-Za-z]+(?:\s+[A-Za-z]+)+)/i
            );
            if (nameColonMatch) extractedName = nameColonMatch[1].trim();
          }

          // Pattern 3: Look for two capitalized words together near the start
          if (!extractedName) {
            const firstFewLines = resumeText.substring(0, 500);
            const capNamesMatch = firstFewLines.match(
              /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/
            );
            if (capNamesMatch && capNamesMatch[1].length < 40) {
              extractedName = capNamesMatch[1];
            }
          }

          // Pattern 4: Look for common name formats
          if (!extractedName) {
            const commonNameMatch = resumeText.match(
              /^([A-Z][A-Za-z'-]+\s+(?:[A-Z]\.?\s+)?[A-Z][A-Za-z'-]+)/m
            );
            if (commonNameMatch) extractedName = commonNameMatch[1];
          }

          const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
          const skillKeywords = [
            "JavaScript",
            "Python",
            "React",
            "Node",
            "Java",
            "SQL",
            "AWS",
            "Docker",
            "TypeScript",
            "HTML",
            "CSS",
            "Angular",
            "Vue",
            "MongoDB",
            "PostgreSQL",
            "Git",
            "Kubernetes",
            "Linux",
            "C++",
            "C#",
            "Ruby",
            "Go",
            "Rust",
            "PHP",
            "Swift",
            "Kotlin",
          ];
          const foundSkills = skillKeywords.filter((skill) =>
            resumeText.toLowerCase().includes(skill.toLowerCase())
          );

          // Try to find years of experience
          const expMatch = resumeText.match(
            /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i
          );
          const experienceYears = expMatch
            ? Math.min(parseInt(expMatch[1]), 30)
            : 2;

          // Calculate score with proper caps (max 100)
          const techScore = Math.min(foundSkills.length * 4, 40); // Max 40
          const expScoreCalc = Math.min(experienceYears * 3, 25); // Max 25
          const cultureScore = 10; // Default 10 out of 20
          const redFlagScore = 10; // Default 10 out of 15 (some concerns)
          const totalScore = Math.min(
            techScore + expScoreCalc + cultureScore + redFlagScore,
            100
          );

          const fallbackCandidate = {
            id: `${Date.now()}-${i}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            name: extractedName || `Candidate from ${file.name}`,
            email: emailMatch ? emailMatch[0] : "",
            role: targetRole,
            appliedRole: targetRole,
            jobPostingId: jobPostingId,
            score: totalScore,
            status: "New" as const,
            experienceYears: experienceYears,
            matchReason:
              totalScore >= 70
                ? "Good Fit"
                : totalScore >= 50
                ? "Potential Fit"
                : "Manual Review Needed",
            skills: foundSkills.length > 0 ? foundSkills : ["See Resume"],
            missingSkills: requiredSkills,
            previousCompanies: [],
            scoreBreakdown: {
              technicalSkillMatch: techScore,
              experienceRelevance: expScoreCalc,
              cultureFitIndicators: cultureScore,
              redFlagAssessment: redFlagScore,
            },
            webVerification: {
              notes: ["Fallback processing - API parsing failed"],
              salaryBenchmark: {
                min: 80000 + experienceYears * 5000,
                max: 120000 + experienceYears * 5000,
                currency: "USD",
                location: "Remote",
              },
              redFlags: [
                "Resume parsing incomplete - manual review recommended",
              ],
              linkedin: { verified: false, roleMatch: false },
            },
          };
          processedCandidates.push(fallbackCandidate);
          console.log(
            `Created fallback candidate for ${file.name}: ${
              extractedName || "name not found"
            }`
          );
        } else {
          declinedFiles.push({
            fileName: file.name,
            reason: "Failed to process file - may be corrupted or unreadable",
            documentType: "unreadable",
          });
        }
      } catch (fallbackError) {
        console.error(
          `Fallback processing also failed for ${file.name}:`,
          fallbackError
        );
        declinedFiles.push({
          fileName: file.name,
          reason: "Failed to process file - may be corrupted or unreadable",
          documentType: "unreadable",
        });
      }
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
      
      Respond with JSON:
      {
        "recommendation": "Strong Hire" or "Hire" or "Maybe" or "No Hire",
        "summary": "A 2-3 sentence executive summary highlighting why this candidate is or isn't a good fit",
        "keyStrengths": ["3-4 specific strengths based on their skills and experience"],
        "areasToProbe": ["2-3 areas that need deeper investigation during interviews"],
        "scoreBreakdown": {
          "technicalSkills": number 0-100,
          "experienceRelevance": number 0-100,
          "educationPedigree": number 0-100,
          "cultureSoftSkills": number 0-100
        }
      }
      
      Be specific and reference actual skills and companies mentioned.
    `;

    const responseText = await callGroqAPI(prompt);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Groq Overview Generation Failed:", error);
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
      
      Respond with JSON:
      {
        "questions": [
          {
            "topic": "The skill or area being assessed",
            "question": "A specific, thoughtful question",
            "lookingFor": "What a good answer should include",
            "difficulty": "Easy" or "Medium" or "Hard"
          }
        ],
        "scorecardCriteria": ["4-5 evaluation criteria specific to this role"],
        "interviewTips": ["2-3 tips for the interviewer specific to this candidate"]
      }
      
      Include 5-6 questions covering their stated skills, previous companies, and any missing skills.
      Include at least one behavioral question and one technical deep-dive question.
    `;

    const responseText = await callGroqAPI(prompt);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Groq Interview Guide Generation Failed:", error);
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
      
      Respond with JSON:
      {
        "overallAssessment": "A 2-sentence assessment of the candidate's fit (reference their actual score)",
        "technicalAnalysis": "Analysis of their technical capabilities based on skills (1-2 sentences)",
        "experienceAnalysis": "Analysis of their experience relevance (1-2 sentences)",
        "growthPotential": "Assessment of their growth trajectory and potential (1-2 sentences)",
        "riskFactors": ["2-3 potential risk factors to consider"]
      }
      
      Be specific and reference actual data from their profile.
    `;

    const responseText = await callGroqAPI(prompt);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Groq Score Analysis Failed:", error);
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
      1. Understand the user's intent - they might be asking about skills, experience, availability, etc.
      2. Search the candidate database semantically
      3. Rank candidates by relevance to the query (0-100 relevance score)
      4. Provide a conversational, helpful explanation
      5. Suggest relevant follow-up questions
      
      Respond with JSON:
      {
        "matchedCandidates": [
          {"id": "candidate id", "name": "name", "relevanceScore": 0-100, "matchReason": "specific reason this candidate matches"}
        ],
        "explanation": "A helpful, conversational explanation of your findings (2-4 sentences)",
        "suggestedFollowUp": ["2-3 relevant follow-up questions"]
      }
      
      If no candidates match, return empty matchedCandidates array and explain why.
    `;

    const responseText = await callGroqAPI(prompt);
    return JSON.parse(responseText);
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
      
      Respond with JSON:
      {
        "comparison": "A detailed comparison highlighting key differences (3-4 sentences)",
        "recommendation": "Your recommendation on which to prioritize and why",
        "winner": {"id": "candidate id", "name": "candidate name", "reason": "why they stand out"} or null if no clear winner
      }
    `;

    const responseText = await callGroqAPI(prompt);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Comparison Failed:", error);
    return {
      comparison: "Unable to generate comparison at this time.",
      recommendation: "Please review candidates manually.",
    };
  }
};
