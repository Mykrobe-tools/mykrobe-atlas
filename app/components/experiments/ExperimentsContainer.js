/* @flow */

import * as React from 'react';

import Experiments from './Experiments';

import withExperiment from '../../hoc/withExperiment';
import withExperiments from '../../hoc/withExperiments';
import withCurrentUser from '../../hoc/withCurrentUser';
import { withRouter } from 'react-router-dom';

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

  setPage = (page) => {
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

export default withRouter(
  withExperiments(withExperiment(withCurrentUser(ExperimentsContainer)))
);
