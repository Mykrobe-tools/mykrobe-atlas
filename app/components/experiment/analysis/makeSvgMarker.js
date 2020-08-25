/* @flow */

import memoizeOne from 'memoize-one';

import * as Colors from '../../../constants/Colors';

export const DEFAULT_LAT = 51.5074;
export const DEFAULT_LNG = 0.1278;

const makeSvgMarker = memoizeOne(
  ({
    color = Colors.COLOR_HIGHLIGHT_EXPERIMENT,
    diameter = 32,
    strokeWidth = 4,
  }: {
    color?: string,
    diameter?: number,
    strokeWidth?: number,
  }) => {
    const radiusMinusStroke = 0.5 * diameter - 0.5 * strokeWidth;
    const radius = 0.5 * diameter;
    const svg = `\
<svg viewBox="-${radius} -${radius} ${diameter} ${diameter}" xmlns="http://www.w3.org/2000/svg">
  <circle fill="${color}" stroke="white" stroke-width="4" cx="0" cy="0" r="${radiusMinusStroke}"/>
</svg>`;
    const svgEncoded = window.btoa(svg);
    const dataBase64 = `data:image/svg+xml;base64,${svgEncoded}`;
    return dataBase64;
  }
);

export default makeSvgMarker;
