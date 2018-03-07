/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import FormSelect from '../form/FormSelect';
import FormLabel from '../form/FormLabel';
import styles from './ExperimentsHeader.css';

const filters = require('../../static/filters.json');

class ExperimentsHeader extends React.Component<*> {
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
    const { requestExperiments } = this.props;
    e.preventDefault();
    this.setState({
      filterValues: [],
      selectedFilterField: '',
      selectedFilterValue: '',
    });
    requestExperiments();
  };

  handleFilterFieldSelection(event: InputEvent) {
    const { requestFilterValues } = this.props;
    const filter = event.target.value;
    this.updateFilterState(event);
    if (filter) {
      requestFilterValues(filter);
    }
  }

  handleFilterValueSelection(event: InputEvent) {
    const { requestExperiments } = this.props;
    const { selectedFilterField } = this.state;
    if (!selectedFilterField) return;
    const params = {
      [selectedFilterField]: event.target.value,
    };
    this.updateFilterState(event);
    requestExperiments(params);
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
    const { experiments, filterValues } = this.props;
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
  filterValues: PropTypes.array.isRequired,
  requestFilterValues: PropTypes.func.isRequired,
  requestExperiments: PropTypes.func.isRequired,
};

export default ExperimentsHeader;
