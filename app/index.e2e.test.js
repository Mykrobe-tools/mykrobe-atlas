/* @flow */

import http from 'http';
const { execSync } = require('child_process');
const webdriver = require('selenium-webdriver');

import {
  TIMEOUT,
  delay,
  describeSlowTest,
  beforeAllSlow,
  afterAllSlow,
} from '../desktop/test/util';

jest.setTimeout(TIMEOUT);

let driver: webdriver$WebDriver, child, server: any;

const By = webdriver.By; // useful Locator utility to describe a query for a WebElement
const until = webdriver.until; // useful utility to wait for something to happen
const waitForElement = (selector) =>
  driver.wait(until.elementLocated(By.css(selector)));
const findElement = (selector) => driver.findElement(By.css(selector));
const clickElement = (selector) => findElement(selector).click();

describe('Web e2e', () => {
  it('should contain a test', (done) => {
    done();
  });
});

process.on('SIGTERM', () => {
  // clean up any orophaned processes
  child && child.kill();
  driver && driver.quit();
});

describeSlowTest('Web e2e main window', function spec() {
  beforeAllSlow(() => {
    // try to connect to local server
    http.get('http://localhost:3000').on('error', () => {
      // if error then build production bundle
      // and start local server
      execSync('yarn web-build', { stdio: [0, 1, 2] });
      server = require('../web/build/simple-server');
    });
    driver = new webdriver.Builder().forBrowser('safari').build();
  });

  afterAllSlow(async (done) => {
    server && server.close();
    await driver.quit();
    done();
  });

  it('should open website', async () => {
    // wait for the server to boot up - takes longer for dev
    await delay(10000);
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
    await waitForElement('[id="root_email"]');
  });

  it('should log in', async () => {
    // set valid credentials
    await findElement('[id="root_email"]').sendKeys('simon@makeandship.com');
    await findElement('[id="root_password"]').sendKeys('password123');

    // submit
    await clickElement('[data-tid="button-submit"]');

    // should be back on front screen
    await waitForElement('[data-tid="component-upload"]');
  });

  xit('should log out', async () => {
    // sign out
    await clickElement('[data-tid="navbar-link-sign-out"]');

    // should be back on front screen
    await waitForElement('[data-tid="component-upload"]');
  });
});
