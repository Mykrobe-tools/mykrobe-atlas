/* @flow */

import * as React from 'react';
import Lozenge from './Lozenge';
import styles from './AnimatedBackground.scss';
import lozengeStyles from './Lozenge.scss';

const LOZENGES_PER_COLOR = 10;

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

  renderLozengesWithStyle = (style: string) => {
    const { width, height } = this.state;
    const lozenges = [];
    for (let i = 0; i < LOZENGES_PER_COLOR; i++) {
      lozenges.push(
        <Lozenge
          key={`${i}`}
          containerWidth={width}
          containerHeight={height}
          lozengeClassName={style}
        />
      );
    }
    return lozenges;
  };

  render() {
    return (
      <div ref={this.containerRef} className={styles.container}>
        {this.renderLozengesWithStyle(lozengeStyles.lozengeYellow)}
        {this.renderLozengesWithStyle(lozengeStyles.lozengeBlue)}
      </div>
    );
  }
}

export default AnimatedBackground;
