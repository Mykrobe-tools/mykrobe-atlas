/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getIsAuthenticated } from 'makeandship-js-common/src/modules/auth';

import { shouldAcceptDropEvent } from './util';
import styles from './DragAndDrop.css';

import { uploadFileDrop } from '../../modules/upload';

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
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return false;
    }
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
    const { className } = this.props;
    return (
      <div
        className={className}
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
  isAuthenticated: PropTypes.bool.isRequired,
  uploadFileDrop: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

const withRedux = connect(
  state => ({
    isAuthenticated: getIsAuthenticated(state),
  }),
  {
    uploadFileDrop,
  }
);

export default withRedux(Upload);
