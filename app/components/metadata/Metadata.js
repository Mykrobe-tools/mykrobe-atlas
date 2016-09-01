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

  handleDateChange(date) {
    console.log('handleDateChange', date);
    this.setState({
      date
    });
  }

  handleCheckboxChange(event) {
    console.log('handleCheckboxChange', event);
    var state = {};
    state[event.target.name] = event.target.checked;
    console.log('updating state', state);
    this.setState(state);
  }

  handleChange(event) {
    console.log('handleChange', event);
    console.log('event.target.name', event.target.name);
    console.log('event.target.value', event.target.value);
    console.log('event.target.checked', event.target.checked);
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
        <div className={styles.formRow}>
          <label htmlFor="location">Collection location</label>
          {this.locationSelect()}
        </div>
        <div className={styles.formRow}>
          <label htmlFor="location">Collection date</label>
          {/* DatePicker currently shows US locale since Electron returns US https://github.com/electron/electron/issues/2484 */}
          <DatePicker
            name="date"
            selected={this.state.date}
            onChange={(date) => this.handleDateChange(date)}
          />
        </div>
        <div className={styles.formRow}>
          <label htmlFor="location">Sample type</label>
          <input
            type="text"
            name="sampleType"
            defaultValue={this.state.sampleType}
            onChange={(event) => this.handleChange(event)}
          />
        </div>
        <div className={styles.formRow}>
          <label>Phenotypic susceptibility</label>
        </div>
        <div className={styles.formRow}>
          <label>Patient history</label>
          <input type="checkbox" name="treatedForTB" defaultChecked={this.state.treatedForTB} onChange={(event) => this.handleCheckboxChange(event)} />
        </div>
        <div className={styles.formRow}>
          <label>Help improve Atlas</label>
          <input type="checkbox" name="shareSequence" defaultChecked={this.state.shareSequence} onChange={(event) => this.handleCheckboxChange(event)} />
        </div>
        {children}
      </div>
    );
  }
}

export default Metadata;
