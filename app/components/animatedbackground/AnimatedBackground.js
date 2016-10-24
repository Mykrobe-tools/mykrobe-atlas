/* @flow */

import React, { Component } from 'react';
import Lozenge from './Lozenge';
import styles from './AnimatedBackground.css';
import lozengeStyles from './Lozenge.css';

class AnimatedBackground extends Component {
  state: {
    width: number,
    height: number
  }
  _resize: (e: Event) => void;
  _container: Element;

  constructor(props: Object) {
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
        <Lozenge containerWidth={width} containerHeight={height} lozengeClassName={lozengeStyles.lozengeYellow} />
        <Lozenge containerWidth={width} containerHeight={height} lozengeClassName={lozengeStyles.lozengeYellow} />
        <Lozenge containerWidth={width} containerHeight={height} lozengeClassName={lozengeStyles.lozengeYellow} />
        <Lozenge containerWidth={width} containerHeight={height} lozengeClassName={lozengeStyles.lozengeYellow} />
        <Lozenge containerWidth={width} containerHeight={height} lozengeClassName={lozengeStyles.lozengeYellow} />
        <Lozenge containerWidth={width} containerHeight={height} lozengeClassName={lozengeStyles.lozengeYellow} />
        <Lozenge containerWidth={width} containerHeight={height} lozengeClassName={lozengeStyles.lozengeYellow} />
        <Lozenge containerWidth={width} containerHeight={height} />
        <Lozenge containerWidth={width} containerHeight={height} />
        <Lozenge containerWidth={width} containerHeight={height} />
        <Lozenge containerWidth={width} containerHeight={height} />
        <Lozenge containerWidth={width} containerHeight={height} />
        <Lozenge containerWidth={width} containerHeight={height} />
        <Lozenge containerWidth={width} containerHeight={height} />
      </div>
    );
  }
}

export default AnimatedBackground;
