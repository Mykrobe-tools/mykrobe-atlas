/* @flow */

import * as React from 'react';
import Upload from '../components/upload/Upload';

class HomePage extends React.Component<*> {
  render() {
    return <Upload {...this.props} />;
  }
}

export default HomePage;
