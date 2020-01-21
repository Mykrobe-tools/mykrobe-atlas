/* @flow */

import { LozengeDimensions } from './constants';
import fillRoundedRect from './fillRoundedRect';

export class CanvasLozenge {
  constructor({ containerWidth, containerHeight, color }) {
    this.state = {
      initialised: true,
      x: (-0.2 + 1.2 * Math.random()) * containerWidth,
      y: Math.random() * containerHeight,
      scale: 0.75 + Math.random() * 0.25,
      rotation: Math.random() * 180,
      vx: 0.15 + Math.random() * 0.15,
      vr: 0.15 + Math.random() * 0.15,
      opacity: 0 - Math.random() * 0.75,
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
    const { x, y, scale, rotation, vx, vr, opacity } = this.state;
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
    if (opacity < 1) {
      newState.opacity = Math.min(1, opacity + 1 / 120);
    }
    this.state = {
      ...this.state,
      ...newState,
    };
  };

  renderInContext = context => {
    const { color } = this.props;
    const { x, y, rotation, scale, opacity } = this.state;
    const width = scale * LozengeDimensions.width;
    const height = scale * LozengeDimensions.height;
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = 1;
    if (opacity < 1) {
      context.globalAlpha = Math.max(0, opacity);
    }
    context.fillStyle = color;
    fillRoundedRect(
      context,
      -0.5 * width,
      -0.5 * height,
      width,
      height,
      0.25 * width
    );
    context.restore();
  };
}
