/* @flow */

import * as React from 'react';
import Lozenge from './Lozenge';
import styles from './AnimatedBackground.scss';
import lozengeStyles from './Lozenge.scss';

type State = {
  width: number,
  height: number,
};

class AnimatedBackground extends React.Component<*, State> {
  _container: Element | null;

  constructor(props: Object) {
    super(props);
    this.state = {
      width: 1024,
      height: 768,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.measureContainer();
  };

  measureContainer() {
    if (!this._container) {
      return;
    }
    const boundingClientRect = this._container.getBoundingClientRect();
    const { width, height } = boundingClientRect;
    this.setState({
      width,
      height,
    });
  }

  containerRef = (ref: Element | null) => {
    this._container = ref;
    this.measureContainer();
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
