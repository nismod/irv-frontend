import { MapShapeType } from '@/lib/map-shapes/shapes';

export interface AssetMetadata {
  type: MapShapeType;
  label: string;
  color: string;
}
