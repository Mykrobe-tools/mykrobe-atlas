/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './MetadataFormSteps.css';

class MetadataFormSteps extends Component {
  state: {
    step: number,
    steps: number
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      step: 0,
      steps: props.children.length
    };
  }

  onBackClick(e: Object) {
    let {step} = this.state;
    e.preventDefault();
    if (step > 0) {
      step--;
    }
    this.setState({step});
  }

  onNextClick(e: Object) {
    let {step, steps} = this.state;
    e.preventDefault();
    if (step < steps - 1) {
      step++;
    }
    this.setState({step});
  }

  onSaveClick(e: Event) {
    const {onSubmit} = this.props;
    onSubmit(e);
  }

  componentDidUpdate() {
    const {onChange} = this.props;
    onChange();
  }

  render() {
    const {step, steps} = this.state;
    const percent = Math.round(((step + 1) / steps) * 100);
    const isLastStep = !!(step < steps - 1);
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.percent}>
            <p className={styles.percentContent}>
              <span className={styles.percentValue}>{percent}</span>
              <span className={styles.percentSign}>%</span>
            </p>
          </div>
          <div className={styles.title}>
            <p className={styles.titleHead}>Complete metadata benefits everyone</p>
            <p className={styles.titleSubhead}>Help Atlas provide more accurate results</p>
          </div>
        </div>
        <div className={styles.tabs}>
          {this.createTabs()}
        </div>
        <div className={styles.controlsTop}>
          <h3 className={styles.stepTitle}>
            {this.stepTitle()}
          </h3>

          {isLastStep &&
            <div className={styles.controls}>
              <a className={styles.buttonBorderless} href="#" onClick={(e) => this.onNextClick(e)}>
                <span><i className="fa fa-chevron-circle-right" /> Skip</span>
              </a>
              <a className={styles.buttonPrimary} href="#" onClick={(e) => this.onNextClick(e)}>
                <span><i className="fa fa-chevron-circle-right" /> Next</span>
              </a>
            </div>
          }
        </div>
        <div className={styles.steps}>
          {this.createSteps()}
        </div>
        <div className={styles.controlsBottom}>
          {step > 0 &&
            <a className={styles.buttonOutline} href="#" onClick={(e) => this.onBackClick(e)}>
              <span><i className="fa fa-chevron-circle-left" /> Back</span>
            </a>
          }
          {isLastStep ? (
            <div className={styles.controls}>
              <a className={styles.buttonBorderless} href="#" onClick={(e) => this.onNextClick(e)}>
                <span><i className="fa fa-chevron-circle-right" /> Skip</span>
              </a>
              <a className={styles.buttonPrimary} href="#" onClick={(e) => this.onNextClick(e)}>
                <span><i className="fa fa-chevron-circle-right" /> Next</span>
              </a>
            </div>
          ) : (
            <a className={styles.buttonPrimary} href="#" onClick={(e) => this.onSaveClick(e)}>
              <span><i className="fa fa-chevron-circle-right" /> Save</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  stepTitle() {
    const {children} = this.props;
    const {step} = this.state;
    return children[step].props.label;
  }

  createTabs() {
    const {children} = this.props;
    const {step} = this.state;
    return children.map((child, index) => {
      let {label} = child.props;
      return (
        <p key={index} className={index === step ? styles.tabActive : styles.tab}>
          {label}
        </p>
      );
    });
  }

  createSteps() {
    const {children} = this.props;
    const {step} = this.state;
    return children.map((child, index) => {
      return (
        <div key={index} className={index === step ? styles.stepActive : styles.step}>
          {child}
        </div>
      );
    });
  }
}

MetadataFormSteps.propTypes = {
  children: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default MetadataFormSteps;
