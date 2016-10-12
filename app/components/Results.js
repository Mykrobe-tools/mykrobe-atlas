import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Results.css';
import { Link } from 'react-router';

class Results extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigation}>
            <Link to="/results/metadata" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Metadata</Link>
            <Link to="/results/resistance" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Resistance</Link>
            <Link to="/results/phylogeny" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Phylogeny</Link>
            <Link to="/results/map" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Map</Link>
            <Link to="/results/summary" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Summary</Link>
            <Link to="/results/share" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Share</Link>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Results.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

export default connect(mapStateToProps)(Results);
