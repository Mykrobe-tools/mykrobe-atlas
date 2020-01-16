/* @flow */

import { Application } from 'spectron';
import path from 'path';
import fs from 'fs-extra';

import { delay, EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH } from './util';

const createTestHelpers = (_app: Application) => {
  const textForSelector = async (selector: string, asArray: boolean = true) => {
    const { client } = _app;
    const { value } = await client.elements(selector);
    let result = [];
    for (let i = 0; i < value.length; i++) {
      const r = await client.elementIdText(value[i].ELEMENT);
      result.push(r.value);
    }
    return asArray || result.length > 1 ? result : result[0];
  };

  // convenience to tell us which element wasn't found

  const isExisting = async (selector: string) => {
    const { client } = _app;
    const existing = await client.isExisting(selector);
    if (!existing) {
      throw `Element not found for selector ${selector}`;
    }
    return existing;
  };

  // convenience to save screenshot

  const saveScreenshot = async (filename: string) => {
    const filePath = path.join(
      EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH,
      filename
    );
    console.log('saveScreenshot', filePath);
    fs.ensureDirSync(path.dirname(filePath));

    // browserWindow.capturePage() is not reliable
    // _app.client.saveScreenshot(filePath); does not work
    // so we capture screen within browser process
    // in current Electron version, this is async and there is no sync capture method
    // so we wait 1000ms to give time for async capture to finish
    // TODO: find a guaranteed method of screen capture completion
    const { webContents } = _app;
    webContents.send('capture-page', filePath);
    await delay(1000);
  };

  return {
    textForSelector,
    isExisting,
    saveScreenshot,
  };
};

export default createTestHelpers;
