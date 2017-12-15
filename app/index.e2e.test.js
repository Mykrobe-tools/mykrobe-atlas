const { exec } = require('child_process');
const webdriver = require('selenium-webdriver');
const By = webdriver.By; // useful Locator utility to describe a query for a WebElement
const until = webdriver.until; // useful utility to wait for something to happen

import { INCLUDE_SLOW_TESTS } from '../desktop/util';

jest.setTimeout(10 * 60 * 1000); // 10 minutes

const delay = time => new Promise(resolve => setTimeout(resolve, time));

// sendKeys() doesn't seem to work for form fields, so inject values using js
const setValueForSelector = async (selector, value) => {
  await driver.executeScript(
    `document.querySelectorAll('${selector}')[0].value='${value}';`
  );
};

describe('Web e2e prerequisites', () => {
  it('should contain a test', done => {
    done();
  });
});

let driver, child;

const USE_PRODUCTION_BUILD = false;

INCLUDE_SLOW_TESTS &&
  describe('Web e2e main window', function spec() {
    beforeAll(() => {
      driver = new webdriver.Builder().forBrowser('chrome').build();
      if (USE_PRODUCTION_BUILD) {
        child = exec('yarn web-build && yarn web-build-server');
      } else {
        child = exec('yarn web-hot-server');
      }
    });

    afterAll(() => {
      child.kill();
      driver.quit();
    });

    it('should open website', async () => {
      await delay(500);
      await driver.navigate().to('http://localhost:3000/');
      // wait for the server to boot up - takes longer in production
      await delay(USE_PRODUCTION_BUILD ? 30000 : 3000);
      // ask the browser to open a page
      await driver.navigate().to('http://localhost:3000/');
    });

    it('should fail to log in', async () => {
      // navigate to login screen
      await driver.wait(
        until.elementLocated(By.css('[data-tid="button-log-in"]'))
      );
      await driver.findElement(By.css('[data-tid="button-log-in"]')).click();
      await driver.wait(
        until.elementLocated(By.css('[data-tid="input-email"]'))
      );

      // set invalid credentials
      await setValueForSelector(
        '[data-tid="input-email"]',
        'simon@makeandship.com'
      );
      await setValueForSelector('[data-tid="input-password"]', 'password');

      // submit
      await driver.findElement(By.css('[data-tid="button-submit"]')).click();

      // loading
      await driver.wait(
        until.elementLocated(By.css('[data-tid="component-loading"]'))
      );

      // should be back on login screen
      await driver.wait(
        until.elementLocated(By.css('[data-tid="button-submit"]'))
      );
    });
  });
