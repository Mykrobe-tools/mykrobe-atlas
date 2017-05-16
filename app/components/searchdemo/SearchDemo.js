/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './SearchDemo.css';
import Loading from '../ui/Loading';

const SEARCH_THROTTLE_SECONDS = 0.5;

// ATGTTTTCCAGATTATCCAGATCTCACTCAA

class SearchDemo extends Component {
  state: {
    search: string,
    isFetching: boolean,
    repos: Array
  }
  _searchTimeout: ?number;

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      isFetching: false,
      repos: []
    };
  }

  getItems = () => {
    const { search } = this.state;
    if (!search.length) {
      return;
    }
    this.setState({
      isFetching: true
    });
    const url = `http://34.251.101.117:8081/search?seq=${search}`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        const result = Object.keys(results[Object.keys(results)[0]]["results"]);
        const items = result.map((res, i) => {
          return {
            id: i,
            value: res
          };
        });
        this.setState({
          repos: items,
          isFetching: false
        });
      })
      .catch((error) => {
        console.log('error', error);
        this.setState({
          isFetching: false
        });
      });
  }

  onSearchChange = (event) => {
    const search = event.target.value;
    this.setState({
      search
    });
    this._searchTimeout && clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(this.getItems, 1000 * SEARCH_THROTTLE_SECONDS);
  }

  render() {
    const { isFetching, repos } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            Search
          </div>
        </div>
        <div className={styles.contentContainer}>
          <input className={styles.searchInput} placeholder="ATGTTTTCCAGATTATCCAGATCTCACTCAA" type="text" onChange={this.onSearchChange} />
          {isFetching ? (
            <Loading />
          ) : (
            <div className={styles.resultsContainer}>
              {repos.length ? (
                <div>
                  <div className={styles.resultsTitle}>{repos.length} results</div>
                  <div className={styles.resultsItemsContainer}>
                    {repos.map(item => (
                      <div className={styles.resultItemContainer} key={item.id}>
                        <a className={styles.resultItem} target="_blank" href={`https://www.ncbi.nlm.nih.gov/sra/?term=${item.value}`}>
                          <i className="fa fa-chevron-circle-right" /> {item.value}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.resultsTitle}>
                  No results
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchDemo;
