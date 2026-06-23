import landCoverLegend from './land-cover-legend.json';

type LegendJson = Record<string, { name: string }>;

const legend = landCoverLegend as LegendJson;

const codeToName = new Map<number, string>(
  Object.entries(legend).map(([code, { name }]) => [parseInt(code, 10), name]),
);

/**
 * ESA CCI–style land cover class code → human-readable category name (same legend as the map layer).
 * Returns undefined if the code is not in the project legend.
 */
export function getLandCoverCategoryName(code: number): string | undefined {
  return codeToName.get(code);
}
