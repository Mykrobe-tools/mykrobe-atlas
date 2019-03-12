/* @flow */

import { Application } from 'spectron';

import { pkg, delay } from './util';

const testOpenWindow = async (app: Application) => {
  if (!app) {
    throw 'Missing argument app';
  }
  const { client, browserWindow } = app;

  await client.waitUntilWindowLoaded();
  await delay(500);

  const title = await browserWindow.getTitle();
  expect(title).toBe(pkg.productName);

  const isDevToolsOpened = await browserWindow.isDevToolsOpened();
  expect(isDevToolsOpened).toBeFalsy();

  const isMinimized = await browserWindow.isMinimized();
  expect(isMinimized).toBeFalsy();

  const isVisible = await browserWindow.isVisible();
  expect(isVisible).toBeTruthy();

  const isFocused = await browserWindow.isFocused();
  expect(isFocused).toBeTruthy();

  const bounds = await browserWindow.getContentBounds();

  expect(bounds.width).toBeGreaterThanOrEqual(640);
  expect(bounds.height).toBeGreaterThanOrEqual(480);

  // make large enough to see 'evidence' tab in screen grab
  await browserWindow.setContentSize(1024, 1024);
  await browserWindow.center();
};

export default testOpenWindow;
