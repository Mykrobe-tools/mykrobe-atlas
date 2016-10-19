import React, { Component, PropTypes } from 'react';
import Lozenge from './Lozenge';
import styles from './AnimatedBackground.css';

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
