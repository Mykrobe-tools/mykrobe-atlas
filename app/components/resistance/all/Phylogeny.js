import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Phylogeny.css';

class Phylogeny extends Component {
  render() {
    const {analyser} = this.props;
    const everything = JSON.stringify(analyser.transformed, null, 2);
    return (
      <div className={styles.container}>
        <div>
          Phylogeny - TODO: show on tree
        </div>
        <pre>
          Transformed JSON model:
          {everything}
        </pre>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Phylogeny.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Phylogeny);
