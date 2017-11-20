/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ResistanceSpecies from './ResistanceSpecies';

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

ResistanceSpecies.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ResistanceSpecies);
