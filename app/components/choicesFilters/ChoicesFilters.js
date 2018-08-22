/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Col, Label, Button } from 'reactstrap';

import { Select } from 'makeandship-js-common/src/components/ui/form';

import { isNumeric } from '../../util';
import styles from './ChoicesFilters.scss';
import type { Choice } from './types';
import ChoiceFilterSelect from './ChoiceFilterSelect';
import ChoiceFilterDateRange from './ChoiceFilterDateRange';

type State = {
  placeholderChoiceKeys: Array<string>,
};

const MIN_CHOICES_TO_SHOW = 2;

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
    this.setState({
      placeholderChoiceKeys: [],
    });
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
    const { choices, choicesFilters } = this.props;
    const { placeholderChoiceKeys } = this.state;
    const choicesFiltersKeys = Object.keys(choicesFilters);
    const choicesKeys: Array<string> = Object.keys(choices);
    return choicesKeys.filter(choiceKey => {
      const choice: Choice = choices[choiceKey];
      if (
        placeholderChoiceKeys.includes(choiceKey) ||
        choicesFiltersKeys.includes(choiceKey)
      ) {
        return false;
      }
      if (choice.choices) {
        if (choice.choices.length < MIN_CHOICES_TO_SHOW) {
          return false;
        }
        return true;
      }
      if (!choice.min || !choice.max) {
        return false;
      }
      return true;
    });
  };

  renderChoice = (choiceKey: string, placeholder: boolean) => {
    const { choices, choicesFilters } = this.props;
    const choice: Choice = choices[choiceKey];
    let component;
    const props = {
      choices,
      choicesFilters,
      choiceKey,
      placeholder,
      onChange: this.onChangeFilterValue,
    };
    if (choice.choices) {
      component = <ChoiceFilterSelect {...props} />;
    }
    if (choice.min && choice.max) {
      if (isNumeric(choice.min) && isNumeric(choice.max)) {
        component = this.renderNumericRange(choiceKey, placeholder);
      } else {
        component = <ChoiceFilterDateRange {...props} />;
      }
    }
    if (!component) {
      return null;
    }
    return (
      <div key={choiceKey} className={styles.element}>
        {component}

        <a
          href="#"
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
          <i className="fa fa-times-circle" />
        </a>
      </div>
    );
  };

  // TODO: refactor into individual components

  // eslint-disable-next-line
  renderNumericRange = (choiceKey: string, placeholder: boolean) => {
    return 'TODO: numeric range';
  };

  render() {
    const { choices, choicesFilters, hasFilters } = this.props;
    const hasChoices = choices && Object.keys(choices).length > 0;
    if (!hasChoices) {
      return (
        <div className={styles.componentWrap}>
          <div className={styles.element}>
            <Button outline disabled size={'sm'}>
              Add filters <i className="fa fa-caret-down" />
            </Button>
          </div>
        </div>
      );
    }

    const { placeholderChoiceKeys } = this.state;
    const addFilterChoicesKeys = this.addFilterChoicesKeys();
    const choicesFiltersKeys = Object.keys(choicesFilters);
    const hasAddFilterChoices = addFilterChoicesKeys.length > 0;
    return (
      <div className={styles.componentWrap}>
        {choicesFiltersKeys.map(choicesFilterKey =>
          this.renderChoice(choicesFilterKey, false)
        )}
        {placeholderChoiceKeys.map(placeholderChoiceKey =>
          this.renderChoice(placeholderChoiceKey, true)
        )}
        {hasAddFilterChoices ? (
          <div className={styles.element}>
            <div className={styles.select}>
              <Select
                placeholder={'Add filters'}
                options={addFilterChoicesKeys.map(choiceKey => {
                  const choice: Choice = choices[choiceKey];
                  const displayTitle = choice.titles
                    ? choice.titles.join(' › ')
                    : choice.title || 'Untitled';
                  return {
                    value: choiceKey,
                    label: displayTitle,
                  };
                })}
                onChange={choiceKey => {
                  this.onAddPlaceholderChoiceKey(choiceKey);
                }}
                searchable
                wideMenu
                autosize={false}
                autoBlur={true}
              />
            </div>
          </div>
        ) : (
          <div className={styles.element}>
            <Button outline disabled size={'sm'}>
              Add filters <i className="fa fa-caret-down" />
            </Button>
          </div>
        )}
        {hasFilters && (
          <div className={styles.element}>
            <a href="#" onClick={this.onClearFilters} className={styles.clear}>
              Clear all <i className="fa fa-times-circle" />
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
    const { choicesFilters } = this.props;
    return (
      <Col className={`px-0 mb-1 mb-md-0${last ? '' : ' mr-md-2'}`}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <Select
          name={name}
          value={choicesFilters[name]}
          onChange={this.onChangeFilterValue}
          placeholder={placeholder}
          options={options}
          searchable
          clearable
          wideMenu
          className={styles.select}
        />
      </Col>
    );
  };
}

ChoicesFilters.propTypes = {
  isFetching: PropTypes.bool,
  setFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  choicesFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  choices: PropTypes.object,
  hasFilters: PropTypes.bool,
};

export default ChoicesFilters;
