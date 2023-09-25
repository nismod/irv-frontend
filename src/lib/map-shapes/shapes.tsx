import { ReactComponent as CircleShape, default as CircleShapeSrc } from './shapes/circle.svg';
import { ReactComponent as DiamondShape, default as DiamondShapeSrc } from './shapes/diamond.svg';
import {
  ReactComponent as InvTriangleShape,
  default as InvTriangleShapeSrc,
} from './shapes/inv-triangle.svg';
import { ReactComponent as LineShape, default as LineShapeSrc } from './shapes/line.svg';
import { ReactComponent as PolygonShape, default as PolygonShapeSrc } from './shapes/polygon.svg';
import { ReactComponent as SquareShape, default as SquareShapeSrc } from './shapes/square.svg';

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
