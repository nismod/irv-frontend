import { ApiClient, FeatureListItemOut_float_ } from '@nismod/irv-api-client';
import pick from 'lodash/pick';
import { startTransition, useCallback, useEffect, useState } from 'react';

import { bboxWktToAppBoundingBox, BoundingBox } from '@/lib/bounding-box';
import { FieldSpec } from '@/lib/data-map/view-layers';

export interface PageInfo {
  page?: number;
  size?: number;
  total: number;
}

export interface LayerSpec {
  layer?: string;
  sector?: string;
  subsector?: string;
  assetType?: string;
}

export type ScopeSpec = Record<string, unknown>;

export type ListFeature = Omit<FeatureListItemOut_float_, 'bbox_wkt'> & {
  bbox: BoundingBox;
};

function processFeature(f: FeatureListItemOut_float_): ListFeature {
  return {
    ...f,
    bbox: bboxWktToAppBoundingBox(f.bbox_wkt),
  };
}

export const useSortedFeatures = (
  apiClient: ApiClient,
  layerSpec: LayerSpec,
  fieldSpec: FieldSpec,
  page = 1,
  pageSize = 50,
  scopeSpec?: ScopeSpec,
) => {
  const [features, setFeatures] = useState([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scheduleUpdate = useCallback((updater: () => void) => {
    startTransition(updater);
  }, []);

  const fetchFeatures = useCallback(async () => {
    scheduleUpdate(() => {
      setLoading(true);
      setError(null);
    });

    try {
      const { fieldGroup, fieldDimensions, field, fieldParams } = fieldSpec;
      const dimensions = JSON.stringify(fieldDimensions);
      const parameters = JSON.stringify(fieldParams);
      const rankingScope = scopeSpec != null ? JSON.stringify(scopeSpec) : null;

      if (dimensions === '{}') {
        return;
      }

      const response = await apiClient.features.featuresReadSortedFeatures({
        ...layerSpec,
        fieldGroup,
        field,
        dimensions,
        parameters,
        rankingScope,
        page,
        size: pageSize,
      });
      const features = (response.items as FeatureListItemOut_float_[]).map(processFeature);
      scheduleUpdate(() => {
        setFeatures(features);
        setPageInfo(pick(response, ['page', 'size', 'total']));
      });
    } catch (error) {
      scheduleUpdate(() => {
        setError(error);
      });
    }

    scheduleUpdate(() => {
      setLoading(false);
    });
  }, [apiClient, fieldSpec, scopeSpec, layerSpec, page, pageSize, scheduleUpdate]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures, fieldSpec, page, pageSize]);

  return {
    features,
    pageInfo,
    loading,
    error,
  };
};
