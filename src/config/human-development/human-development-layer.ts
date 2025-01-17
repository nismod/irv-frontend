import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import React from 'react';

import { colorMap } from '@/lib/color-map';
import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { ColorSpec, FieldSpec, ViewLayer } from '@/lib/data-map/view-layers';
import { basicMvtLayer } from '@/lib/deck/layers/basic-mvt-layer';
import { makeDataColorAccessor } from '@/lib/deck/props/data-color';
import { featureProperty } from '@/lib/deck/props/data-source';
import { mvtSelection } from '@/lib/deck/props/mvt-selection';
import { border, fillColor } from '@/lib/deck/props/style';
import { toLabelLookup } from '@/lib/helpers';

import { SimpleAssetDetails } from '@/details/features/asset-details';

import { SOURCES } from '../sources';
import { getHumanDevelopmentDataFormats } from './data-formats';
import { HDI_REGION_LEVEL_DETAILS } from './details';
import { HdiHoverDescription } from './HdiHoverDescription';
import { HDI_REGION_LEVEL_LABELS, HdiRegionLevel, HdiVariableType } from './metadata';

const hdiColorLookup: Record<HdiVariableType, ColorSpec> = {
  subnational_hdi: {
    scale: d3Scale.scaleSequential,
    scheme: d3ScaleChromatic.interpolateBlues,
    range: [0, 1],
    empty: '#ccc',
  },
  educational_index: {
    scale: d3Scale.scaleSequential,
    scheme: d3ScaleChromatic.interpolatePurples,
    range: [0, 1],
    empty: '#ccc',
  },
  health_index: {
    scale: d3Scale.scaleSequential,
    scheme: d3ScaleChromatic.interpolateGreens,
    range: [0, 1],
    empty: '#ccc',
  },
  income_index: {
    scale: d3Scale.scaleSequential,
    scheme: d3ScaleChromatic.interpolateOranges,
    range: [0, 1],
    empty: '#ccc',
  },
};

const hdiRegionLabelLookup = toLabelLookup(HDI_REGION_LEVEL_LABELS);

export function humanDevelopmentLayer(
  regionLevel: HdiRegionLevel,
  variable: HdiVariableType,
): ViewLayer {
  const fieldSpec: FieldSpec = {
    fieldGroup: 'properties',
    field: variable,
  };

  const colorSpec = hdiColorLookup[variable];
  const regionLevelLabel = hdiRegionLabelLookup[regionLevel];

  const id = `hdi_${regionLevel}`;

  return {
    id,
    interactionGroup: 'hdi',
    params: {
      regionLevel,
      variable,
    },
    styleParams: {
      colorMap: {
        fieldSpec,
        colorSpec,
      },
    },
    fn: ({ deckProps, zoom, selection }) => {
      const dataStyleColor = makeDataColorAccessor(featureProperty(variable), colorMap(colorSpec));

      return basicMvtLayer(
        deckProps,
        {
          data: SOURCES.vector.getUrl(id),
        },
        border([40, 40, 40, 255]),
        fillColor(dataStyleColor),
        mvtSelection({
          selectedFeatureId: selection?.target.feature.id,
          selectionFillColor: [0, 0, 0, 0],
          selectionLineColor: [0, 255, 255, 255],
        }),
        {
          highlightColor: [255, 255, 255, 100],
        },
      );
    },
    dataFormatsFn: getHumanDevelopmentDataFormats,
    dataAccessFn: ({ field }) => featureProperty(field),
    renderDetails(selection: InteractionTarget<VectorTarget>) {
      const feature = selection.target.feature;
      const DetailsComponent = HDI_REGION_LEVEL_DETAILS[regionLevel];

      return React.createElement(SimpleAssetDetails, {
        DetailsComponent,
        feature: feature,
        label: `Human Development (${regionLevelLabel})`,
      });
    },

    renderTooltip(hover: InteractionTarget<VectorTarget>) {
      return React.createElement(HdiHoverDescription, {
        hoveredObject: hover,
      });
    },
  };
}
