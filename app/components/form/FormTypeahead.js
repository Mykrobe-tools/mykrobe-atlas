/* @flow */

import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import Fuse from 'fuse.js';

import FormLabel from './FormLabel';

import styles from './FormTypeahead.css';

const defaults = {
  // allow custom overriding of typeahead logic: filtering
  filterSuggestions: (suggestions, value) => {
    const inputValue = value.trim().toLowerCase();
    const options = {
      keys: ['value', 'label'],
      shouldSort: true,
      threshold: 0.3,
    };
    const fuse = new Fuse(suggestions, options);
    return fuse.search(inputValue);
  },

  // allow custom overriding of typeahead logic: value display
  getSuggestionValue: suggestion => suggestion.label,

  // allow custom overriding of typeahead logic: rendering
  renderSuggestion: suggestion => <div>{suggestion.label}</div>,
};

class FormTypeahead extends Component {
  options: Object;
  state: {
    value: string,
    suggestions: Array<Object>,
  };

  constructor(props: Object) {
    super(props);
    this.setOptions(props);
    this.state = {
      value: this.getLabelFromValue(props.value),
      suggestions: [],
    };
  }

  setOptions(props: Object) {
    this.options = {};
    this.options.suggestions = props.suggestions;
    for (let key of Object.keys(defaults)) {
      if (props[key]) {
        this.options[key] = props[key];
      } else {
        this.options[key] = defaults[key];
      }
    }
  }

  getLabelFromValue(value: string = '') {
    const option = this.options.suggestions.find(option => {
      return value === option.value;
    });
    if (option) {
      return option.label;
    }
    return '';
  }

  onTextEntered(event: Event, newValue: string) {
    this.setState({
      value: newValue,
    });
  }

  onSuggestionsFetchRequested(value: string) {
    this.setState({
      suggestions: this.options.filterSuggestions(
        this.options.suggestions,
        value
      ),
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const { placeholder, name, title } = this.props;

    const { onChange } = this.props;
    const inputProps = {
      placeholder,
      value,
      onChange: (e, { newValue }) => this.onTextEntered(e, newValue),
    };
    return (
      <div className={styles.wrap}>
        <div className={styles.label}>
          <FormLabel htmlFor={name} label={title} />
        </div>
        <Autosuggest
          id={name}
          theme={styles}
          suggestions={suggestions}
          onSuggestionSelected={(e, { suggestion }) =>
            onChange(name, suggestion.value)}
          onSuggestionsFetchRequested={({ value }) =>
            this.onSuggestionsFetchRequested(value)}
          onSuggestionsClearRequested={() => this.onSuggestionsClearRequested()}
          getSuggestionValue={this.options.getSuggestionValue}
          renderSuggestion={this.options.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

FormTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default FormTypeahead;
