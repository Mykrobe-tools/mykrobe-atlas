/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ResistanceDrugs from './ResistanceDrugs';

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

ResistanceDrugs.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ResistanceDrugs);
