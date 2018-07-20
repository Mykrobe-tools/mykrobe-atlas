/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import _ from 'lodash';

import ChoicesFilters from './ChoicesFilters';

const setFilters = filters => {
  console.log('setFilters called:', JSON.stringify(filters, null, 2));
};
const clearFilters = () => {
  console.log('resetFilters called');
};

const variations = {
  default: {
    setFilters,
    clearFilters,
    filters: {},
    choices: {
      'involved.title': [],
      'involved.injury.injured': [],
      'pressureUlcer.location': [
        {
          key: 'ward',
          count: 1,
        },
      ],
      'involved.type': [],
      'type.subType': [
        {
          key: '[Sub-type]',
          count: 1,
        },
      ],
      'slipsTripsFallsAndCollisions.previousFalls': [
        {
          key: 'Y',
          count: 1,
        },
      ],
      'involved.role': [],
      'type.type': [
        {
          key: 'Incident affecting Patient',
          count: 1,
        },
      ],
      'type.category': [
        {
          key: 'Admission',
          count: 1,
        },
      ],
      'involved.gender': [],
      status: [
        {
          key: 'Draft',
          count: 1,
        },
      ],
    },
  },
  filters1: {
    setFilters,
    clearFilters,
    filters: {
      'pressureUlcer.location': 'ward',
    },
    choices: {
      'involved.title': [],
      'involved.injury.injured': [],
      'pressureUlcer.location': [
        {
          key: 'ward',
          count: 1,
        },
      ],
      'involved.type': [],
      'type.subType': [
        {
          key: '[Sub-type]',
          count: 1,
        },
      ],
      'slipsTripsFallsAndCollisions.previousFalls': [
        {
          key: 'Y',
          count: 1,
        },
      ],
      'involved.role': [],
      'type.type': [
        {
          key: 'Incident affecting Patient',
          count: 1,
        },
      ],
      'type.category': [
        {
          key: 'Admission',
          count: 1,
        },
      ],
      'involved.gender': [],
      status: [
        {
          key: 'Draft',
          count: 1,
        },
      ],
    },
  },
};

type State = {
  filters: any,
};

class ChoicesFiltersPreservingFilters extends React.Component<*, State> {
  state = {
    filters: {},
  };

  clearFilters = () => {
    this.setState({
      filters: {},
    });
  };

  setFilters = filters => {
    const cleanFilters = _.omitBy(filters, _.isNil);
    this.setState({
      filters: cleanFilters,
    });
  };

  render() {
    const { filters: discardedFilters, ...rest } = this.props; // eslint-disable-line
    const { filters } = this.state;
    return (
      <ChoicesFilters
        filters={filters}
        clearFilters={this.clearFilters}
        setFilters={this.setFilters}
        {...rest}
      />
    );
  }
}

storiesOf('ChoicesFilters', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Default', () => <ChoicesFilters {...variations.default} />)
  .add('Filters 1', () => <ChoicesFilters {...variations.filters1} />)
  .add('Preserve Filters', () => (
    <ChoicesFiltersPreservingFilters choices={variations.default.choices} />
  ));
