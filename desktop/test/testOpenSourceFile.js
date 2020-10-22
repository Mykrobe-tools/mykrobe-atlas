/* @flow */

import { Application } from 'spectron';

import debug from 'debug';
const d = debug('mykrobe:desktop-test:test-open-source-file');

import { TIMEOUT, delay, fileNamesAndPathsForSource } from './util';

import createTestHelpers from './helpers';

const testOpenSourceFile = async (
  source: string | Array<string>,
  exemplarSamplesExpectEntry: any,
  app: Application
) => {
  if (!app) {
    throw 'Missing argument app';
  }
  const { isExisting, textForSelector, saveScreenshot } = createTestHelpers(
    app
  );
  const { client, webContents } = app;

  const { filePaths, isJson, displayName } = fileNamesAndPathsForSource(source);

  // send file > open event
  webContents.send('open-file', filePaths);

  if (!isJson) {
    // await UI change
    await delay(500);

    // check existence of cancel button
    expect(await isExisting('[data-tid="button-analyse-cancel"]')).toBe(true);

    // check status text
    expect(
      (await client.element('[data-tid="status-text"]').getText()).toLowerCase()
    ).toBe('analysing');

    // TODO check for progress changes once reinstated
  }

  if (exemplarSamplesExpectEntry.expect.reject) {
    d('awaiting rejection');
    d(
      'exemplarSamplesExpectEntry.expect',
      JSON.stringify(exemplarSamplesExpectEntry.expect, null, 2)
    );
    // should display an error notification rejecting this file
    await client.waitForVisible(
      '[data-tid="component-notification-content"]',
      TIMEOUT
    );
    const notifications = await textForSelector(
      '[data-tid="component-notification-content"]'
    );
    await saveScreenshot(`${displayName}__rejection__.png`);
    expect(
      notifications[0].includes('does not give susceptibility predictions')
    ).toBeTruthy();
  } else {
    // wait for results to appear
    await client.waitForVisible('[data-tid="component-resistance"]', TIMEOUT);
  }
};

export default testOpenSourceFile;
