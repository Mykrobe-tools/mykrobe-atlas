/* @flow */

import * as React from 'react';

import Experiments from './Experiments';

import withExperiments from '../../hoc/withExperiments';
import withPhylogenyNode from '../../hoc/withPhylogenyNode';
import withExperimentsHighlighted from '../../hoc/withExperimentsHighlighted';

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

export default withExperimentsHighlighted(
  withPhylogenyNode(withExperiments(ExperimentsContainer))
);
