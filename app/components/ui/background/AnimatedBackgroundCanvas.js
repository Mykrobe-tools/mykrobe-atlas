import * as React from 'react';

import { CanvasLozenge } from './CanvasLozenge';
import { LOZENGE_COLORS, LOZENGES_PER_COLOR } from './constants';
import useAnimationFrame from '../../../hooks/useAnimationFrame';
import useBoundingClientRect from '../../../hooks/useBoundingClientRect';

import styles from './AnimatedBackgroundCanvas.module.scss';

const AnimatedBackgroundCanvas = () => {
  const lozenges = React.useRef();
  const canvasRef = React.useRef(null);
  const { ref, boundingClientRect } = useBoundingClientRect();
  const elapsedMilliseconds = useAnimationFrame();
  const containerWidth = 1920;

  React.useEffect(() => {
    if (!boundingClientRect || lozenges.current) {
      return;
    }
    const { width } = boundingClientRect;
    const containerScale = width / containerWidth;
    const containerHeight =
      (1920 * boundingClientRect.height) / boundingClientRect.width;
    lozenges.current = [];
    for (let j = 0; j < LOZENGE_COLORS.length; j++) {
      const color = LOZENGE_COLORS[j];
      for (let i = 0; i < LOZENGES_PER_COLOR; i++) {
        const l = new CanvasLozenge({
          containerWidth,
          containerHeight,
          containerScale,
          color,
        });
        lozenges.current.push(l);
      }
    }
  }, [boundingClientRect]);

  React.useEffect(() => {
    if (!canvasRef.current || !lozenges.current || !boundingClientRect) {
      return;
    }
    const { width, height } = boundingClientRect;
    const context = canvasRef.current.getContext('2d', { alpha: false });
    const containerScale = width / containerWidth;
    const containerHeight =
      (1920 * boundingClientRect.height) / boundingClientRect.width;
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = '#f7f6f1';
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'multiply';
    lozenges.current.forEach((lozenge) => {
      lozenge.setProps({
        containerScale,
        containerHeight,
      });
      lozenge.onEnterFrame();
      lozenge.renderInContext(context);
    });
  }, [boundingClientRect, elapsedMilliseconds, canvasRef]);

  const { width, height } = boundingClientRect || {};
  return (
    <div ref={ref} className={styles.container}>
      <canvas width={width} height={height} ref={canvasRef} />
    </div>
  );
};

export default AnimatedBackgroundCanvas;
