// routes/vjudgeRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import the User model
const { getVJudgeData } = require("../services/vjudgeService");

// Route: GET /api/vjudge/:username - Get VJudge data with caching
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const result = await getVJudgeData(username);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.json({
      success: true,
      fromCache: result.fromCache,
      username: result.data.username,
      totalProblemsFound: result.data.totalProblemsFound,
      lastUpdated: result.data.lastUpdated,
      data: result.data.data
    });
    
  } catch (error) {
    console.error('Error in VJudge route:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve VJudge data'
    });
  }
});

// Route: POST /api/vjudge/:username/store/:name - Scrape and store data for a user
// router.post("/:username/store/:name", async (req, res) => {
//   try {
//     const { username, name } = req.params;
    
//     // Find the user
//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(404).json({
//         success: false, 
//         error: `User '${name}' not found`
//       });
//     }
    
//     // Check if user already has a VJudge profile
//     const vjudgeProfileIndex = user.platformProfiles.findIndex(
//       p => p.platform === 'VJudge'
//     );
    
//     // Add or update VJudge profile
//     if (vjudgeProfileIndex >= 0) {
//       user.platformProfiles[vjudgeProfileIndex].username = username;
//     } else {
//       user.platformProfiles.push({
//         platform: 'VJudge',
//         username: username
//       });
//     }
    
//     // Scrape VJudge data
//     const scrapedData = await scrapeVJudgeHeatmap(username);
    
//     if (!scrapedData.success) {
//       return res.status(400).json(scrapedData);
//     }
    
//     // Process each day's data
//     for (const dayData of scrapedData.data) {
//       const date = new Date(dayData.date);
      
//       // Check if we already have this day's data
//       const existingDayIndex = user.dailyActivities.findIndex(
//         activity => 
//           activity.platform === 'VJudge' && 
//           new Date(activity.date).toISOString().split('T')[0] === date.toISOString().split('T')[0]
//       );
      
//       // Create problems array from the data
//       const problems = dayData.problems.map(problem => ({
//         origin: problem.origin,
//         contest: problem.contest,
//         solvedAt: date
//       }));
      
//       const dailyActivity = {
//         date,
//         count: dayData.count,
//         platform: 'VJudge',
//         problems
//       };
      
//       if (existingDayIndex >= 0) {
//         // Update existing day
//         user.dailyActivities[existingDayIndex] = dailyActivity;
//       } else {
//         // Add new day
//         user.dailyActivities.push(dailyActivity);
//       }
//     }
    
//     // Update last scraped timestamp
//     const profileIndex = user.platformProfiles.findIndex(p => p.platform === 'VJudge');
//     if (profileIndex >= 0) {
//       user.platformProfiles[profileIndex].lastScraped = new Date();
//     }
    
//     await user.save();
    
//     return res.json({ 
//       success: true, 
//       message: `Updated VJudge data for ${name}`, 
//       username,
//       totalDays: scrapedData.data.length,
//       totalProblems: scrapedData.totalProblemsFound
//     });
    
//   } catch (error) {
//     console.error('Error storing VJudge data:', error);
//     return res.status(500).json({ 
//       success: false, 
//       error: error.message || 'Failed to store VJudge data' 
//     });
//   }
// });

// // Route: GET /api/vjudge/user/:name - Get VJudge data for a specific user
// router.get("/user/:name", async (req, res) => {
//   try {
//     const { name } = req.params;
    
//     // Find the user
//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(404).json({
//         success: false, 
//         error: `User '${name}' not found`
//       });
//     }
    
//     // Get VJudge profile
//     const vjudgeProfile = user.platformProfiles.find(p => p.platform === 'VJudge');
//     if (!vjudgeProfile) {
//       return res.status(404).json({
//         success: false, 
//         error: `No VJudge profile found for user '${name}'`
//       });
//     }
    
    // Get VJudge activities
    // const vjudgeActivities = user.dailyActivities.filter(
    //   activity => activity.platform === 'VJudge'
    // ).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // return res.json({
    //   success: true,
    //   name,
    //   vjudgeUsername: vjudgeProfile.username,
    //   lastScraped: vjudgeProfile.lastScraped,
    //   totalDays: vjudgeActivities.length,
    //   totalProblems: vjudgeActivities.reduce((sum, day) => sum + day.count, 0),
    //   activities: vjudgeActivities
    // });
    
//   } catch (error) {
//     console.error('Error retrieving VJudge data:', error);
//     return res.status(500).json({ 
//       success: false, 
//       error: error.message || 'Failed to retrieve VJudge data' 
//     });
//   }
// });

module.exports = router;