/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Experiments from './Experiments';

import {
  requestExperiments,
  requestExperimentsChoices,
  newExperiment,
  getExperiments,
  getExperimentsChoices,
  getIsFetchingExperiments,
  getIsFetchingExperimentsChoices,
  getExperimentsFilters,
  setExperimentsFilters,
} from '../../modules/experiments';

class ExperimentsContainer extends React.Component<*> {
  componentDidMount() {
    const { requestExperiments, requestExperimentsChoices } = this.props;
    requestExperiments();
    requestExperimentsChoices();
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
    experimentsChoices: getExperimentsChoices(state),
    isFetchingExperiments: getIsFetchingExperiments(state),
    isFetchingExperimentsChoices: getIsFetchingExperimentsChoices(state),
    experimentsFilters: getExperimentsFilters(state),
  }),
  {
    requestExperiments,
    requestExperimentsChoices,
    setExperimentsFilters,
    push,
    newExperiment,
  }
);

export default withRedux(ExperimentsContainer);
