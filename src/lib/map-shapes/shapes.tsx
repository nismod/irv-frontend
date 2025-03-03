/* eslint import/no-duplicates: 0 */

import CircleShapeSrc from './shapes/circle.svg';
import CircleShape from './shapes/circle.svg?react';
import DiamondShapeSrc from './shapes/diamond.svg';
import DiamondShape from './shapes/diamond.svg?react';
import InvTriangleShapeSrc from './shapes/inv-triangle.svg';
import InvTriangleShape from './shapes/inv-triangle.svg?react';
import LineShapeSrc from './shapes/line.svg';
import LineShape from './shapes/line.svg?react';
import PolygonShapeSrc from './shapes/polygon.svg';
import PolygonShape from './shapes/polygon.svg?react';
import SquareShapeSrc from './shapes/square.svg';
import SquareShape from './shapes/square.svg?react';

export const MAP_SHAPE_TYPES = [
  'line',
  'circle',
  'square',
  'polygon',
  'inv-triangle',
  'diamond',
] as const;
export type MapShapeType = (typeof MAP_SHAPE_TYPES)[number];

type SVGComponent = typeof LineShape;

export const shapeComponents: Record<MapShapeType, SVGComponent> = {
  line: LineShape,
  circle: CircleShape,
  square: SquareShape,
  polygon: PolygonShape,
  'inv-triangle': InvTriangleShape,
  diamond: DiamondShape,
};

export const shapeUrls: Record<MapShapeType, string> = {
  line: LineShapeSrc,
  circle: CircleShapeSrc,
  square: SquareShapeSrc,
  polygon: PolygonShapeSrc,
  'inv-triangle': InvTriangleShapeSrc,
  diamond: DiamondShapeSrc,
};
