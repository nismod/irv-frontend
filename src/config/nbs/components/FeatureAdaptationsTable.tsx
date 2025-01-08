import { ZoomIn, ZoomOut } from '@mui/icons-material';
import { IconButton, TableCell } from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ExpandableRow } from '@/lib/asset-list/ExpandableRow';
import { SortedAssetTable } from '@/lib/asset-list/SortedAssetTable';
import { LayerSpec, ListFeature } from '@/lib/asset-list/use-sorted-features';
import { extendBbox } from '@/lib/bounding-box';
import { colorMap } from '@/lib/color-map';
import { ColorBox } from '@/lib/ui/data-display/ColorBox';

import { apiClient } from '@/api-client';
import { ExtendedAssetDetails } from '@/details/features/asset-details';
import { mapFitBoundsState } from '@/map/MapView';
import {
  nbsAdaptationScopeSpecState,
  nbsColorSpecState,
  nbsFieldSpecState,
  nbsSelectedScopeRegionBboxState,
} from '@/state/data-selection/nbs';
import { boundedFeatureState } from '@/state/layers/ui-layers/feature-bbox';

import { NbsDetails } from '../details';
import { ADAPTATION_VARIABLE_LABELS } from '../metadata';

export const hoveredAdaptationFeatureState = atom<ListFeature>({
  key: 'hoveredAdaptationFeatureState',
  default: null,
});

export const selectedAdaptationFeatureState = atom<ListFeature>({
  key: 'selectedAdaptationFeatureState',
  default: null,
});

export const FeatureAdaptationsTable = () => {
  const [layerSpec] = useState<LayerSpec>(() => ({
    layer: 'nbs',
  }));

  const fieldSpec = useRecoilValue(nbsFieldSpecState);
  const colorSpec = useRecoilValue(nbsColorSpecState);
  const scopeSpec = useRecoilValue(nbsAdaptationScopeSpecState);

  const scopeRegionExtent = useRecoilValue(nbsSelectedScopeRegionBboxState);

  const setBoundedFeature = useSetRecoilState(boundedFeatureState);
  const [selectedFeature, setSelectedFeature] = useRecoilState(selectedAdaptationFeatureState);
  const setMapFitBounds = useSetRecoilState(mapFitBoundsState);

  const handleZoomInFeature = useCallback(
    (feature: ListFeature) => feature && setMapFitBounds(extendBbox(feature.bbox, 1)),
    [setMapFitBounds],
  );

  const handleZoomOutRegion = useCallback(() => {
    if (!scopeRegionExtent) return;
    setMapFitBounds([...scopeRegionExtent]);
  }, [scopeRegionExtent, setMapFitBounds]);

  useEffect(() => {
    if (!scopeRegionExtent) return;
    handleZoomOutRegion();
  }, [handleZoomOutRegion, scopeRegionExtent]);

  const colorFn = useMemo(() => colorMap(colorSpec), [colorSpec]);

  const { getDataLabel, getValueFormatted } = useMemo(
    () => ({
      getDataLabel: ({ field }) => ADAPTATION_VARIABLE_LABELS.find((x) => x.value === field)?.label,
      getValueFormatted: (value) =>
        typeof value === 'number'
          ? value.toLocaleString(undefined, {
              maximumSignificantDigits: 3,
            })
          : `${value}`,
    }),
    [],
  );

  return (
    <>
      <Box position="absolute" top={0} right={25} zIndex={1000}></Box>
      <SortedAssetTable
        apiClient={apiClient}
        layerSpec={layerSpec}
        fieldSpec={fieldSpec}
        scopeSpec={scopeSpec}
        header={
          <>
            <TableCell width={10}>#</TableCell>
            <TableCell>{getDataLabel(fieldSpec)}</TableCell>
            <TableCell>
              <IconButton
                onClick={handleZoomOutRegion}
                title="Zoom out to whole region"
                sx={{
                  padding: 0,
                  margin: 0,
                }}
              >
                <ZoomOut />
              </IconButton>
            </TableCell>
          </>
        }
        renderRow={(feature, localIndex, globalIndex) => (
          <ExpandableRow
            key={feature.string_id}
            expanded={feature === selectedFeature}
            onExpandedChange={(expanded) => setSelectedFeature(expanded ? feature : null)}
            onMouseEnter={() => setBoundedFeature(feature)}
            onMouseLeave={() => setBoundedFeature(null)}
            expandableContent={
              <Box py={1}>
                <ExtendedAssetDetails
                  feature={feature}
                  label="Nature-based solution"
                  DetailsComponent={NbsDetails}
                />
              </Box>
            }
          >
            <TableCell>{globalIndex + 1}</TableCell>
            <TableCell>
              <ColorBox color={colorFn(feature.value)} />
              {getValueFormatted(feature.value)}
            </TableCell>
            <TableCell>
              <IconButton
                title="Zoom in to asset"
                className="row-hovered-visible"
                size="small"
                sx={{
                  padding: 0,
                  margin: 0,
                }}
                onClick={(e) => {
                  handleZoomInFeature(feature);
                  e.stopPropagation();
                }}
              >
                <ZoomIn />
              </IconButton>
            </TableCell>
          </ExpandableRow>
        )}
      />
    </>
  );
};
