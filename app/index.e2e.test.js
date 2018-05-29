/* @flow */

jest.setTimeout(10 * 60 * 1000); // 10 minutes

import http from 'http';
const { execSync } = require('child_process');
const webdriver = require('selenium-webdriver');

import { INCLUDE_SLOW_TESTS } from '../desktop/util';
import MykrobeConfig from '../app/services/MykrobeConfig';
const config = new MykrobeConfig();

// disable to help with modifying tests
const USE_PRODUCTION_BUILD = true;

let driver: webdriver$WebDriver, child, server: any;

const delay = (time: number = 300) =>
  new Promise(resolve => setTimeout(resolve, time));
const By = webdriver.By; // useful Locator utility to describe a query for a WebElement
const until = webdriver.until; // useful utility to wait for something to happen
const waitForElement = selector =>
  driver.wait(until.elementLocated(By.css(selector)));
const findElement = selector => driver.findElement(By.css(selector));
const clickElement = selector => findElement(selector).click();

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
        if (process.env.INCLUDE_SLOW_TESTS) {
          // try to connect to local server
          http.get('http://localhost:3000').on('error', () => {
            // if error then build production bundle
            // and start local server
            execSync('yarn web-build', { stdio: [0, 1, 2] });
            server = require('../web/build/simple-server');
          });
          driver = new webdriver.Builder().forBrowser('safari').build();
        }
      });

      afterAll(async done => {
        if (process.env.INCLUDE_SLOW_TESTS) {
          server && server.close();
          await driver.quit();
          done();
        }
      });

      it('should open website', async () => {
        // wait for the server to boot up - takes longer for dev
        await delay(USE_PRODUCTION_BUILD ? 5000 : 10000);
        // clear cookies to start a new session
        await driver.manage().deleteAllCookies();
        // ask the browser to open a page
        await driver.get('http://localhost:3000/');
      });

      it('should navigate to log in screen', async () => {
        await waitForElement('[data-tid="button-log-in"]');
        // wait for menu to disappear
        // TODO: alter menu css so that menu is initially hidden
        await delay(1000);
        await clickElement('[data-tid="button-log-in"]');
        await waitForElement('[data-tid="input-email"]');
      });

      it('should log in', async () => {
        // set valid credentials
        await findElement('[data-tid="input-email"]').sendKeys(
          'simon@makeandship.com'
        );
        await findElement('[data-tid="input-password"]').sendKeys(
          'password123'
        );

        // submit
        await clickElement('[data-tid="button-submit"]');

        // should be back on login screen
        await waitForElement('[data-tid="button-sign-out"]');
      });

      it('should log out', async () => {
        // sign out
        await clickElement('[data-tid="button-sign-out"]');

        // should be back on front screen
        await waitForElement('[data-tid="component-upload"]');
      });
    });
}
