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

const choices = {
  'involved.title': {
    title: 'Title',
    choices: [],
  },
  'involved.injury.injured': {
    title: 'Injured',
    choices: [],
  },
  'pressureUlcer.location': {
    title: 'Location',
    choices: [
      {
        key: 'ward 1',
        count: 1,
      },
      {
        key: 'ward 2',
        count: 1,
      },
    ],
  },
  'involved.type': {
    title: 'Involved Type',
    choices: [],
  },
  'type.subType': {
    title: 'Sub-type',
    choices: [
      {
        key: '[Sub-type 1]',
        count: 1,
      },
      {
        key: '[Sub-type 2]',
        count: 1,
      },
    ],
  },
  'slipsTripsFallsAndCollisions.previousFalls': {
    title: 'Previous falls',
    choices: [
      {
        key: 'Y',
        count: 1,
      },
      {
        key: 'N',
        count: 1,
      },
    ],
  },
  'involved.role': {
    title: 'Role',
    choices: [],
  },
  'type.type': {
    title: 'Type',
    choices: [
      {
        key: 'Incident affecting Patient',
        count: 1,
      },
      {
        key: 'Incident affecting Other',
        count: 1,
      },
    ],
  },
  'type.category': {
    title: 'Category',
    choices: [
      {
        key: 'Admission',
        count: 1,
      },
      {
        key: 'Other',
        count: 1,
      },
    ],
  },
  'involved.gender': {
    title: 'Gender',
    choices: [],
  },
  status: {
    title: 'Status',
    choices: [
      {
        key: 'Draft',
        count: 1,
      },
      {
        key: 'Other',
        count: 1,
      },
    ],
  },
};

const variations = {
  empty: {
    setFilters,
    clearFilters,
    filters: {},
    choicesFilters: {},
    choices: {},
  },
  default: {
    setFilters,
    clearFilters,
    filters: {},
    choicesFilters: {},
    choices,
  },
  filters1: {
    setFilters,
    clearFilters,
    filters: {
      'pressureUlcer.location': 'ward',
    },
    choicesFilters: {
      'pressureUlcer.location': 'ward',
    },
    choices,
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
        choicesFilters={filters}
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
  ))
  .add('Empty', () => <ChoicesFilters {...variations.empty} />);
