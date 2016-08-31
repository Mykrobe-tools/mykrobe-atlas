import React, { Component, PropTypes } from 'react';
import Header from 'components/header/Header';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
