import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Dsv from 'd3-dsv';
import * as d3Format from 'd3-format';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Selection from 'd3-selection';
import * as d3Shape from 'd3-shape';

export const d3 = {
  scale: { ...d3Scale },
  scaleChromatic: { ...d3ScaleChromatic },
  array: { ...d3Array },
  interpolate: { ...d3Interpolate },
  format: { ...d3Format },
  color: { ...d3Color },
  dsv: { ...d3Dsv },
  selection: { ...d3Selection },
  shape: { ...d3Shape },
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace D3 {
  export import scale = d3Scale;
  export import scaleChromatic = d3ScaleChromatic;
  export import array = d3Array;
  export import interpolate = d3Interpolate;
  export import format = d3Format;
  export import color = d3Color;
  export import dsv = d3Dsv;
  export import selection = d3Selection;
  export import shape = d3Shape;
}
