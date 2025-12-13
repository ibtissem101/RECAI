const pdfParse = require('pdf-parse');

async function processAndRankResumes(files) {
  // Mock AI processing function
  const rankedResults = files.map(file => {
    return {
      name: file.originalname,
      score: Math.random() * 100,  // Mock score
      skills: ['Python', 'React'],
    };
  });

  return { allRanked: rankedResults };
}

module.exports = { processAndRankResumes };
