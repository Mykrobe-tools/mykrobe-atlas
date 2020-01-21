/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withAuth, {
  withAuthPropTypes,
} from 'makeandship-js-common/src/hoc/withAuth';

import { shouldAcceptDropEvent } from './util';
import styles from './DragAndDrop.scss';

import { uploadFileDrop } from '../../../modules/upload';

type State = {
  isDragActive: boolean,
};

class Upload extends React.Component<*, State> {
  _uploadButton: Element;

  state = {
    isDragActive: false,
  };

  onDragOver = e => {
    e.preventDefault();
    if (!shouldAcceptDropEvent(e)) {
      return false;
    }
    this.setState({
      isDragActive: true,
    });
    return false;
  };

  onDrop = e => {
    e.preventDefault();
    const { uploadFileDrop } = this.props;
    this.setState({
      isDragActive: false,
    });
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return false;
    }
    if (shouldAcceptDropEvent(e)) {
      uploadFileDrop(e);
    }
  };

  onDragLeave = () => {
    this.setState({
      isDragActive: false,
    });
  };

  render() {
    const { isDragActive } = this.state;
    return (
      <div
        className={this.props.className}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        data-tid="component-drag-and-drop"
      >
        {isDragActive && <div className={styles.dragIndicator} />}
        {this.props.children}
      </div>
    );
  }
}

Upload.propTypes = {
  ...withAuthPropTypes,
  uploadFileDrop: PropTypes.func,
};

const withRedux = connect(
  null,
  {
    uploadFileDrop,
  }
);

export default withRedux(withAuth(Upload));
