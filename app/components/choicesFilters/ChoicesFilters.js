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

type Choice = {
  title: string,
  min?: string,
  max?: string,
  choices?: Array<*>,
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
      return (
        !placeholderChoiceKeys.includes(choiceKey) &&
        !choicesFiltersKeys.includes(choiceKey) &&
        choice.choices &&
        choice.choices.length >= MIN_CHOICES_TO_SHOW
      );
    });
  };

  renderChoice = (choiceKey: string, placeholder: boolean) => {
    const { choices, choicesFilters } = this.props;
    const choice: Choice = choices[choiceKey];
    const options =
      choice.choices &&
      choice.choices.map(value => {
        return {
          value: value.key,
          label: `${value.key} (${value.count})`,
        };
      });
    const displayTitle = choice.title;
    const value = placeholder ? '' : choicesFilters[choiceKey];
    const displayValue = placeholder
      ? displayTitle
      : `${displayTitle} · ${choicesFilters[choiceKey]}`;
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
            placeholder={displayTitle}
            options={options}
            clearable={false}
            initiallyOpen={placeholder}
            searchable
            wideMenu
          />
        </div>

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
          <i className="fa fa-times" />
        </a>
      </div>
    );
  };

  render() {
    const { choices, choicesFilters, hasFilters, size } = this.props;
    const hasChoices = choices && Object.keys(choices).length > 0;
    if (!hasChoices) {
      return (
        <div className={styles.componentWrap}>
          <div className={styles.element}>
            <Button outline disabled size={size}>
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
            <UncontrolledDropdown>
              <DropdownToggle
                outline
                size={size}
                data-tid="add-filters-dropdown-toggle"
              >
                Add filters <i className="fa fa-caret-down" />
              </DropdownToggle>
              <DropdownMenu className={styles.dropdownMenu}>
                {addFilterChoicesKeys.map(choiceKey => {
                  const choice: Choice = choices[choiceKey];
                  const displayTitle = choice.title;
                  return (
                    <DropdownItem
                      onClick={e => {
                        e.preventDefault();
                        this.onAddPlaceholderChoiceKey(choiceKey);
                      }}
                      key={choiceKey}
                    >
                      {displayTitle}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        ) : (
          <div className={styles.element}>
            <Button outline disabled size={size}>
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
        />
      </Col>
    );
  };

  static defaultProps = {
    size: 'lg',
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
  size: PropTypes.string,
};

export default ChoicesFilters;
