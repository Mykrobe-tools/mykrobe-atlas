/* @flow */

import AnalyserBaseFile from './AnalyserBaseFile';
import AnalyserJsonTransformer from './AnalyserJsonTransformer';
import { fetchJsonWithToken } from '../../modules/api';
import { API_URL } from '../../constants/APIConstants';

// TODO: refactor to use redux actions, load user from state rather than direct from CredentialsHelpers
import * as CredentialsHelpers from '../../helpers/CredentialsHelpers';

class AnalyserWebFile extends AnalyserBaseFile {
  _progress: number;
  _timeout: number;
  _file: File;

  analyseBinaryFile(file: File, id: string = ''): AnalyserWebFile {
    this._file = file;
    this._progress = 0;
    this.updateProgress();
    this.requestExperiment(id)
      .then(result => {
        this._timeout && clearTimeout(this._timeout);
        if (this._progress < 100) {
          this._progress = 100;
          this.emit('progress', this._progress);
          this._timeout = setTimeout(() => {
            this.emit('done', result);
          }, 3000);
        } else {
          this.emit('done', result);
        }
      })
      .catch(error => {
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

  requestExperiment(id: string) {
    const token = CredentialsHelpers.accessToken();
    return fetchJsonWithToken(`${API_URL}/experiments/${id}`, {}, token)
      .then(json => {
        json = this.addExtraData(json);
        const transformer = new AnalyserJsonTransformer();
        const transformed = transformer.transformModel(json);
        const result = { json, transformed };
        return Promise.resolve(result);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  addExtraData(json: Object) {
    const testData = require('../../../test/__fixtures__/api/experiment.json')
      .data;
    if (!json.location) {
      json.location = testData.location;
    }
    if (!json.geoDistance) {
      json.geoDistance = testData.geoDistance;
    }
    if (json.geoDistance.experiments.length === 0) {
      json.geoDistance.experiments = testData.geoDistance.experiments;
    }
    if (!json.snpDistance) {
      json.snpDistance = testData.snpDistance;
    }
    if (!json.snpDistance.newick) {
      json.snpDistance.newick = testData.snpDistance.newick;
    }
    return json;
  }
}

export default AnalyserWebFile;
