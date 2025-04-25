const VJudgeData = require('../models/VJudgeData');
const scrapeVJudgeHeatmap = require('../scarper/vjudge');

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function getVJudgeData(username) {
  try {
    // First check if we have cached data
    const cachedData = await VJudgeData.findOne({ username });
    
    if (cachedData) {
      const timeSinceLastUpdate = Date.now() - cachedData.lastUpdated.getTime();
      
      // If data is less than 24 hours old, return cached data
      if (timeSinceLastUpdate < CACHE_DURATION) {
        return {
          success: true,
          fromCache: true,
          data: cachedData
        };
      }
    }
    
    // If no cached data or data is old, scrape new data
    const scrapedData = await scrapeVJudgeHeatmap(username);
    
    if (!scrapedData.success) {
      return {
        success: false,
        error: scrapedData.error
      };
    }
    
    // Update or create new record in database
    const vjudgeData = {
      username,
      data: scrapedData.data,
      totalProblemsFound: scrapedData.totalProblemsFound,
      lastUpdated: new Date()
    };
    
    await VJudgeData.findOneAndUpdate(
      { username },
      vjudgeData,
      { upsert: true, new: true }
    );
    
    return {
      success: true,
      fromCache: false,
      data: vjudgeData
    };
    
  } catch (error) {
    console.error('Error in getVJudgeData:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  getVJudgeData
}; 