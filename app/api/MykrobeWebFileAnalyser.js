/* @flow */

import MykrobeBaseFileAnalyser from './MykrobeBaseFileAnalyser';
import { BASE_URL } from 'constants/APIConstants';

class MykrobeWebFileAnalyser extends MykrobeBaseFileAnalyser {
  _progress: number;
  _timeout: number;
  _file: File;

  analyseBinaryFile(file: File): MykrobeWebFileAnalyser {
    this._file = file;
    console.log('analyseBinaryFile', file);
    console.error('TODO: upload file to API and report progress');
    this._progress = 0;
    this.demoUpdateProgress();
    return this;
  }

  demoUpdateProgress() {
    this._timeout && clearTimeout(this._timeout);
    this._progress++;
    this.emit('progress', {
      progress: this._progress,
      total: 100
    });
    if (100 === this._progress) {
      this._timeout = setTimeout(() => {
        this.demoFinishAnalysing();
      }, 3000);
    }
    else {
      this._timeout = setTimeout(() => {
        this.demoUpdateProgress();
      }, 100);
    }
  }

  demoFinishAnalysing() {
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
