/* @flow */

import MykrobeBaseFileAnalyser from './MykrobeBaseFileAnalyser';
import { BASE_URL } from '../constants/APIConstants';

class MykrobeWebFileAnalyser extends MykrobeBaseFileAnalyser {
  _progress: number;
  _timeout: number;
  _file: File;

  analyseBinaryFile(file: File): MykrobeWebFileAnalyser {
    this._file = file;
    console.log('analyseBinaryFile', file);
    console.error('TODO: upload file to API and report progress');
    this._progress = 0;
    this.fetchDemoData();
    return this;
  }

  fetchDemoData() {
    const fileName = this._file.name;
    fetch(`${BASE_URL}/treeplace?file=${fileName}`)
      .then((response) => {
        if (response.ok) {
          response.text().then((string) => {
            this.doneWithJsonString(string);
          });
        }
        else {
          this.failWithError(response.statusText);
        }
      });
  }

  cancel(): void {
    this._timeout && clearTimeout(this._timeout);
  }

}

export default MykrobeWebFileAnalyser;
