/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import ResistanceProfile from './ResistanceProfile';

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

ResistanceProfile.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ResistanceProfile);
