import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styles from './Metadata.css';

const locations = require('static/locations.json');

class Metadata extends Component {
  constructor(props) {
    super(props);
    const app = require('electron').remote.app;
    const locale = app.getLocale();
    console.log('locale', locale); // returns en-US
    this.state = {
      location: 'GB',
      date: moment(),
      sampleType: '',
      susceptibility: {},
      treatedForTB: false,
      shareSequence: true
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
      <select name="location"
        value={this.state.location}
        onChange={(event) => this.handleChange(event)}>
        {options}
      </select>
    );
  }

  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        {this.locationSelect()}
        {/* DatePicker currently shows US locale since Electron returns US https://github.com/electron/electron/issues/2484 */}
        <DatePicker
          name="date"
          selected={this.state.date}
          onChange={(date) => this.handleChange({
            target: {
              name: 'date',
              value: date
            }})
          }
        />
        {children}
      </div>
    );
  }
}

export default Metadata;
