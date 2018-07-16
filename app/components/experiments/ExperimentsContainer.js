/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Experiments from './Experiments';

import {
  requestExperiments,
  requestExperimentsMetadataChoices,
  newExperiment,
  getExperiments,
  getExperimentsMetadataChoices,
  getIsFetchingExperiments,
  getIsFetchingExperimentsMetadataChoices,
  getExperimentsFilters,
  setExperimentsFilters,
} from '../../modules/experiments';

class ExperimentsContainer extends React.Component<*> {
  componentDidMount() {
    const {
      requestExperiments,
      requestExperimentsMetadataChoices,
    } = this.props;
    requestExperiments();
    requestExperimentsMetadataChoices();
  }

  onExperimentClick = experiment => {
    const { push } = this.props;
    const { id } = experiment;
    push(`/experiments/${id}`);
  };

  onChangeListOrder = ({ sort, order }) => {
    const { setExperimentsFilters, experimentsFilters } = this.props;
    setExperimentsFilters({
      ...experimentsFilters,
      order,
      sort,
      page: undefined,
    });
  };

  setPage = page => {
    const { setExperimentsFilters, experimentsFilters } = this.props;
    setExperimentsFilters({
      ...experimentsFilters,
      page,
    });
  };

  render() {
    return (
      <Experiments
        onChangeListOrder={this.onChangeListOrder}
        onExperimentClick={this.onExperimentClick}
        {...this.props}
      />
    );
  }
}

const withRedux = connect(
  state => ({
    experiments: getExperiments(state),
    experimentsMetadataChoices: getExperimentsMetadataChoices(state),
    isFetchingExperiments: getIsFetchingExperiments(state),
    isFetchingExperimentsMetadataChoices: getIsFetchingExperimentsMetadataChoices(
      state
    ),
    experimentsFilters: getExperimentsFilters(state),
  }),
  {
    requestExperiments,
    requestExperimentsMetadataChoices,
    setExperimentsFilters,
    push,
    newExperiment,
  }
);

export default withRedux(ExperimentsContainer);
