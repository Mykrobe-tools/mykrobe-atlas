/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { shouldAcceptDropEventForExtensions } from './util';
import * as APIConstants from '../../../constants/APIConstants';

import styles from './DragAndDrop.scss';

type State = {
  isDragActive: boolean,
};

class DragAndDrop extends React.Component<*, State> {
  state = {
    isDragActive: false,
  };

  shouldAcceptDropEvent = (e: any) => {
    const { accept } = this.props;
    return shouldAcceptDropEventForExtensions(e, accept);
  };

  onDragOver = (e: any) => {
    // nb cannot interrogate files properly during dragOver event - have to wait for drop
    e.preventDefault();
    const { enabled } = this.props;
    if (!enabled || !this.shouldAcceptDropEvent(e)) {
      return false;
    }
    this.setState({
      isDragActive: true,
    });
    return false;
  };

  onDrop = (e: any) => {
    e.preventDefault();
    this.setState({
      isDragActive: false,
    });
    const { enabled } = this.props;
    if (!enabled || !this.shouldAcceptDropEvent(e)) {
      return false;
    }
    const { onDrop } = this.props;
    onDrop && e.dataTransfer.files && onDrop(Array.from(e.dataTransfer.files));
  };

  onDragLeave = (e: any) => {
    e.preventDefault();
    this.setState({
      isDragActive: false,
    });
  };

  render() {
    const { isDragActive } = this.state;
    return (
      <div
        className={styles.container}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        data-tid="component-drag-and-drop"
      >
        {this.props.children}
        {isDragActive && <div className={styles.dragIndicator} />}
      </div>
    );
  }

  static defaultProps = {
    enabled: true,
    accept: APIConstants.API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS,
  };
}

DragAndDrop.propTypes = {
  enabled: PropTypes.bool,
  onDrop: PropTypes.func,
};

export default DragAndDrop;
