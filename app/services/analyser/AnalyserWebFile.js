/* @flow */

import AnalyserBaseFile from './AnalyserBaseFile';
import { BASE_URL } from '../../constants/APIConstants';

class AnalyserWebFile extends AnalyserBaseFile {
  _progress: number;
  _timeout: number;
  _file: File;

  analyseBinaryFile(file: File): AnalyserWebFile {
    this._file = file;
    console.log('analyseBinaryFile', file);
    console.error('TODO: upload file to API and report progress');
    this._progress = 0;
    this.demoUpdateProgress();
    this.fetchDemoData();
    return this;
  }

  demoUpdateProgress() {
    this._timeout && clearTimeout(this._timeout);
    this._progress++;
    this.emit('progress', this._progress);
    if (this._progress < 100) {
      this._timeout = setTimeout(() => {
        this.demoUpdateProgress();
      }, 200);
    }
  }

  fetchDemoData() {
    const fileName = this._file.name;
    fetch(`${BASE_URL}/api/experiments/${fileName}`)
      .then((response) => {
        clearTimeout(this._timeout);
        if (response.ok) {
          response.text().then((string) => {
            if (this._progress < 100) {
              this._progress = 100;
              this.emit('progress', this._progress);
              this._timeout = setTimeout(() => {
                this.handleDemoData(string);
              }, 3000);
            }
            else {
              this.handleDemoData(string);
            }
          });
        }
        else {
          this.failWithError(response.statusText);
          this.end();
        }
      });
  }

  handleDemoData(string: string) {
    this.doneWithJsonString(string);
    this.end();
  }

  end(): void {
    this._timeout && clearTimeout(this._timeout);
  }
}

export default AnalyserWebFile;
