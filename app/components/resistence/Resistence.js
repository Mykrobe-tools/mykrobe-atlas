import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Resistence.css';

import * as AnalyserActions from 'actions/AnalyserActions';

class Resistence extends Component {
  render() {
    const {dispatch, analyser, children} = this.props;
    return (
      <div className={styles.container}>
        <h2>Resistence</h2>
        Show results in here
        <ul>
          <li><Link to="results/resistence/a" activeClassName="active">Screen A</Link></li>
          <li><Link to="results/resistence/b" activeClassName="active">Screen B</Link></li>
        </ul>
        <div>
          {children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Resistence.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(Resistence);
