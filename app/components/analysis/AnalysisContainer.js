/* @flow */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import withExperiment from '../../hoc/withExperiment';
import withFileUpload from '../../hoc/withFileUpload';
import Analysis from './Analysis';

import { getHighlighted, setNodeHighlighted } from '../../modules/phylogeny';

function mapStateToProps(state) {
  return {
    highlighted: getHighlighted(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setNodeHighlighted,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withExperiment(withFileUpload(Analysis)));
