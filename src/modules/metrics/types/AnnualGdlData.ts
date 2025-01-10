/**
 * Record of a GDL dataset value for a given year
 */
export type AnnualGdlRecord = {
  year: number;
  iso: string;
  gdlCode: string;
  regionName: string;
  value: number;
};
