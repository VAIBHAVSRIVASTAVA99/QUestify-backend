const fetchRandomLeetCodeQuestion = require("./leetcodeService");
const fetchRandomCodeforcesQuestion = require("./codeforcesService");
const fetchRandomCodeChefQuestion = require("./codechefService");

const fetchRandomQuestion = async () => {
  const sources = [
    fetchRandomLeetCodeQuestion,
    fetchRandomCodeforcesQuestion,
    fetchRandomCodeChefQuestion,
  ];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  return await randomSource();
};

// ✅ Add this export block
module.exports = {
  fetchRandomLeetCodeQuestion,
  fetchRandomCodeforcesQuestion,
  fetchRandomCodeChefQuestion,
  fetchRandomQuestion
};
