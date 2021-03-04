/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import _get from 'lodash.get';
import * as dateFns from 'date-fns';

import { Sample } from 'mykrobe-atlas-jsonschema/schemas/definitions/experiment/experiment-metadata-sample';
import { formatDate } from 'makeandship-js-common/src/utils/date';

import Table from 'makeandship-js-common/src/components/ui/table';

import styles from './ExperimentsTable.module.scss';

import Susceptibility from '../ui/susceptibility/Susceptibility';

export const countryCodeToName = (countryCode) => {
  const index = Sample.properties.countryIsolate.enum.indexOf(countryCode);
  if (index === -1) {
    return countryCode;
  }
  return Sample.properties.countryIsolate.enumNames[index];
};

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
      const newSelected = selected.filter(
        (experimentId) => experimentId !== id
      );
      setSelected(newSelected.length > 0 ? newSelected : undefined);
    }
  };

  headings = () => {
    const { selected } = this.props;
    const allSelected = (selected && selected === '*') || false;
    return [
      {
        title: (
          <div className={styles.checkboxContainer}>
            <label>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={this.onHeadingCheckChanged}
              />
              <span />
            </label>
          </div>
        ),
      },
      {
        title: 'Isolate ID',
        sort: 'metadata.sample.isolateId',
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
        title: 'City',
        sort: 'metadata.sample.cityIsolate',
      },
      {
        title: 'Country',
        sort: 'metadata.sample.countryIsolate',
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
    const { selected, onDelete } = this.props;
    const allSelected = (selected && selected === '*') || false;
    let { id, created, modified, results, owner } = experiment;
    const isolateId = _get(experiment, 'metadata.sample.isolateId') || '–';
    const countryIsolate =
      _get(experiment, 'metadata.sample.countryIsolate') || '–';
    const cityIsolate = _get(experiment, 'metadata.sample.cityIsolate') || '–';
    const isSelected =
      allSelected ||
      (selected && selected.includes && selected.includes(id)) ||
      false;
    let mdr, xdr;
    let susceptibilityProfile = '–';
    if (results && results.predictor) {
      mdr = results.predictor.mdr;
      xdr = results.predictor.xdr;

      susceptibilityProfile = (
        <Link
          to={`/experiments/${id}/resistance/evidence`}
          className={styles.susceptibilityProfile}
        >
          <Susceptibility susceptibility={results.predictor.susceptibility} />
        </Link>
      );
    }
    return (
      <tr key={id}>
        <td>
          <div className={styles.checkboxContainer}>
            <label>
              <input
                type="checkbox"
                checked={isSelected}
                disabled={allSelected}
                onChange={(e) => this.onRowCheckChanged(id, e)}
              />
              <span />
            </label>
          </div>
        </td>
        <td>
          <Link to={`/experiments/${id}/analysis`}>{isolateId}</Link>
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
        <td>{cityIsolate}</td>
        <td>{countryCodeToName(countryIsolate)}</td>
        <td>{formatDate(dateFns.parseISO(created))}</td>
        <td>{formatDate(dateFns.parseISO(modified))}</td>
        <td>
          {owner && (
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
                  <i className="fa fa-chevron-circle-right" /> View
                </DropdownItem>
                <DropdownItem tag={Link} to={`/experiments/${id}/metadata`}>
                  <i className="fa fa-pencil" /> Edit
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  onClick={() => {
                    onDelete(experiment);
                  }}
                  className="btn-outline-danger"
                >
                  <i className="fa fa-trash" /> Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
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
