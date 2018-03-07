/* @flow */

import * as React from 'react';
import Lozenge from './Lozenge';
import styles from './AnimatedBackground.css';
import lozengeStyles from './Lozenge.css';

class AnimatedBackground extends React.Component<*> {
  state: {
    width: number,
    height: number,
  };
  _resize: (e: Event) => void;
  _container: Element;

  constructor(props: Object) {
    super(props);
    this.state = {
      width: 1024,
      height: 768,
    };
    this._resize = e => this.resize(e);
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
    const { width, height } = boundingClientRect;
    this.setState({
      width,
      height,
    });
  }

  containerRef = ref => {
    this._container = ref;
  };

  render() {
    const { width, height } = this.state;
    return (
      <div ref={this.containerRef} className={styles.container}>
        <Lozenge
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={lozengeStyles.lozengeYellow}
        />
        <Lozenge
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={lozengeStyles.lozengeYellow}
        />
        <Lozenge
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={lozengeStyles.lozengeYellow}
        />
        <Lozenge
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={lozengeStyles.lozengeYellow}
        />
        <Lozenge
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={lozengeStyles.lozengeYellow}
        />
        <Lozenge
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={lozengeStyles.lozengeYellow}
        />
        <Lozenge
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={lozengeStyles.lozengeYellow}
        />
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
