/* @flow */

import React, { Component } from 'react';
import Upload from '../components/upload/Upload';

class UploadPage extends Component {
  render() {
    return (
      <Upload {...this.props} />
    );
  }
}

export default UploadPage;
