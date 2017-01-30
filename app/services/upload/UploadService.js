/* @flow */

import { BASE_URL } from '../../constants/APIConstants';
import UploadFile from './UploadFile';
import UploadBox from './UploadBox';
import UploadDropbox from './UploadDropbox';
import UploadGoogleDrive from './UploadGoogleDrive';
import UploadOneDrive from './UploadOneDrive';

const acceptedExtensions = ['json', 'bam', 'gz', 'fastq', 'jpg'];
let instance = null;

class UploadService {
  uploadFile: UploadFile;
  uploadBox: UploadBox;
  uploadDropbox: UploadDropbox;
  uploadGoogleDrive: UploadGoogleDrive;
  uploadOneDrive: UploadOneDrive;

  constructor() {
    if (!instance) {
      this.uploadFile = new UploadFile(acceptedExtensions);
      this.uploadBox = new UploadBox();
      this.uploadDropbox = new UploadDropbox(acceptedExtensions);
      this.uploadGoogleDrive = new UploadGoogleDrive();
      this.uploadOneDrive = new UploadOneDrive();
      instance = this;
    }
    return instance;
  }

  prepare() {
    return fetch(`${BASE_URL}/api/experiments/`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          return response.json().then((experiment) => {
            this.setId(experiment.id);
            return experiment.id;
          });
        }
        return;
      })
      .catch(() => {
        return;
      });
  }

  setId(id: string) {
    this.uploadFile.setId(id);
  }
}

export default UploadService;
