/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './MetadataFormSteps.scss';

type State = {
  step: number,
  steps: number,
};

class MetadataFormSteps extends React.Component<*, State> {
  constructor(props: Object) {
    super(props);
    this.state = {
      step: 0,
      steps: props.children.length,
    };
  }

  onBackClick(e: Object) {
    const { onStepChange } = this.props;
    let { step } = this.state;
    e.preventDefault();
    if (step > 0) {
      step--;
    }
    this.setState({ step });
    onStepChange();
  }

  onNextClick(e: Object) {
    const { onStepChange } = this.props;
    let { step, steps } = this.state;
    e.preventDefault();
    if (step < steps - 1) {
      step++;
    }
    this.setState({ step });
    onStepChange();
  }

  onSaveClick(e: Event) {
    const { onSubmit } = this.props;
    onSubmit(e);
    this.setState({ step: 0 });
  }

  render() {
    const { step, steps } = this.state;
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
            <p className={styles.titleHead}>
              Complete metadata benefits everyone
            </p>
            <p className={styles.titleSubhead}>
              Help Atlas provide more accurate results
            </p>
          </div>
        </div>
        <div className={styles.tabs}>{this.createTabs()}</div>
        <div className={styles.controlsTop}>
          <div className={styles.stepTitle}>{this.stepTitle()}</div>

          {isLastStep && (
            <div className={styles.controls}>
              <a
                className={styles.buttonBorderless}
                href="#"
                onClick={e => this.onNextClick(e)}
              >
                <span>
                  <i className="fa fa-chevron-circle-right" /> Skip
                </span>
              </a>
              <a
                className={styles.buttonPrimary}
                href="#"
                onClick={e => this.onNextClick(e)}
              >
                <span>
                  <i className="fa fa-chevron-circle-right" /> Next
                </span>
              </a>
            </div>
          )}
        </div>
        <div className={styles.steps}>{this.createSteps()}</div>
        <div className={styles.controlsBottom}>
          {step > 0 && (
            <a
              className={styles.buttonOutline}
              href="#"
              onClick={e => this.onBackClick(e)}
            >
              <span>
                <i className="fa fa-chevron-circle-left" /> Back
              </span>
            </a>
          )}
          {isLastStep ? (
            <div className={styles.controls}>
              <a
                className={styles.buttonBorderless}
                href="#"
                onClick={e => this.onNextClick(e)}
              >
                <span>
                  <i className="fa fa-chevron-circle-right" /> Skip
                </span>
              </a>
              <a
                className={styles.buttonPrimary}
                href="#"
                onClick={e => this.onNextClick(e)}
              >
                <span>
                  <i className="fa fa-chevron-circle-right" /> Next
                </span>
              </a>
            </div>
          ) : (
            <a
              className={styles.buttonPrimary}
              href="#"
              onClick={e => this.onSaveClick(e)}
            >
              <span>
                <i className="fa fa-chevron-circle-right" /> Save
              </span>
            </a>
          )}
        </div>
      </div>
    );
  }

  stepTitle() {
    const { children } = this.props;
    const { step } = this.state;
    return children[step].props.label;
  }

  createTabs() {
    const { children } = this.props;
    const { step } = this.state;
    return children.map((child, index) => {
      let { label } = child.props;
      return (
        <div
          key={index}
          className={index === step ? styles.tabActive : styles.tab}
        >
          {label}
        </div>
      );
    });
  }

  createSteps() {
    const { children } = this.props;
    const { step } = this.state;
    return children.map((child, index) => {
      return (
        <div
          key={index}
          className={index === step ? styles.stepActive : styles.step}
        >
          {child}
        </div>
      );
    });
  }
}

MetadataFormSteps.propTypes = {
  children: PropTypes.array.isRequired,
  onStepChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default MetadataFormSteps;
