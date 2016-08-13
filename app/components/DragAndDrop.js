import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './DragAndDrop.css';

import Dropzone from 'react-dropzone';

import MykrobeConfig from '../api/MykrobeConfig';
import MykrobeService from '../api/MykrobeService';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    debugger;
    this.state = {
      isDragActive: false
    };
  }

  render() {
    const { isDragActive } = this.state;
    const disableClick = true;
    const multiple = false;
    return (
      <Dropzone
        className={styles.container}
        ref={(ref) => { this._dropzone = ref; }}
        onDropAccepted={this.onDropAccepted.bind(this)}
        onDropRejected={this.onDropRejected.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        disableClick={disableClick}
        multiple={multiple}
        accept=".json,.bam,.gz,.fastq"
      >
        <div>
          <div>
            Drag and drop {isDragActive ? 'dragging' : false}
          </div>
          <button type="button" onClick={this.onOpenClick.bind(this)}>
            Browse...
          </button>
        </div>
      </Dropzone>
    );
  }

  onDragLeave(e) {
    this.setState({
      isDragActive: false
    });
  }

  onDragEnter(e) {
    // e.preventDefault();
    // e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true
    });
  }

  onDropAccepted(files) {
    this.setState({
      isDragActive: false
    });
    console.log('onDropAccepted', files);

    const config = new MykrobeConfig();
    const service = new MykrobeService(config);
    if (this.analyser) {
      this.analyser.cancel();
    }
    this.analyser = service.analyseFileWithPath(files[0].path)
      .on('progress', (progress) => {
        console.log('progress', progress);
      });
    // console.log('service:', service.analyseFileWithPath().pathToBin());
  }

  onDropRejected(files) {
    this.setState({
      isDragActive: false
    });
    console.log('onDropRejected', files);
  }

  onOpenClick(e) {
    this._dropzone.open();
    console.log('onOpenClick');
  }
}

DragAndDrop.propTypes = {
};

export default DragAndDrop;
