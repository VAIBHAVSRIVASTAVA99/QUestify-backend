const fetchRandomCodeforcesQuestion = async () => {
    try {
      const response = await axios.get('https://codeforces.com/api/problemset.problems');
      const problems = response.data.result.problems;
  
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];
      return {
        platform: "Codeforces",
        title: `${randomProblem.name} (${randomProblem.contestId}${randomProblem.index})`,
        url: `https://codeforces.com/contest/${randomProblem.contestId}/problem/${randomProblem.index}`,
        difficulty: randomProblem.rating ? `${randomProblem.rating} Rating` : "Unrated",
      };
    } catch (error) {
      console.error('Error fetching Codeforces question:', error.message);
      return null;
    }
  };
  