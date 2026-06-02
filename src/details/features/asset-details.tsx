import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FeatureOut } from '@nismod/irv-api-client';
import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import { ComponentType, FC, ReactElement, ReactNode, Suspense } from 'react';

import { d3 } from '@/lib/d3';
import { getFeatureId } from '@/lib/deck/utils/get-feature-id';
import { ColorBox } from '@/lib/ui/data-display/ColorBox';

import { apiFeatureQueryAtomFamily } from '@/state/queries';

import { DetailsComponentType } from './detail-components';
import { ButtonPlacement, DownloadButton } from './DownloadButton';

type FeatureApiDetails = FeatureOut;

const LoadDetails: FC<{
  featureDetailsAtom: Atom<FeatureApiDetails | Promise<FeatureApiDetails>>;
  children: (details: FeatureApiDetails) => ReactElement;
}> = ({ featureDetailsAtom, children }) => {
  const featureDetails = useAtomValue(featureDetailsAtom);

  return children(featureDetails);
};

interface SimpleFeature {
  id: number;
  properties?: Record<string, any>;
}

interface DetailsFeature extends SimpleFeature {
  properties: Record<string, any>;
}

const AssetDetailsWrapper: FC<{ children?: ReactNode }> = ({ children }) => {
  return <Box position="relative">{children}</Box>;
};

const AssetDetailsHeader: FC<{ label: string; color: string }> = ({ label, color }) => {
  return (
    <Box>
      <Typography variant="caption">
        <ColorBox color={color} />
        {label}
      </Typography>
    </Box>
  );
};

function makeDetailsCsv(fp: Record<string, any>) {
  return d3.dsv.csvFormat(Object.entries(fp).map(([variable, value]) => ({ variable, value })));
}

const AssetDetailsDownloadButton: FC<{ feature: DetailsFeature }> = ({ feature }) => {
  return (
    <DownloadButton
      makeContent={() => makeDetailsCsv(feature.properties)}
      title="Download CSV with feature metadata"
      filename={`feature_${feature.id}.csv`}
    />
  );
};

const HiddenFeatureDebug: FC<{ feature: any }> = ({ feature }) => {
  return <code style={{ display: 'none' }}>{JSON.stringify(feature, null, 2)}</code>;
};

const VisibleFeatureDetailsDebug: FC<{ featureDetails: FeatureApiDetails }> = ({
  featureDetails,
}) => {
  return (
    <details className="feature-details-debug">
      <summary>
        <small>Feature data</small>
      </summary>
      <pre>{JSON.stringify(featureDetails, null, 2)}</pre>
    </details>
  );
};

type SimpleAssetDetailsProps = {
  label: string;
  color?: string;
  DetailsComponent: DetailsComponentType;
  feature: DetailsFeature;
};

export const SimpleAssetDetails: FC<SimpleAssetDetailsProps> = ({
  label,
  color,
  DetailsComponent,
  feature,
}) => {
  return (
    <AssetDetailsWrapper>
      <HiddenFeatureDebug feature={feature.properties} />
      <AssetDetailsHeader label={label} color={color} />
      <DetailsComponent f={feature.properties} />
      <ButtonPlacement
        right={30} //hack: larger right margin to allow space for close button
      >
        <AssetDetailsDownloadButton feature={feature} />
      </ButtonPlacement>
    </AssetDetailsWrapper>
  );
};

export type ApiDetailsComponentType = ComponentType<{ fd: FeatureApiDetails }>;

type ExtendedAssetDetailsProps = Omit<SimpleAssetDetailsProps, 'feature'> & {
  feature: SimpleFeature;
  showRiskSection?: boolean;
  ApiDetailsComponent?: ApiDetailsComponentType;
};

export const ExtendedAssetDetails: FC<ExtendedAssetDetailsProps> = ({
  label,
  color,
  DetailsComponent,
  ApiDetailsComponent,
  feature,
  showRiskSection = true,
}) => {
  const id = getFeatureId(feature);
  const featureDetailsAtom = apiFeatureQueryAtomFamily(id);

  return (
    <AssetDetailsWrapper>
      <HiddenFeatureDebug feature={feature} />
      <AssetDetailsHeader label={label} color={color} />
      <Suspense fallback="Loading data...">
        <LoadDetails featureDetailsAtom={featureDetailsAtom}>
          {(featureDetails) => (
            <>
              <ButtonPlacement
                right={30} // hack: larger right margin to allow space for close button
              >
                <AssetDetailsDownloadButton feature={featureDetails} />
              </ButtonPlacement>
              <DetailsComponent f={featureDetails.properties} />
              {showRiskSection && ApiDetailsComponent && (
                <ApiDetailsComponent fd={featureDetails} />
              )}
              <VisibleFeatureDetailsDebug featureDetails={featureDetails} />
            </>
          )}
        </LoadDetails>
      </Suspense>
    </AssetDetailsWrapper>
  );
};
