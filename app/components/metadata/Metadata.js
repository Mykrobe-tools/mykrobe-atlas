/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Metadata.css';

import MetadataForm from './MetadataForm';

class Metadata extends React.Component<*> {
  _ref: any;

  resetScroll = () => {
    this._ref.scrollTop = 0;
  };

  render() {
    const { isBusy, match } = this.props;
    return (
      <div ref={ref => (this._ref = ref)} className={styles.container}>
        {isBusy && (
          <div className={styles.uploadingMessage}>
            <div className={styles.uploadingMessageTitle}>
              Your sample is uploading
            </div>
          </div>
        )}
        <div className={styles.formContainer}>
          <MetadataForm id={match.params.id} resetScroll={this.resetScroll} />
        </div>
      </div>
    );
  }
}

Metadata.propTypes = {
  isBusy: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

export default Metadata;
