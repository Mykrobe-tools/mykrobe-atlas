/* @flow */

import AnalyserBaseFile from './AnalyserBaseFile';
import AnalyserJsonTransformer from './AnalyserJsonTransformer';
import fetchJson from '../../api/fetchJson';
import { BASE_URL } from '../../constants/APIConstants';

class AnalyserWebFile extends AnalyserBaseFile {
  _progress: number;
  _timeout: number;
  _file: File;

  analyseBinaryFile(file: File, id: string = ''): AnalyserWebFile {
    this._file = file;
    this._progress = 0;
    this.updateProgress();
    this.fetchExperiment(id)
      .then((result) => {
        this._timeout && clearTimeout(this._timeout);
        if (this._progress < 100) {
          this._progress = 100;
          this.emit('progress', this._progress);
          this._timeout = setTimeout(() => {
            this.emit('done', result);
          }, 3000);
        }
        else {
          this.emit('done', result);
        }
      })
      .catch((error) => {
        this.emit('error', error);
      });
    return this;
  }

  updateProgress() {
    this._timeout && clearTimeout(this._timeout);
    this._progress++;
    this.emit('progress', this._progress);
    if (this._progress < 100) {
      this._timeout = setTimeout(() => {
        this.updateProgress();
      }, 200);
    }
  }

  fetchExperiment(id: string) {
    return fetchJson(`${BASE_URL}/experiments/${id}`)
      .then((json) => {
        if (json.geoDistance && json.snpDistance) {
          json = this.addExtraData(json);
          const transformer = new AnalyserJsonTransformer();
          const transformed = transformer.transformModel(json);
          const result = {json, transformed};
          return Promise.resolve(result);
        }
        else {
          return Promise.resolve({json, transformed: json});
        }
      })
      .catch((error) => {
        return Promise.reject({description: error});
      });
  }

  addExtraData(json: Object) {
    const testData = require('../../../test/_fixtures/api/experiment-extras.json');
    json.geoDistance.experiments = testData.experiments;
    json.snpDistance.newick = testData.newick;
    return json;
  }
}

export default AnalyserWebFile;
