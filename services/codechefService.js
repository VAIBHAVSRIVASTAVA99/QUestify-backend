const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const fetchRandomCodeChefQuestion = async () => {
  const options = new chrome.Options();
  options.addArguments('--headless','--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage');
  // options.addArguments('--headless'); // Uncomment to run headless
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  try {
    // Step 1: Go to CodeChef Practice-Old
    await driver.get('https://www.codechef.com/practice-old');
    await driver.wait(until.elementLocated(By.css('table tbody tr')), 20000);
    
    // First locate the header row to find column indices
    const headers = await driver.findElements(By.css('table th'));
    let codeColumnIndex = -1;
    let nameColumnIndex = -1;
    let difficultyColumnIndex = -1;
    
    // Find which columns have the headers we're looking for
    for (let i = 0; i < headers.length; i++) {
      const headerText = await headers[i].getText();
      const trimmedText = headerText.trim();
      
      if (trimmedText === 'Code') {
        codeColumnIndex = i;
      } else if (trimmedText === 'Name') {
        nameColumnIndex = i;
      } else if (trimmedText === 'Difficulty') {
        difficultyColumnIndex = i;
      }
    }
    
    if (codeColumnIndex === -1) {
      throw new Error('Could not find Code column');
    }
    
    // Step 2: Get random row
    const rows = await driver.findElements(By.css('table tbody tr'));
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    
    // Step 3: Get problem code from the identified Code column (add 1 because CSS is 1-indexed)
    const codeCell = await randomRow.findElement(By.css(`td:nth-child(${codeColumnIndex + 1})`));
    const code = await codeCell.getText();
    
    // Get the problem name
    let title = 'Unknown';
    if (nameColumnIndex !== -1) {
      try {
        const nameCell = await randomRow.findElement(By.css(`td:nth-child(${nameColumnIndex + 1})`));
        title = await nameCell.getText();
      } catch (e) {
        console.warn('Title not found in the table');
      }
    }
    
    // Get the difficulty
    let difficulty = 'Unknown';
    if (difficultyColumnIndex !== -1) {
      try {
        const difficultyCell = await randomRow.findElement(By.css(`td:nth-child(${difficultyColumnIndex + 1})`));
        difficulty = await difficultyCell.getText();
      } catch (e) {
        console.warn('Difficulty not found in the table');
      }
    }
    
    // Construct the URL directly using the problem code
    const url = `https://www.codechef.com/problems/${code}`;
    
    // Return the results including difficulty
    return {
      status: 'success',
      platform: 'CodeChef',
      code,
      title,
      url,
      difficulty,
    };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return {
      status: 'failure',
      message: 'Could not fetch CodeChef question.',
    };
  } finally {
    await driver.quit();
  }
};

module.exports = fetchRandomCodeChefQuestion;