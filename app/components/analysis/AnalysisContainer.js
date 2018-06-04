/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import withAnalyser from '../../hoc/withAnalyser';
import Analysis from './Analysis';

import { getHighlighted, setNodeHighlighted } from '../../modules/phylogeny';

class AnalysisContainer extends React.Component<*> {
  render() {
    const { highlighted, setNodeHighlighted, analyser } = this.props;
    return (
      <Analysis
        analyser={analyser}
        highlighted={highlighted}
        setNodeHighlighted={setNodeHighlighted}
      />
    );
  }
}

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

AnalysisContainer.propTypes = {
  analyser: PropTypes.object.isRequired,
  setNodeHighlighted: PropTypes.func.isRequired,
  highlighted: PropTypes.array.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAnalyser(AnalysisContainer));
