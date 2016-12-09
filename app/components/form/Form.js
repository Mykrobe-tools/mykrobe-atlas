/* @flow */

import React, { Component } from 'react';

import styles from './Form.css';

class Form extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    return (
      <form className={styles.form} onSubmit={this.props.onSubmit.bind(this)}>
        {this.props.children}
      </form>
    );
  }
}

Form.propTypes = {
  children: React.PropTypes.node.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

export default Form;
