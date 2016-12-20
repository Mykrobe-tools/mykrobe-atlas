/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Lozenge.css';

const LozengeDimensions = {
  width: 185,
  height: 65
};

class Lozenge extends Component {
  state: {
    initialised: boolean,
    x: number,
    y: number,
    scale: number,
    rotation: number,
    vx: number,
    vr: number
  }
  _raf: number

  constructor(props: Object) {
    super(props);
    this.state = {
      initialised: false,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      vx: 0,
      vr: 0
    };
  }

  initialiseWithProps(props: Object) {
    const {containerWidth, containerHeight} = props;
    this.state = {
      initialised: true,
      x: (-0.1 + 1.2 * Math.random()) * containerWidth,
      y: 300 + Math.random() * (containerHeight - 200),
      scale: 1.5 + Math.random() * 0.5,
      rotation: Math.random() * 180,
      vx: 0.1 + Math.random() * 0.2,
      vr: 0.1 + Math.random() * 0.2
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    // receiving new width and height, initialise if non-zero
    const {containerWidth, containerHeight} = nextProps;
    if (!this.state.initialised) {
      if (containerWidth !== 0 && containerHeight !== 0) {
        this.initialiseWithProps(nextProps);
      }
    }
  }

  componentDidMount() {
    this._raf = requestAnimationFrame(() => {
      this.onEnterFrame();
    });
  }

  componentWillUnmount() {
    this._raf && cancelAnimationFrame(this._raf);
    delete this._raf;
  }

  onEnterFrame() {
    const {x, y, scale, rotation, vx, vr} = this.state;
    const {containerWidth, containerHeight} = this.props;
    const thisWidth = LozengeDimensions.width * scale;
    let newState = {
      x,
      y,
      rotation
    };
    newState.x += vx * 3;
    newState.rotation += vr * 0.5;
    if (newState.x > containerWidth + thisWidth) {
      newState.x -= (containerWidth + 2 * thisWidth);
      newState.y = 300 + Math.random() * (containerHeight - 200);
    }
    this.setState(newState);
    this._raf = requestAnimationFrame(() => {
      this.onEnterFrame();
    });
  }

  render() {
    const {lozengeClassName} = this.props;
    const {x, y, rotation, scale} = this.state;
    return (
      <div className={styles.lozengeContainer} style={{
        transform: `translate(${x}px, ${y}px)`
      }}>
        <div className={lozengeClassName || styles.lozengeBlue} style={{
          transform: `rotate(${rotation}deg) translate3d(0, 0, 0)`,
          width: `${scale * LozengeDimensions.width}px`,
          height: `${scale * LozengeDimensions.height}px`
        }} />
      </div>
    );
  }
}

Lozenge.propTypes = {
  lozengeClassName: PropTypes.string,
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired
};

export default Lozenge;
