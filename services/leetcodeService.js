const fetchRandomLeetCodeQuestion = async () => {
    try {
      const response = await axios.get('https://leetcode.com/api/problems/all/');
      const problems = response.data.stat_status_pairs;
  
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];
      return {
        platform: "LeetCode",
        title: randomProblem.stat.question__title,
        url: `https://leetcode.com/problems/${randomProblem.stat.question__title_slug}/`,
        difficulty: randomProblem.difficulty.level === 1 ? "Easy" :
                    randomProblem.difficulty.level === 2 ? "Medium" : "Hard",
      };
    } catch (error) {
      console.error('Error fetching LeetCode question:', error.message);
      return null;
    }
  };
  