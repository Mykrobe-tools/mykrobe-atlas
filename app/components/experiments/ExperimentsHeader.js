/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FormSelect from '../form/FormSelect';
import FormLabel from '../form/FormLabel';
import styles from './ExperimentsHeader.css';

import { fetchExperiments, fetchFilterValues } from '../../modules/experiments';

const filters = require('../../static/filters.json');

class ExperimentsHeader extends React.Component {
  state: {
    filterFields: Array<Object>,
    filterValues?: Array<Object>,
    selectedFilterField?: string,
    selectedFilterValue?: string,
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      filterFields: filters,
    };
  }

  onClearFiltersClick = (e: Event) => {
    const { fetchExperiments } = this.props;
    e.preventDefault();
    this.setState({
      filterValues: [],
      selectedFilterField: '',
      selectedFilterValue: '',
    });
    fetchExperiments();
  };

  handleFilterFieldSelection(event: InputEvent) {
    const { fetchFilterValues } = this.props;
    const filter = event.target.value;
    this.updateFilterState(event);
    if (filter) {
      fetchFilterValues(filter);
    }
  }

  handleFilterValueSelection(event: InputEvent) {
    const { fetchExperiments } = this.props;
    const { selectedFilterField } = this.state;
    if (!selectedFilterField) return;
    const params = {
      [selectedFilterField]: event.target.value,
    };
    this.updateFilterState(event);
    fetchExperiments(params);
  }

  updateFilterState(event: InputEvent) {
    var state = {
      [event.target.name]: event.target.value,
    };
    this.setState(state);
  }

  render() {
    const {
      filterFields,
      selectedFilterField,
      selectedFilterValue,
    } = this.state;
    const { experiments } = this.props;
    const { filterValues } = experiments;
    return (
      <div className={styles.header}>
        <div className={styles.filters}>
          <div className={styles.filter}>
            <FormSelect
              title="Filter"
              name="selectedFilterField"
              value={selectedFilterField}
              options={filterFields}
              onChange={e => this.handleFilterFieldSelection(e)}
            />
            {selectedFilterField && (
              <div className={styles.subFilter}>
                <div className={styles.subFilterLabel}>
                  <FormLabel htmlFor={selectedFilterValue} label="is" />
                </div>
                <FormSelect
                  name="selectedFilterValue"
                  value={selectedFilterValue}
                  options={filterValues}
                  onChange={e => this.handleFilterValueSelection(e)}
                />
                <a
                  href="#"
                  className={styles.clearFilters}
                  onClick={this.onClearFiltersClick}
                >
                  <span>
                    <i className="fa fa-times-circle" /> Clear filters
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
        {experiments.total && (
          <div className={styles.count}>{experiments.total} found</div>
        )}
      </div>
    );
  }
}

ExperimentsHeader.propTypes = {
  experiments: PropTypes.object.isRequired,
  fetchFilterValues: PropTypes.func.isRequired,
  fetchExperiments: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchFilterValues,
      fetchExperiments,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentsHeader);
