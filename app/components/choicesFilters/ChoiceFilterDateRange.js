/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from 'makeandship-js-common/src/components/ui/form';

import styles from './ChoiceFilterDateRange.scss';

import type { Choice } from './types';

type State = {
  min?: string,
  max?: string,
};

class ChoiceFilterDateRange extends React.Component<*, State> {
  state = {};

  // static getDerivedStateFromProps = (props: any, state:): State => {
  //   const { choices, choiceKey } = props;
  //   const choice: Choice = choices[choiceKey];
  //   const { max, min } = choice;
  //   return {
  //     max,
  //     min,
  //   };
  // };

  minMaxFromProps = (props: any) => {
    const { choices, choiceKey } = props;
    const choice: Choice = choices[choiceKey];
    const { max, min } = choice;
    return {
      min,
      max,
    };
  };

  constructor(props: any) {
    super(props);
    this.state = this.minMaxFromProps(props);
  }

  componentDidUpdate = (prevProps: any) => {
    const minMax = this.minMaxFromProps(this.props);
    const prevMinMax = this.minMaxFromProps(prevProps);
    if (minMax.min !== prevMinMax.min || minMax.max !== prevMinMax.max) {
      this.setState(minMax);
    }
  };

  onMinChange = (min: string) => {
    this.setState({
      min,
    });
  };

  onMaxChange = (max: string) => {
    this.setState({
      max,
    });
  };

  render() {
    const {
      choices,
      choicesFilters,
      choiceKey,
      placeholder,
      onChange,
    } = this.props;
    const { max, min } = this.state;
    console.log(this.state);
    const choice: Choice = choices[choiceKey];
    const displayTitle = choice.title;
    const value = placeholder ? '' : choicesFilters[choiceKey];
    const displayValue = placeholder
      ? displayTitle
      : `${displayTitle} · ${choicesFilters[choiceKey]}`;
    return (
      <div className={styles.componentWrap}>
        {displayTitle} ·
        <DatePicker value={min} onChange={this.onMinChange} /> ·
        <DatePicker value={max} onChange={this.onMaxChange} />
      </div>
    );
  }
}

ChoiceFilterDateRange.propTypes = {
  choicesFilters: PropTypes.object.isRequired,
  choices: PropTypes.object.isRequired,
  choiceKey: PropTypes.string.isRequired,
  placeholder: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ChoiceFilterDateRange;
