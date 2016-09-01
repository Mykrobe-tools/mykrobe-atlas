import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Metadata.css';

const locations = require('static/locations.json');

class Metadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'GB'
    };
  }

  handleChange(event) {
    console.log('handleChange', event);
    var state = {};
    state[event.target.name] = event.target.value;
    console.log('updating state', state);
    this.setState(state);
  }

  locationSelect() {
    var options = [];
    locations.forEach((location, index) => {
      options.push(
        <option key={index} value={location['alpha-2']}>{location.name}</option>
      );
    });

    return (
      <select name="location" value={this.state.location} onChange={(event) => this.handleChange(event)}>
        {options}
      </select>
    );
  }

  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        {this.locationSelect()}
        {children}
      </div>
    );
  }
}

export default Metadata;
