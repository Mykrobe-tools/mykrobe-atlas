const { exec } = require('child_process');
const webdriver = require('selenium-webdriver');
const By = webdriver.By; // useful Locator utility to describe a query for a WebElement
const until = webdriver.until; // useful utility to wait for something to happen

jest.setTimeout(10 * 60 * 1000); // 10 minutes

const delay = time => new Promise(resolve => setTimeout(resolve, time));

describe('Web e2e main window', function spec() {
  beforeAll(() => {
    this.driver = new webdriver.Builder().forBrowser('chrome').build();
    this.child = exec('yarn web-hot-server');
  });

  afterAll(() => {
    this.child.kill();
    this.driver.quit();
  });

  it('should open website', async () => {
    // wait a few seconds for the server to boot up
    await delay(3000);
    // ask the browser to open a page
    await this.driver.navigate().to('http://localhost:3000/');
  });

  it('should fail to log in', async () => {
    await this.driver.wait(
      until.elementLocated(By.css('[data-tid="button-log-in"]'))
    );
    await this.driver.findElement(By.css('[data-tid="button-log-in"]')).click();
    await this.driver.wait(
      until.elementLocated(By.css('[data-tid="input-email"]'))
    );
    await this.driver
      .findElement(By.css('[data-tid="input-email"]'))
      .sendKeys('simon@makeandship.com');
    await this.driver
      .findElement(By.css('[data-tid="input-password"]'))
      .sendKeys('password');

    await this.driver.findElement(By.css('[data-tid="button-submit"]')).click();
  });
});
