/* @flow */

import * as React from 'react';

import styles from './AnimatedBackgroundCanvas.scss';
import { CanvasLozenge } from './CanvasLozenge';
import { LOZENGE_COLORS, LOZENGES_PER_COLOR } from './constants';

type State = {
  width: number,
  height: number,
};

class AnimatedBackgroundCanvas extends React.Component<*, State> {
  _canvasRef: HTMLCanvasElement;
  _container: HTMLElement;
  _context: CanvasRenderingContext2D;
  _raf: number;
  _lozenges: Array<CanvasLozenge>;
  _measureContainerDeferred: number;

  state = {
    width: 1024,
    height: 768,
  };

  constructor(props: any) {
    super(props);
    this._lozenges = [];
    for (let color in LOZENGE_COLORS) {
      for (let i = 0; i < LOZENGES_PER_COLOR; i++) {
        const l = new CanvasLozenge({
          containerWidth: 1024,
          containerHeight: 1024,
          color: LOZENGE_COLORS[color],
        });
        this._lozenges.push(l);
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this._raf = requestAnimationFrame(this.renderCanvas);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this._raf && cancelAnimationFrame(this._raf);
    this._measureContainerDeferred &&
      clearTimeout(this._measureContainerDeferred);
  }

  resize = () => {
    this.measureContainer();
  };

  measureContainerDeferred = () => {
    this._measureContainerDeferred &&
      clearTimeout(this._measureContainerDeferred);
    this._measureContainerDeferred = setTimeout(this.measureContainer, 0);
  };

  measureContainer = () => {
    const boundingClientRect = this._container.getBoundingClientRect();
    const { width, height } = boundingClientRect;
    // returns 0 if still initialising layout
    const stillInitialisingLayout = 0 === height;
    if (stillInitialisingLayout) {
      // try again next frame
      this.measureContainerDeferred();
      return;
    }
    console.log('boundingClientRect', boundingClientRect);
    this.setState({
      width,
      height,
    });
    this._lozenges.forEach(lozenge => {
      lozenge.setProps({
        containerWidth: width,
        containerHeight: height,
      });
    });
  };

  containerRef = (ref: Element | null) => {
    if (!ref) {
      return;
    }
    this._container = ref;
    this.measureContainerDeferred();
  };

  canvasRef = (ref: HTMLCanvasElement | null) => {
    if (!ref) {
      return;
    }
    this._canvasRef = ref;
    this._context = ref.getContext('2d', { alpha: false });
    this.measureContainerDeferred();
  };

  renderCanvas = () => {
    const { width, height } = this.state;
    if (this._context) {
      this._context.globalCompositeOperation = 'source-over';
      this._context.fillStyle = '#f7f6f1';
      this._context.fillRect(0, 0, width, height);
      this._context.globalCompositeOperation = 'multiply';
      this._lozenges.forEach(lozenge => {
        lozenge.onEnterFrame();
        lozenge.renderInContext(this._context);
      });
    }
    this._raf = requestAnimationFrame(this.renderCanvas);
  };

  render() {
    const { width, height } = this.state;
    return (
      <div ref={this.containerRef} className={styles.container}>
        <canvas width={width} height={height} ref={this.canvasRef} />
      </div>
    );
  }
}

export default AnimatedBackgroundCanvas;
