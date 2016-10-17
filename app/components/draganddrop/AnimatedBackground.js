import React, { Component, PropTypes } from 'react';
import styles from './AnimatedBackground.css';

const LozengeDimensions = {
  width: 185,
  height: 65
};

class Lozenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      scale: 1.5 + Math.random() * 0.5,
      duration: Math.random() * 40 + 10,
      rotation: Math.random() * 40 + 10
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    clearTimeout(this.transitionTimeout);
    clearTimeout(this.repeatTimeout);
  }

  componentWillReceiveProps(nextProps) {
    // receiving new width and height
    console.log('componentWillReceiveProps', nextProps);
    const {width, height} = nextProps;
    if (this.props.width === nextProps.width && this.props.height === nextProps.height) {
      // don't update unless we are a different size
      return;
    }
    this.updateTransitionWithProps({
      x: -width + Math.random() * width * 2,
      y: 300 + Math.random() * (height - 200),
      width,
      height
    });
  }

  updateTransitionWithProps(props = this.props) {
    const {x, y, width, height} = props;
    const {duration, scale} = this.state;
    // start on screen
    this.setState({
      x,
      y,
      duration: 0
    });
    // allow 1/60 second for browser to reset position of div before animating again
    clearTimeout(this.transitionTimeout);
    this.transitionTimeout = setTimeout(() => {
      this.setState({
        x: x + width + LozengeDimensions.width * 2 * scale,
        y: y - 100 + Math.random() * 200,
        duration
      });
    }, 1000 * 1 / 60);
    clearTimeout(this.repeatTimeout);
    this.repeatTimeout = setTimeout(() => {
      this.updateTransitionWithProps({
        x: -LozengeDimensions.width * scale,
        y: 300 + Math.random() * (height - 200),
        width,
        height
      });
    }, duration * 1000);
  }

  render() {
    const {lozengeClassName} = this.props;
    const {x, y, duration, rotation, scale} = this.state;
    return (
      <div className={styles.lozengeContainer} style={{
        transform: `translate(${x}px, ${y}px)`,
        transitionDuration: `${duration}s`
      }}>
        <div className={lozengeClassName ? lozengeClassName : styles.lozengeBlue} style={{
          width: `${scale * LozengeDimensions.width}px`,
          height: `${scale * LozengeDimensions.height}px`,
          animationDuration: `${rotation}s`
        }} />
      </div>
    );
  }
}

Lozenge.propTypes = {
  lozengeClassName: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

class AnimatedBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
    this._resize = (e) => this.resize(e);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    setTimeout(() => {
      this.measureContainer();
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  resize() {
    this.measureContainer();
  }

  measureContainer() {
    const boundingClientRect = this._container.getBoundingClientRect();
    const {width, height} = boundingClientRect;
    this.setState({
      width,
      height
    });
  }

  render() {
    const {width, height} = this.state;
    return (
      <div ref={(ref) => { this._container = ref; }} className={styles.container}>
        <Lozenge width={width} height={height} lozengeClassName={styles.lozengeYellow} />
        <Lozenge width={width} height={height} lozengeClassName={styles.lozengeYellow} />
        <Lozenge width={width} height={height} lozengeClassName={styles.lozengeYellow} />
        <Lozenge width={width} height={height} lozengeClassName={styles.lozengeYellow} />
        <Lozenge width={width} height={height} lozengeClassName={styles.lozengeYellow} />
        <Lozenge width={width} height={height} lozengeClassName={styles.lozengeYellow} />
        <Lozenge width={width} height={height} lozengeClassName={styles.lozengeYellow} />
        <Lozenge width={width} height={height} />
        <Lozenge width={width} height={height} />
        <Lozenge width={width} height={height} />
        <Lozenge width={width} height={height} />
        <Lozenge width={width} height={height} />
        <Lozenge width={width} height={height} />
        <Lozenge width={width} height={height} />
      </div>
    );
  }
}

export default AnimatedBackground;
