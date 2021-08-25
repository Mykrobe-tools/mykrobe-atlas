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
    if (!boundingClientRect.width || lozenges.current) {
      return;
    }
    const containerScale = boundingClientRect.width / containerWidth;
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
  }, [boundingClientRect.height, boundingClientRect.width]);

  React.useEffect(() => {
    if (!canvasRef.current || !lozenges.current || !boundingClientRect.width) {
      return;
    }
    const containerScale = boundingClientRect.width / containerWidth;
    const containerHeight =
      (1920 * boundingClientRect.height) / boundingClientRect.width;

    const context = canvasRef.current.getContext('2d', { alpha: false });
    const scale = window?.devicePixelRatio || 1;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(scale, scale);
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = '#f7f6f1';
    context.fillRect(0, 0, boundingClientRect.width, boundingClientRect.height);
    context.globalCompositeOperation = 'multiply';

    lozenges.current.forEach((lozenge) => {
      lozenge.setProps({
        containerScale,
        containerHeight,
      });
      lozenge.onEnterFrame();
      lozenge.renderInContext(context);
    });
  }, [
    elapsedMilliseconds,
    boundingClientRect.width,
    boundingClientRect.height,
  ]);

  const canvasProps = React.useMemo(() => {
    if (!boundingClientRect.width) {
      return;
    }
    const scale = window?.devicePixelRatio || 1;
    const canvasProps = {
      width: boundingClientRect.width * scale,
      height: boundingClientRect.height * scale,
      style: {
        width: `${boundingClientRect.width}px`,
        height: `${boundingClientRect.height}px`,
      },
    };
    return canvasProps;
  }, [boundingClientRect.height, boundingClientRect.width]);

  return (
    <div ref={ref} className={styles.container}>
      <canvas ref={canvasRef} {...canvasProps} />
    </div>
  );
};

export default AnimatedBackgroundCanvas;
