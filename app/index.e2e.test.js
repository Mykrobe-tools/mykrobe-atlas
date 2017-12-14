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

INCLUDE_SLOW_TESTS &&
  describe('Web e2e main window', function spec() {
    beforeAll(() => {
      driver = new webdriver.Builder().forBrowser('chrome').build();
      child = exec('yarn web-hot-server');
      // child = exec('yarn web-build && yarn web-build-simple-server');
    });

    afterAll(() => {
      child.kill();
      driver.quit();
    });

    it('should open website', async () => {
      // wait a few seconds for the server to boot up
      await delay(3000);
      // ask the browser to open a page
      await driver.navigate().to('http://localhost:3000/');
    });

    it('should fail to log in', async () => {
      await driver.wait(
        until.elementLocated(By.css('[data-tid="button-log-in"]'))
      );
      await driver.findElement(By.css('[data-tid="button-log-in"]')).click();
      await driver.wait(
        until.elementLocated(By.css('[data-tid="input-email"]'))
      );

      await setValueForSelector(
        '[data-tid="input-email"]',
        'simon@makeandship.com'
      );

      await setValueForSelector('[data-tid="input-password"]', 'password');

      await driver.findElement(By.css('[data-tid="button-submit"]')).click();

      // FIXME: there is an issue here with infinite redirect loop on 401
    });
  });
