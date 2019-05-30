/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';

import Experiments from './Experiments';

import {
  requestExperiments,
  requestExperimentsChoices,
  newExperiment,
  getExperiments,
  getExperimentsChoices,
  getIsFetchingExperiments,
  getIsFetchingExperimentsChoices,
  getExperimentsIsPending,
  getExperimentsFilters,
  setExperimentsFilters,
  resetExperimentsFilters,
} from '../../modules/experiments';

class ExperimentsContainer extends React.Component<*> {
  componentDidMount() {
    const { requestExperiments, requestExperimentsChoices } = this.props;
    requestExperiments();
    requestExperimentsChoices();
  }

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
      <Experiments onChangeListOrder={this.onChangeListOrder} {...this.props} />
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
    experimentsIsPending: getExperimentsIsPending(state),
  }),
  {
    requestExperiments,
    requestExperimentsChoices,
    setExperimentsFilters,
    resetExperimentsFilters,
    newExperiment,
  }
);

export default withRedux(ExperimentsContainer);
