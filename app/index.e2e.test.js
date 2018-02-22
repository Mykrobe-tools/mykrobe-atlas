const { exec, execSync } = require('child_process');
const webdriver = require('selenium-webdriver');
const By = webdriver.By; // useful Locator utility to describe a query for a WebElement
const until = webdriver.until; // useful utility to wait for something to happen

import { INCLUDE_SLOW_TESTS } from '../desktop/util';
import MykrobeConfig from '../app/services/MykrobeConfig';
const config = new MykrobeConfig();

// disable to help with modifying tests
const USE_PRODUCTION_BUILD = true;

jest.setTimeout(10 * 60 * 1000); // 10 minutes

const delay = time => new Promise(resolve => setTimeout(resolve, time));
let driver, child;

// sendKeys() doesn't seem to work for form fields, so inject values using js
const setValueForSelector = async (selector, value) => {
  await driver.executeScript(
    `document.querySelectorAll('${selector}')[0].value='${value}';`
  );
};

describe('Web e2e', () => {
  it('should contain a test', done => {
    done();
  });
});

process.on('SIGTERM', () => {
  // clean up any orophaned processes
  child && child.kill();
  driver && driver.quit();
});

// dont run if using electron
if (config.isDesktop()) {
  console.log('Desktop app - not running index.e2e.test.js');
} else {
  INCLUDE_SLOW_TESTS &&
    describe('Web e2e main window', function spec() {
      beforeAll(() => {
        driver = new webdriver.Builder().forBrowser('safari').build();
        if (USE_PRODUCTION_BUILD) {
          execSync('yarn web-build');
          child = exec('yarn web-build-server');
        } else {
          child = exec('yarn web-hot-server');
        }
      });

      afterAll(() => {
        child.kill();
        driver.quit();
        child = null;
        driver = null;
      });

      it('should open website', async () => {
        // wait for the server to boot up - takes longer for dev
        await delay(USE_PRODUCTION_BUILD ? 5000 : 10000);
        // ask the browser to open a page
        await driver.navigate().to('http://localhost:3000/');
        // clear cookies to start a new session
        await driver.manage().deleteAllCookies();
        // refresh
        await driver.navigate().to('http://localhost:3000/');
      });

      it('should navigate to log in screen', async () => {
        await driver.wait(
          until.elementLocated(By.css('[data-tid="button-log-in"]'))
        );
        await driver.findElement(By.css('[data-tid="button-log-in"]')).click();
        await driver.wait(
          until.elementLocated(By.css('[data-tid="input-email"]'))
        );
      });

      it('should fail to log in', async () => {
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

      it('should log in', async () => {
        // set valid credentials
        await setValueForSelector(
          '[data-tid="input-email"]',
          'simon@makeandship.com'
        );
        await setValueForSelector('[data-tid="input-password"]', 'password123');

        // submit
        await driver.findElement(By.css('[data-tid="button-submit"]')).click();

        // loading
        await driver.wait(
          until.elementLocated(By.css('[data-tid="component-loading"]'))
        );

        // should be back on login screen
        await driver.wait(
          until.elementLocated(By.css('[data-tid="button-sign-out"]'))
        );
      });

      it('should log out', async () => {
        // sign out
        await driver
          .findElement(By.css('[data-tid="button-sign-out"]'))
          .click();

        // should be back on front screen
        await driver.wait(
          until.elementLocated(By.css('[data-tid="component-upload"]'))
        );
      });
    });
}
