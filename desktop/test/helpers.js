/* @flow */

import { Application } from 'spectron';
import path from 'path';
import fs from 'fs-extra';

import { EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH } from './util';

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
    // browserWindow.capturePage() is not reliable
    // so we capture screen within browser process
    const { webContents } = _app;
    const filePath = path.join(
      EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH,
      filename
    );
    fs.ensureDirSync(path.dirname(filePath));
    webContents.send('capture-page', filePath);
  };

  return {
    textForSelector,
    isExisting,
    saveScreenshot,
  };
};

export default createTestHelpers;
