import * as TargetConstants from 'constants/TargetConstants';
import MykrobeBaseFileAnalyser from './MykrobeBaseFileAnalyser';

class MykrobeWebFileAnalyser extends MykrobeBaseFileAnalyser {
  analyseBinaryFile(file) {
    console.log('analyseBinaryFile', file);
    console.error('TODO: upload file to API and report progress');
    const fileName = file.name;
    const baseName = fileName.substr(0, fileName.lastIndexOf('.'));
    fetch(`http://localhost:3000/demo/${baseName}.json`)
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
    return this;
  }

  cancel() {
    return this;
  }

}

export default MykrobeWebFileAnalyser;
