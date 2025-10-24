/**
 * Record of a GDL dataset value for a given year
 */
export type AnnualGdlRecord = {
  year: number;
  gdlCode: string;
  regionName: string;
  value: number;
};

/**
 * GDL records grouped by region
 */
export type AnnualGdlGrouped = {
  regionKey: string;
  indexData: AnnualGdlRecord[];
};
