import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Mocks the extraction analysis but actually uses Gemini to generate the reasoning text dynamically
export const analyzeCandidateProfile = async (candidateName: string, role: string, rawText: string) => {
  try {
    const model = 'gemini-2.5-flash';
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
            interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback data if API fails or key is missing
    return {
      summary: "Highly experienced engineer with strong background in scalable systems.",
      strengths: ["Python", "System Design", "Leadership"],
      cultureFit: "Shows strong alignment with mission-driven engineering.",
      interviewQuestions: [
        "Tell me about a time you scaled a database.",
        "How do you handle technical debt?",
        "Describe your experience with microservices."
      ]
    };
  }
};

export const generateEmailDraft = async (candidateName: string, status: 'Interview' | 'Reject', keyHighlights: string[]) => {
   try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a recruitment email for ${candidateName}.
      Status: ${status} (Interview Invitation or Rejection).
      Key Highlights verified from web: ${keyHighlights.join(', ')}.
      
      Tone: Professional, personalized, and engaging.
      For Interview: Mention specific achievements.
      For Reject: Be constructive and respectful.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Email Generation Failed:", error);
    return `Dear ${candidateName},\n\nWe reviewed your application and would like to proceed...`;
  }
};
