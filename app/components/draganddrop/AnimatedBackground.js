import React, { Component, PropTypes } from 'react';
import styles from './AnimatedBackground.css';

class Lozenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      duration: 10,
      rotation: 10
    };
  }

  componentDidMount() {
    setTimeout(() => {
      // this.updateTransition();
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    this.updateTransitionWithProps(nextProps);
  }

  updateTransitionWithProps(props = this.props) {
    console.log('updateTransitionWithProps');
    const {width, height} = props;
    // const duration = Math.random() * 5 + 5;
    const duration = 3;
    this.setState({
      x: 0,
      y: 0,
      duration: 0
    });
    // allow 1/60 second for browser to reset position of div before animating again
    clearTimeout(this.transitionTimeout);
    this.transitionTimeout = setTimeout(() => {
      this.setState({
        x: width,
        y: height,
        duration
      });
    }, 1000*1/60);
    clearTimeout(this.repeatTimeout);
    this.repeatTimeout = setTimeout(() => {
      this.updateTransitionWithProps();
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
  }

  componentDidMount() {
    setTimeout(() => {
      this.measureContainer();
    }, 0);
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
        Background
        <Lozenge width={width} height={height} />
      </div>
    );
  }
}

export default AnimatedBackground;
