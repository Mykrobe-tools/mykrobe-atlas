/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from 'reactstrap';
import moment from 'moment';

import styles from './ExperimentsTable.scss';

import { Table } from 'makeandship-js-common/src/components/ui/table';

/*
{
  '2': {
    owner: {
      firstname: 'Simon',
      lastname: 'Heys',
      email: 'simon@makeandship.com',
      keycloakId: '84c9adb7-cb5c-48d9-b091-7f90ddce967f',
      phone: '',
      id: '5b3f862643adf6000fecaf19'
    },
    created: '2018-07-23T15:09:39.011Z',
    modified: '2018-07-24T08:29:33.126Z',
    id: '5b55efb3c23a300010bac218',
    metadata: {
      genotyping: {
        wgsPlatform: 'HiSeq',
        otherGenotypeInformation: 'No',
        hainAm: 'AM sensitive'
      },
      patient: {
        genderAtBirth: 'Female'
      }
    },
    relevance: 1
  }
}
*/

class ExperimentsTable extends React.Component<*> {
  onHeadingCheckChanged = (e: any) => {
    const { setSelected } = this.props;
    setSelected(e.target.checked ? '*' : undefined);
  };
  onRowCheckChanged = (id: string, e: any) => {
    const { selected, setSelected } = this.props;
    if (e.target.checked) {
      const newSelected =
        typeof selected === 'object' ? selected.concat(id) : [id];
      setSelected(newSelected);
    } else {
      const newSelected = selected.filter(experimentId => experimentId !== id);
      setSelected(newSelected.length > 0 ? newSelected : undefined);
    }
  };
  headings = () => {
    const { selected } = this.props;
    const allSelected = (selected && selected === '*') || false;
    return [
      {
        title: (
          <label>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={this.onHeadingCheckChanged}
            />
            <span />
          </label>
        ),
      },
      {
        title: 'Sample',
        sort: 'id',
      },
      {
        title: 'Resistance profile',
        sort: 'results.predictor.susceptibility',
      },
      {
        title: 'MDR',
        sort: 'results.predictor.mdr',
      },
      {
        title: 'XDR',
        sort: 'results.predictor.xdr',
      },
      {
        title: 'Owner',
        sort: 'owner.lastname',
      },
      {
        title: 'Created',
        sort: 'created',
      },
      {
        title: 'Modified',
        sort: 'modified',
      },
      {
        title: '',
      },
    ];
  };
  renderRow = (experiment: any) => {
    const { selected } = this.props;
    const allSelected = (selected && selected === '*') || false;
    let { id, created, modified, owner, results } = experiment;
    const title = experiment.file
      ? `${experiment.file} (${experiment.id})`
      : experiment.id;
    const isSelected =
      allSelected ||
      (selected && selected.includes && selected.includes(id)) ||
      false;
    let mdr, xdr;
    let susceptibilityProfile = '–';
    if (results && results.predictor) {
      mdr = results.predictor.mdr;
      xdr = results.predictor.xdr;
      const elements = [];
      const keys = Object.keys(results.predictor.susceptibility).sort();
      keys.forEach(key => {
        const predict =
          results.predictor.susceptibility[key]['predict'] ||
          results.predictor.susceptibility[key]['prediction'];
        const initial = key.substr(0, 1).toUpperCase();
        const value = predict.substr(0, 1).toUpperCase();
        const elementId = `${key}${id}`;
        const elementKey = `${key}`;
        if (value === 'R') {
          elements.push(
            <span key={elementKey}>
              <span id={elementId} className={styles.resistant}>
                {initial}{' '}
              </span>
              <UncontrolledTooltip
                delay={0}
                placement={'top'}
                target={elementId}
              >
                {key} resistant
              </UncontrolledTooltip>
            </span>
          );
        } else {
          elements.push(
            <span key={elementKey}>
              <span id={elementId} className={styles.susceptible}>
                {initial}{' '}
              </span>
              <UncontrolledTooltip
                delay={0}
                placement={'top'}
                target={elementId}
              >
                {key} susceptible
              </UncontrolledTooltip>
            </span>
          );
        }
      });
      susceptibilityProfile = (
        <Link to={`/experiments/${id}/resistance/evidence`}>
          <span className={styles.resistanceProfile}>{elements}</span>
        </Link>
      );
    }
    return (
      <tr key={id}>
        <td>
          <label>
            <input
              type="checkbox"
              checked={isSelected}
              disabled={allSelected}
              onChange={e => this.onRowCheckChanged(id, e)}
            />
            <span />
          </label>
        </td>
        <td>
          <Link to={`/experiments/${id}`}>{title}</Link>
        </td>
        <td>{susceptibilityProfile}</td>
        <td>
          {mdr ? (
            <Link to={`/experiments/${id}/resistance/drugs`}>MDR</Link>
          ) : (
            '–'
          )}
        </td>
        <td>
          {xdr ? (
            <Link to={`/experiments/${id}/resistance/drugs`}>XDR</Link>
          ) : (
            '–'
          )}
        </td>
        <td>
          {owner.lastname}, {owner.firstname}
        </td>
        <td>{moment(created).format('L')}</td>
        <td>{moment(modified).format('L')}</td>
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
        headings={this.headings()}
        data={experiments}
        sort={filters.sort || 'modified'}
        order={filters.order || Table.Order.Ascending}
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
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  setSelected: PropTypes.func,
};

export default ExperimentsTable;
