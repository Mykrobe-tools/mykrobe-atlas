import React, { Component, PropTypes } from 'react';
import styles from './AnimatedBackground.css';

class Lozenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      duration: Math.random()*18 + 4,
      rotation: Math.random()*8 + 4
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
    this.updateTransitionWithProps({
      x: Math.random() * width,
      y: 300 + Math.random() * (height - 200),
      width,
      height
    });
  }

  updateTransitionWithProps(props = this.props) {
    console.log('updateTransitionWithProps');
    const {x, y, width, height} = props;
    const {duration} = this.state;
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
        x: x + width + 200 * 2,
        y: y - 100 + Math.random() * 200,
        duration
      });
    }, 1000*1/60);
    clearTimeout(this.repeatTimeout);
    this.repeatTimeout = setTimeout(() => {
      this.updateTransitionWithProps({
        x: -200,
        y: 300 + Math.random() * (height - 200),
        width,
        height
      });
    }, duration*1000);
  }

  render() {
    const {width, height} = this.props;
    const {x, y, duration, rotation} = this.state;
    console.log('render ',x, y, duration);
    return (
      <div className={styles.lozengeContainer} style={{
        transform: `translate(${x}px, ${y}px)`,
        transitionDuration: `${duration}s`
      }}>
          <div className={styles.lozengeBlue} style={{
              animationDuration: `${rotation}s`
          }}/>
      </div>
    );
  }
  // render() {
  //   return (
  //       <div className={styles.lozengeContainer} style={{transform:'translate(500px, 120px)'}}>
  //           <div className={styles.lozengeBlue} style={{
  //               animationDuration: '10s'
  //           }}/>
  //       </div>
  //   );
  // }
}


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
      <div ref={(ref) => {this._container = ref;}} className={styles.container}>
        <Lozenge width={width} height={height} />
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
