/* @flow */

import * as React from 'react';
import styles from './AnimatedBackgroundCanvas.scss';

const SCALE = 1.5;

const LOZENGES_PER_COLOR = 8;

const LOZENGE_COLORS = ['rgba(0, 93, 138, 0.8)', 'rgba(255, 137, 0, 0.7)'];

const LozengeDimensions = {
  width: SCALE * 185,
  height: SCALE * 65,
};

type State = {
  width: number,
  height: number,
};

const fillRoundedRect = (context, x, y, w, h, r) => {
  r = Math.min(r, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.fill();
};

class CanvasLozenge {
  constructor({ containerWidth, containerHeight, color }) {
    this.state = {
      initialised: true,
      x: (-0.2 + 1.2 * Math.random()) * containerWidth,
      y: Math.random() * containerHeight,
      scale: 0.75 + Math.random() * 0.25,
      rotation: Math.random() * 180,
      vx: 0.15 + Math.random() * 0.15,
      vr: 0.15 + Math.random() * 0.15,
    };
    this.props = {
      containerWidth,
      containerHeight,
      color,
    };
  }

  setProps = props => {
    this.props = {
      ...this.props,
      ...props,
    };
  };

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
    newState.rotation += (vr * 0.5 * 3.14) / 180.0;
    if (newState.x > containerWidth + thisWidth) {
      newState.x = -thisWidth - Math.random() * thisWidth;
      newState.y = Math.random() * containerHeight;
    }
    this.state = {
      ...this.state,
      ...newState,
    };
  };

  renderInContext = context => {
    const { color } = this.props;
    const { x, y, rotation, scale } = this.state;
    const width = scale * LozengeDimensions.width;
    const height = scale * LozengeDimensions.height;
    // const opacity = scale;
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.fillStyle = color;
    fillRoundedRect(
      context,
      -0.5 * width,
      -0.5 * height,
      width,
      height,
      0.25 * width
    );
    // fillRoundedRect(context, -50, -100, 100, 200, 50);
    context.restore();
  };
}

class AnimatedBackgroundCanvas extends React.Component<*, State> {
  _canvasRef: HTMLCanvasElement;
  _container: HTMLElement;
  _context: CanvasRenderingContext2D;
  _raf: number;
  _lozenges: Array<CanvasLozenge>;

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
  }

  resize = () => {
    this.measureContainer();
  };

  measureContainer() {
    if (!this._container) {
      return;
    }
    // FIXME - maybe overflow: hidden on container will prevent this being necessary?
    // reset canvas size so the containing DOM element relaxes to natural size
    const boundingClientRect = this._container.getBoundingClientRect();
    const { width, height } = boundingClientRect;
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
  }

  containerRef = (ref: Element | null) => {
    this._container = ref;
    this.measureContainer();
  };

  canvasRef = (ref: HTMLCanvasElement | null) => {
    if (!ref) {
      return;
    }
    this._canvasRef = ref;
    this._context = ref.getContext('2d', { alpha: false });
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
