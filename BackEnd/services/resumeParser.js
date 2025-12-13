const pdfParse = require('pdf-parse');
const fs = require('fs');

// A simple function to extract text from PDF files
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdfParse(dataBuffer);
    return data.text; // Extract text from the PDF
  } catch (err) {
    console.error("Error parsing PDF:", err);
    throw new Error("Error parsing the resume");
  }
}

// Function to rank candidates based on keywords (very basic ranking example)
function rankCandidateBySkills(candidateText, requiredSkills) {
  let matchCount = 0;
  requiredSkills.forEach(skill => {
    if (candidateText.toLowerCase().includes(skill.toLowerCase())) {
      matchCount += 1;
    }
  });
  return matchCount;
}

// Resume Parsing and Ranking (simplified)
async function processAndRankResumes(files, jobSkills) {
  const results = [];

  for (const file of files) {
    const filePath = file.path; // Assuming files are saved in ./uploads
    const resumeText = await extractTextFromPDF(filePath);
    const matchScore = rankCandidateBySkills(resumeText, jobSkills);

    // Create a mock ranked result
    results.push({
      name: file.originalname,
      score: matchScore,
      skills: jobSkills,  // Placeholder, you would normally extract actual skills from resume
    });
  }

  // Sort candidates by match score
  results.sort((a, b) => b.score - a.score);

  // For simplicity, we're assuming the first candidate is confirmed, second in waitlist, etc.
  return {
    allRanked: results,
    confirmed: results.slice(0, 1),
    waitlist: results.slice(1, 2),
    rejected: results.slice(2),
    declined: [],  // We'll handle invalid resumes separately
  };
}

module.exports = { processAndRankResumes };
