/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Lozenge.scss';

const SCALE = 1.3;

const LozengeDimensions = {
  width: SCALE * 185,
  height: SCALE * 65,
};

type State = {
  initialised: boolean,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  vx: number,
  vr: number,
};

class Lozenge extends React.Component<*, State> {
  _raf: AnimationFrameID;

  constructor(props: Object) {
    super(props);
    this.state = {
      initialised: false,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      vx: 0,
      vr: 0,
    };
  }

  initialiseWithProps(props: Object) {
    const { containerWidth, containerHeight } = props;
    this.setState({
      initialised: true,
      x: (-0.2 + 1.2 * Math.random()) * containerWidth,
      y: Math.random() * containerHeight,
      scale: 0.75 + Math.random() * 0.25,
      rotation: Math.random() * 180,
      vx: 0.15 + Math.random() * 0.15,
      vr: 0.15 + Math.random() * 0.15,
    });
  }

  componentWillReceiveProps(nextProps: Object) {
    // receiving new width and height, initialise if non-zero
    const { containerWidth, containerHeight } = nextProps;
    if (!this.state.initialised) {
      if (containerWidth !== 0 && containerHeight !== 0) {
        this.initialiseWithProps(nextProps);
      }
    }
  }

  componentDidMount() {
    this._raf = requestAnimationFrame(this.onEnterFrame);
  }

  componentWillUnmount() {
    this._raf && cancelAnimationFrame(this._raf);
    delete this._raf;
  }

  onEnterFrame = () => {
    const { x, y, scale, rotation, vx, vr } = this.state;
    const { containerWidth, containerHeight } = this.props;
    const thisWidth = LozengeDimensions.width * scale;
    let newState = {
      x,
      y,
      rotation,
    };
    newState.x += vx * 2;
    newState.rotation += vr * 0.5;
    if (newState.x > containerWidth + thisWidth) {
      newState.x = -thisWidth - Math.random() * thisWidth;
      newState.y = Math.random() * containerHeight;
    }
    this.setState(newState);
    this._raf = requestAnimationFrame(this.onEnterFrame);
  };

  render() {
    const { lozengeClassName } = this.props;
    const { x, y, rotation, scale } = this.state;
    const width = scale * LozengeDimensions.width;
    const height = scale * LozengeDimensions.height;
    const opacity = scale;
    return (
      <div
        className={styles.lozengeContainer}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        <div
          className={lozengeClassName || styles.lozengeBlue}
          style={{
            transform: `rotate(${rotation}deg) translate3d(0, 0, 0)`,
            opacity: `${opacity}`,
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
      </div>
    );
  }
}

Lozenge.propTypes = {
  lozengeClassName: PropTypes.string,
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
};

export default Lozenge;
