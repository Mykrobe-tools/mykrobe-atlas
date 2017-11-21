/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ResistanceEvidence from './ResistanceEvidence';

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

ResistanceEvidence.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ResistanceEvidence);
