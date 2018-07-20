/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './HeaderSearch.scss';

type Props = {
  submitSearchForm: Function,
};

type State = {
  isSearchFocused: boolean,
  q: string,
};

class HeaderSearch extends React.Component<Props, State> {
  _inputRef: any;

  constructor(props: Object) {
    super(props);
    this.state = {
      isSearchFocused: false,
      q: '',
    };
  }

  handleSearchFocus = () => {
    this.setState({ isSearchFocused: true });
  };

  handleSearchBlur = () => {
    this.setState({ isSearchFocused: false, q: '' });
  };

  handleSearchChange = (e: Event) => {
    const state = {
      [e.target.name]: e.target.value,
    };
    this.setState(state);
  };

  handleSearchSubmit = (e: Event) => {
    const { submitSearchForm } = this.props;
    const { q } = this.state;
    e.preventDefault();
    submitSearchForm(q);
  };

  inputRef = ref => {
    this._inputRef = ref;
  };

  focusInput = () => {
    this._inputRef.focus();
  };

  render() {
    const { isSearchFocused, q } = this.state;
    const placeholder = 'Search';
    return (
      <form
        className={styles.search}
        method="get"
        action=""
        onSubmit={this.handleSearchSubmit}
      >
        <div
          className={
            isSearchFocused ? styles.containerFocused : styles.container
          }
          onClick={this.focusInput}
        >
          <div
            className={
              isSearchFocused ? styles.searchIconFocused : styles.searchIcon
            }
          >
            <i className="fa fa-search" />
          </div>
          <div className={styles.inputContainer}>
            <div
              className={
                isSearchFocused ? styles.inputSizerFocused : styles.inputSizer
              }
            >
              {placeholder}
            </div>
            <div className={styles.inputWrap} role="search">
              <label className={styles.visuallyhidden} htmlFor="q">
                {placeholder}
              </label>
              <input
                ref={this.inputRef}
                type="text"
                tabIndex="0"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                role="textbox"
                className={styles.input}
                name="q"
                placeholder={placeholder}
                value={q}
                onFocus={this.handleSearchFocus}
                onBlur={this.handleSearchBlur}
                onChange={this.handleSearchChange}
                aria-label={placeholder}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

HeaderSearch.propTypes = {
  submitSearchForm: PropTypes.func.isRequired,
};

export default HeaderSearch;
