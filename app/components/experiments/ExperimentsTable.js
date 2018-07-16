/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './ExperimentsTable.scss';

import { Table } from 'makeandship-js-common/src/components/ui/table';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const headings = [
  {
    title: 'Sample',
    sort: 'id',
  },
  {
    title: 'Owner',
    sort: 'owner.lastname',
  },
  {
    title: 'Organisation',
  },
  {
    title: 'Site',
  },
  {
    title: 'Collected',
  },
  {
    title: 'Location',
  },
  {
    title: '',
  },
];

class ExperimentsTable extends React.Component<*> {
  renderRow = (experiment: any) => {
    const { onExperimentClick } = this.props;
    let { id, owner } = experiment;
    return (
      <tr key={id}>
        <td
          onClick={() => onExperimentClick(experiment)}
          className={styles.clickableCell}
        >
          {id}
        </td>
        <td>
          {owner.lastname}, {owner.firstname}
        </td>
        <td>TODO</td>
        <td>TODO</td>
        <td>TODO</td>
        <td>TODO</td>
        <td>
          <UncontrolledDropdown>
            <DropdownToggle
              tag={'a'}
              href="#"
              className={styles.dropdownToggle}
            >
              <i className="fa fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem tag={Link} to={`/experiments/${id}`}>
                View
              </DropdownItem>
              <DropdownItem tag={Link} to={`/experiments/${id}/edit`}>
                Edit
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      </tr>
    );
  };

  render() {
    const { experiments, filters, onChangeOrder } = this.props;
    return (
      <Table
        headings={headings}
        data={experiments}
        sort={filters.sort || 'id'}
        order={filters.order || Table.Order.Descending}
        renderRow={this.renderRow}
        onChangeOrder={onChangeOrder}
      />
    );
  }
}

ExperimentsTable.propTypes = {
  experiments: PropTypes.array,
  isFetching: PropTypes.bool,
  filters: PropTypes.object,
  onChangeOrder: PropTypes.func,
  onExperimentClick: PropTypes.func,
};

export default ExperimentsTable;
