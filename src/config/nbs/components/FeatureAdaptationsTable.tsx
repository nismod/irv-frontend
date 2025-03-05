import { ZoomIn, ZoomOut } from '@mui/icons-material';
import { IconButton, TableCell } from '@mui/material';
import { Box } from '@mui/system';
import { FC, useMemo } from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ExpandableRow } from '@/lib/asset-list/ExpandableRow';
import { SortedAssetTable } from '@/lib/asset-list/SortedAssetTable';
import { ListFeature } from '@/lib/asset-list/use-sorted-features';
import { colorMap } from '@/lib/color-map';
import { ColorBox } from '@/lib/ui/data-display/ColorBox';

import { apiClient } from '@/api-client';
import { ExtendedAssetDetails } from '@/details/features/asset-details';
import {
  nbsAdaptationScopeSpecState,
  nbsColorSpecState,
  nbsFieldSpecState,
  nbsLayerSpecState,
} from '@/state/data-selection/nbs';
import { boundedFeatureState } from '@/state/layers/ui-layers/feature-bbox';

import { getNbsDataFormatsConfig } from '../data-formats';
import { NbsDetails } from '../details';

export const hoveredAdaptationFeatureState = atom<ListFeature>({
  key: 'hoveredAdaptationFeatureState',
  default: null,
});

export const selectedAdaptationFeatureState = atom<ListFeature>({
  key: 'selectedAdaptationFeatureState',
  default: null,
});

export const FeatureAdaptationsTable: FC<{
  onZoomInFeature?: (feature: ListFeature) => void;
  onZoomOutRegion?: () => void;
}> = ({ onZoomInFeature, onZoomOutRegion }) => {
  const layerSpec = useRecoilValue(nbsLayerSpecState);
  const fieldSpec = useRecoilValue(nbsFieldSpecState);
  const colorSpec = useRecoilValue(nbsColorSpecState);
  const scopeSpec = useRecoilValue(nbsAdaptationScopeSpecState);

  const setBoundedFeature = useSetRecoilState(boundedFeatureState);
  const [selectedFeature, setSelectedFeature] = useRecoilState(selectedAdaptationFeatureState);

  const colorFn = useMemo(() => colorMap(colorSpec), [colorSpec]);

  const { getDataLabel, getValueFormatted } = useMemo(() => getNbsDataFormatsConfig(), []);

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
              {onZoomOutRegion && (
                <IconButton
                  onClick={() => onZoomOutRegion()}
                  title="Zoom out to whole region"
                  sx={{
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <ZoomOut />
                </IconButton>
              )}
            </TableCell>
          </>
        }
        renderRow={(feature, localIndex, globalIndex) => (
          <ExpandableRow
            key={feature.id}
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
              {getValueFormatted(feature.value, fieldSpec)}
            </TableCell>
            <TableCell>
              {onZoomInFeature && (
                <IconButton
                  title="Zoom in to asset"
                  className="row-hovered-visible"
                  size="small"
                  sx={{
                    padding: 0,
                    margin: 0,
                  }}
                  onClick={(e) => {
                    onZoomInFeature(feature);
                    e.stopPropagation();
                  }}
                >
                  <ZoomIn />
                </IconButton>
              )}
            </TableCell>
          </ExpandableRow>
        )}
      />
    </>
  );
};
