const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function scrapeVJudgeHeatmap(username) {
  if (!username || typeof username !== 'string') {
    return { success: false, error: 'Invalid username provided' };
  }

  const url = `https://vjudge.net/user/${encodeURIComponent(username)}`;
  const options = new chrome.Options();
  options.addArguments('--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage');
  
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  
  try {
    console.log(`Navigating to ${url}`);
    await driver.get(url);
    
    // Wait for page to load
    await driver.wait(until.elementLocated(By.css('svg')), 15000);
    await driver.sleep(3000);
    
    // Generate all Fridays from 2024-12-13 to current date
    const fridays = getAllFridaysFromDateToNow('2024-12-13');
    console.log(`Going to check ${fridays.length} Fridays`);
    
    const results = [];
    
    for (const fridayDate of fridays) {
      const dateStr = fridayDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      console.log(`Processing ${dateStr}`);
      
      try {
        // Find the rectangle for this date
        const dateRects = await driver.findElements(By.css('svg rect[data-date]'));
        
        let targetRect = null;
        let rectData = {};
        
        for (const rect of dateRects) {
          const dateAttr = await rect.getAttribute('data-date');
          if (dateAttr && dateAttr === dateStr) {
            targetRect = rect;
            
            rectData.date = dateAttr;
            rectData.fill = await rect.getCssValue('fill');
            rectData.dataItems = await rect.getAttribute('data-items');
            rectData.dataLegend = await rect.getAttribute('data-legend');
            
            break;
          }
        }
        
        if (!targetRect) {
          console.log(`No rectangle found for date ${dateStr}`);
          results.push({
            date: dateStr,
            color: '',
            count: 0,
            problems: []
          });
          continue;
        }
        
        // Click the rectangle using WebDriver actions
        const actions = driver.actions({async: true});
        await actions.move({origin: targetRect}).click().perform();
        
        // Wait for problem list to load
        await driver.sleep(2000);
        
        // Get problem data
        const rows = await driver.findElements(By.css('table tr'));
        const problemsData = [];
        
        if (rows.length > 1) {
          for (let i = 1; i < rows.length; i++) {
            const cells = await rows[i].findElements(By.css('td'));
            
            if (cells.length >= 5) {
              const problemData = {
                origin: await cells[1].getText(),
                title: await cells[2].getText(),
                solved: await cells[3].getText(),
                source: await cells[4].getText(),
                contest: cells.length >= 6 ? await cells[5].getText() : ''
              };
              
              problemsData.push(problemData);
            }
          }
        }
        
        results.push({
          date: dateStr,
          color: rectData.fill || '',
          count: problemsData.length,
          problems: problemsData
        });
        
        // Navigate back to the user page to reset for the next date check
        // (This is needed because clicking on a date changes the view)
        await driver.get(url);
        await driver.wait(until.elementLocated(By.css('svg')), 15000);
        await driver.sleep(2000);
        
      } catch (dateErr) {
        console.error(`Error processing date ${dateStr}: ${dateErr.message}`);
        results.push({
          date: dateStr,
          error: dateErr.message,
          count: 0,
          problems: []
        });
        
        // Try to recover for the next iteration
        await driver.get(url);
        await driver.wait(until.elementLocated(By.css('svg')), 15000);
        await driver.sleep(2000);
      }
    }
    
    await driver.quit();
    
    return { 
      success: true, 
      username: username,
      totalFridaysChecked: fridays.length,
      totalProblemsFound: results.reduce((sum, day) => sum + day.count, 0),
      data: results
    };
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    await driver.quit();
    return { 
      success: false, 
      error: err.message || 'Heatmap scraping failed',
      timestamp: new Date().toISOString()
    };
  }
}

// Helper function to get all Fridays from a start date to now
function getAllFridaysFromDateToNow(startDateStr) {
  const startDate = new Date(startDateStr);
  const today = new Date();
  const fridays = [];
  
  // Find the first Friday on or after the start date
  let currentDate = new Date(startDate);
  while (currentDate.getDay() !== 5) { // 5 is Friday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add all Fridays from the first one found to today
  while (currentDate <= today) {
    fridays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7); // Add 7 days to get to the next Friday
  }
  
  return fridays;
}

module.exports = scrapeVJudgeHeatmap;