import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styles from './Metadata.css';

const locations = require('static/locations.json');
const drugs = require('static/drugs.json');

// TODO: move into redux, save on unmount

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

  susceptibilityPicker() {
    var rows = [];
    drugs.forEach((drug, index) => {
      rows.push(
        <tr key={index}>
          <td>
            {drug}
          </td>
          <td>
            <label>
              <input
                type="radio"
                name={drug}
                value="S"
                defaultChecked={'S' === this.state.susceptibility[drug]}
                onChange={(event) => this.handleChange(event)}
              />
              Susceptible
            </label>
          </td>
          <td>
            <label>
              <input
                type="radio"
                name={drug}
                value="R"
                defaultChecked={'R' === this.state.susceptibility[drug]}
                onChange={(event) => this.handleChange(event)}
              />
              Resistant
            </label>
          </td>
          <td>
            <label>
              <input
                type="radio"
                name={drug}
                value="I"
                defaultChecked={'I' === this.state.susceptibility[drug]}
                onChange={(event) => this.handleChange(event)}
              />
              Inconclusive
            </label>
          </td>
        </tr>
      );
    });
    return (
      <table className={styles.susceptibilityPicker}>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderTitle}>
              Metadata
            </div>
            <div className={styles.formHeaderActions}>
              <div className={styles.formHeaderAction}>
                Open template
              </div>
            </div>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formRowLabel} htmlFor="location">Collection location</label>
            {this.locationSelect()}
          </div>
          <div className={styles.formRow}>
            <label className={styles.formRowLabel} htmlFor="location">Collection date</label>
            {/* DatePicker currently shows US locale since Electron returns US https://github.com/electron/electron/issues/2484 */}
            <DatePicker
              name="date"
              selected={this.state.date}
              onChange={(date) => this.handleDateChange(date)}
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formRowLabel} htmlFor="location">Sample type</label>
            <input
              type="text"
              name="sampleType"
              defaultValue={this.state.sampleType}
              onChange={(event) => this.handleChange(event)}
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Phenotypic susceptibility</label>
            {this.susceptibilityPicker()}
          </div>
          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Patient history</label>
            <label>
              <input type="checkbox" name="treatedForTB" defaultChecked={this.state.treatedForTB} onChange={(event) => this.handleCheckboxChange(event)} />
              Patient has been treated for TB before
            </label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Help improve Atlas</label>
            <label>
              <input type="checkbox" name="shareSequence" defaultChecked={this.state.shareSequence} onChange={(event) => this.handleCheckboxChange(event)} />
              Share bacterial DNA sequence with Atlas
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default Metadata;
