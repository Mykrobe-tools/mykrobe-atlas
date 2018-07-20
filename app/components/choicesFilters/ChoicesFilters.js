/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Label,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Button,
} from 'reactstrap';

import { Select } from 'makeandship-js-common/src/components/ui/form';

import styles from './ChoicesFilters.scss';

type State = {
  placeholderChoiceKeys: Array<string>,
};

/*

TODO: don't allow user to add more than one placeholder? since the choices might change once one value is selected

*/

class ChoicesFilters extends React.Component<*, State> {
  state = {
    placeholderChoiceKeys: [],
  };

  onChangeFilterValue = (key: string, value: any) => {
    const { setFilters, filters } = this.props;
    this.removePlaceholderChoiceKey(key, () => {
      setFilters({
        ...filters,
        [key]: value,
      });
    });
  };

  onAddPlaceholderChoiceKey = (key: string) => {
    this.setState({
      placeholderChoiceKeys: this.state.placeholderChoiceKeys.concat(key),
    });
  };

  onClearFilters = (e: any) => {
    const { clearFilters } = this.props;
    e && e.preventDefault();
    clearFilters();
  };

  removePlaceholderChoiceKey = (key: string, callback?: Function) => {
    this.setState(
      {
        placeholderChoiceKeys: this.state.placeholderChoiceKeys.filter(
          placeholderChoiceKey => placeholderChoiceKey !== key
        ),
      },
      callback
    );
  };

  removeChoiceKey = (key: string) => {
    this.onChangeFilterValue(key, undefined);
  };

  // choices for 'add filter' menu
  // remove ones that
  // - are placeholders in current state
  // - in the current filters
  // - have no values

  addFilterChoicesKeys = (): Array<string> => {
    const { choices, filters } = this.props;
    const { placeholderChoiceKeys } = this.state;
    const filtersKeys = Object.keys(filters);
    const incidentsChoicesKeys: Array<string> = Object.keys(choices);
    return incidentsChoicesKeys.filter(choiceKey => {
      const incidentsChoice = choices[choiceKey];
      return (
        !placeholderChoiceKeys.includes(choiceKey) &&
        !filtersKeys.includes(choiceKey) &&
        incidentsChoice.length > 0
      );
    });
  };

  renderChoice = (choiceKey: string, placeholder: boolean) => {
    const { choices, filters } = this.props;
    const options = choices[choiceKey].map(value => {
      return {
        value: value.key,
        label: `${value.key} (${value.count})`,
      };
    });
    let displayTitle = choiceKey;
    const value = placeholder ? '' : filters[choiceKey];
    const displayValue = placeholder
      ? displayTitle
      : `${displayTitle} · ${filters[choiceKey]}`;
    return (
      <div key={choiceKey} className={styles.element}>
        <div className={styles.select}>
          <div className={styles.widthSizer}>{displayValue}</div>
          <Select
            name={choiceKey}
            value={value}
            valueComponent={({ value }) => {
              return (
                <div className="Select-value" title={value.label}>
                  <span className="Select-value-label">{displayValue}</span>
                </div>
              );
            }}
            onChange={this.onChangeFilterValue}
            placeholder={choiceKey}
            options={options}
            clearable={false}
            initiallyOpen={placeholder}
            searchable
            wideMenu
          />
        </div>

        <a
          href=""
          className={styles.remove}
          onClick={e => {
            e.preventDefault();
            if (placeholder) {
              this.removePlaceholderChoiceKey(choiceKey);
            } else {
              this.removeChoiceKey(choiceKey);
            }
          }}
        >
          <i className="fa fa-times" />
        </a>
      </div>
    );
  };

  render() {
    const { choices, filters, hasFilters } = this.props;
    const { placeholderChoiceKeys } = this.state;
    let hasChoices = false;
    let addFilterChoicesKeys = [];
    if (choices) {
      addFilterChoicesKeys = this.addFilterChoicesKeys();
      hasChoices = addFilterChoicesKeys.length > 0;
    }
    if (!hasChoices) {
      return (
        <div className={styles.componentWrap}>
          <Button outline disabled>
            Add filters <i className="fa fa-caret-down" />
          </Button>
        </div>
      );
    }
    const filtersKeys = Object.keys(filters);
    return (
      <div className={styles.componentWrap}>
        {filtersKeys.map(filtersKey => this.renderChoice(filtersKey, false))}
        {placeholderChoiceKeys.map(placeholderChoiceKey =>
          this.renderChoice(placeholderChoiceKey, true)
        )}
        <div className={styles.element}>
          <UncontrolledDropdown>
            <DropdownToggle outline data-tid="add-filters-dropdown-toggle">
              Add filters <i className="fa fa-caret-down" />
            </DropdownToggle>
            <DropdownMenu>
              {addFilterChoicesKeys.map(key => {
                let displayTitle = key;
                return (
                  <DropdownItem
                    onClick={e => {
                      e.preventDefault();
                      this.onAddPlaceholderChoiceKey(key);
                    }}
                    key={key}
                  >
                    {displayTitle}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        {hasFilters && (
          <div className={styles.element}>
            <a href="" onClick={this.onClearFilters} className={styles.clear}>
              Clear all <i className="fa fa-times" />
            </a>
          </div>
        )}
      </div>
    );
  }

  renderSelect = (
    placeholder: string,
    name: string,
    options: any,
    last?: boolean
  ) => this.renderSelectWithLabel(false, placeholder, name, options, last);

  renderSelectWithLabel = (
    label: string | boolean,
    placeholder: string,
    name: string,
    options: any,
    last: boolean = false
  ) => {
    const { filters } = this.props;
    return (
      <Col className={`px-0 mb-1 mb-md-0${last ? '' : ' mr-md-2'}`}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <Select
          name={name}
          value={filters[name]}
          onChange={this.onChangeFilterValue}
          placeholder={placeholder}
          options={options}
          searchable
          clearable
          wideMenu
        />
      </Col>
    );
  };
}

ChoicesFilters.propTypes = {
  isFetching: PropTypes.bool,
  setFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  choices: PropTypes.object,
  hasFilters: PropTypes.bool,
};

export default ChoicesFilters;
