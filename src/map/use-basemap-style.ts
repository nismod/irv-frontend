import _ from 'lodash';
import { StyleSpecification } from 'maplibre-gl';
import { useEffect, useMemo } from 'react';
import { useFetch } from 'use-http';

import {
  BACKGROUND_ATTRIBUTIONS,
  BackgroundName,
  BACKGROUNDS,
  BackgroundSpecification,
  BASEMAP_STYLE_URL,
  LABELS_LAYERS,
} from '@/config/basemaps';

function visible(isVisible: boolean): 'visible' | 'none' {
  return isVisible ? 'visible' : 'none';
}

function makeBasemapStyle(
  baseStyle: StyleSpecification,
  backgroundConfig: BackgroundSpecification,
  showLabels: boolean,
): StyleSpecification {
  const backgroundLayersLookup = new Set(backgroundConfig.layers);
  const labelLayersLookup = new Set(LABELS_LAYERS);

  const style = _.cloneDeep(baseStyle);

  for (const layer of style.layers) {
    const { id } = layer;

    const isVisible = backgroundLayersLookup.has(id) || (showLabels && labelLayersLookup.has(id));
    _.set(layer, 'layout.visibility', visible(isVisible));
  }

  return style;
}

export function useBasemapStyle(
  background: BackgroundName,
  showLabels: boolean,
): { mapStyle: StyleSpecification; firstLabelId: string | undefined } {
  const backgroundConfig = BACKGROUNDS[background];
  const {
    get,
    data: baseStyle = {
      version: 8,
      sources: {},
      layers: [],
    },
  } = useFetch(BASEMAP_STYLE_URL);

  useEffect(() => {
    get();
  }, [get]);

  const mapStyle = useMemo(
    () => makeBasemapStyle(baseStyle, backgroundConfig, showLabels),
    [baseStyle, backgroundConfig, showLabels],
  );

  const firstLabelId = showLabels ? LABELS_LAYERS[0] : undefined;

  return {
    mapStyle,
    firstLabelId,
  };
}

export function useBackgroundAttribution(background: BackgroundName) {
  return BACKGROUND_ATTRIBUTIONS[background];
}
