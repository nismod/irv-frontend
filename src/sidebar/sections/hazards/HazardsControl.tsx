import { Stack } from '@mui/material';
import { FC, ReactNode, Suspense, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { DataGroup } from '@/lib/data-selection/DataGroup';
import { SubSectionToggle } from '@/lib/data-selection/sidebar/SubSectionToggle';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { HazardType } from '@/config/hazards/metadata';
import { LinkViewLayerToPath } from '@/sidebar/LinkViewLayerToPath';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { InputRow } from '@/sidebar/ui/InputRow';
import { EpochControl } from '@/sidebar/ui/params/EpochControl';
import { GCMControl } from '@/sidebar/ui/params/GCMControl';
import { RCPControl } from '@/sidebar/ui/params/RCPControl';
import { ReturnPeriodControl } from '@/sidebar/ui/params/ReturnPeriodControl';
import { SSPControl } from '@/sidebar/ui/params/SSPControl';
import { TriggerControl } from '@/sidebar/ui/params/TriggerControl';
import { hazardDomainsConfigState } from '@/state/data-domains/hazards';
import { paramsConfigState, useLoadParamsConfig } from '@/state/data-params';
import { hazardSelectionState } from '@/state/data-selection/hazards';

/**
 * Takes the config for the specified hazard type and loads all the param domains/dependencies from the backend
 */
export const LoadHazardConfig: FC<{ type: HazardType }> = ({ type }) => {
  useLoadParamsConfig(hazardDomainsConfigState(type), type);

  return null;
};

/**
 *  Ensures the config for the specified data param group has been loaded
 */
const EnsureHazardConfig: FC<{ type: HazardType }> = ({ type }) => {
  useRecoilValue(paramsConfigState(type));

  return null;
};

const HazardErrorBoundary: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary message="There was a problem loading configuration for this layer">
      {children}
    </ErrorBoundary>
  );
};

const HazardTypeInit: FC<{ types: HazardType[]; children: ReactNode }> = ({ types, children }) => {
  return (
    <HazardErrorBoundary>
      {/* Wrap the data init and usage in separate Suspenses to prevent deadlock */}
      <Suspense fallback={null}>
        {types.map((type) => (
          <LoadHazardConfig key={type} type={type} />
        ))}
      </Suspense>
      <Suspense fallback="Loading data...">
        {types.map((type) => (
          <EnsureHazardConfig key={type} type={type} />
        ))}
        {children}
      </Suspense>
    </HazardErrorBoundary>
  );
};

const HazardControlLayout = ({ children }) => {
  return <Stack spacing={3}>{children}</Stack>;
};

function ActivateHazardViewLayer({ type }: { type: HazardType }) {
  return <LinkViewLayerToPath state={hazardSelectionState(type)} />;
}

/** Packages up all functionality for a hazard layer control that only controls one hazard type. */
const SimpleHazardControl = ({ type, children }) => {
  return (
    <HazardTypeInit types={[type]}>
      <DataGroup group={type}>
        <HazardControlLayout>{children}</HazardControlLayout>
      </DataGroup>
      <ActivateHazardViewLayer type={type} />
    </HazardTypeInit>
  );
};

export const FluvialControl = () => {
  const [subsections] = useState(() => [
    {
      subPath: 'aqueduct',
      label: 'Aqueduct',
      content: <FluvialAqueductSubsection />,
    },
    {
      subPath: 'jrc',
      label: 'JRC',
      content: <FluvialJRCSubsection />,
    },
  ]);
  return (
    <HazardTypeInit types={['fluvial', 'jrc_flood']}>
      <SubSectionToggle sections={subsections} />
    </HazardTypeInit>
  );
};

const FluvialAqueductSubsection = () => {
  return (
    <SimpleHazardControl type="fluvial">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows river flooding depths for different return periods, from WRI Aqueduct (2020).
        </DataNoticeTextBlock>
      </DataNotice>
      <ReturnPeriodControl />
      <InputRow>
        <EpochControl />
        <RCPControl />
      </InputRow>
      <GCMControl />
    </SimpleHazardControl>
  );
};

const FluvialJRCSubsection = () => {
  return (
    <SimpleHazardControl type="jrc_flood">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows river flooding depths for different return periods, from JRC Global Flood Hazard
          Maps (2024).
        </DataNoticeTextBlock>
      </DataNotice>
      <ReturnPeriodControl />
    </SimpleHazardControl>
  );
};

export const CoastalControl = () => {
  return (
    <SimpleHazardControl type="coastal">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows coastal flooding depths for different return periods, from WRI Aqueduct (2020).
        </DataNoticeTextBlock>
      </DataNotice>
      <ReturnPeriodControl />
      <InputRow>
        <EpochControl />
        <RCPControl />
      </InputRow>
    </SimpleHazardControl>
  );
};

export const CycloneControl = () => {
  return (
    <SimpleHazardControl type="cyclone">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows tropical cyclone maximum wind speed (in m/s) for different return periods, from
          Bloemendaal et al (2020).
        </DataNoticeTextBlock>
      </DataNotice>
      <ReturnPeriodControl
        valueLabelDisplay="auto"
        showMarkLabelsFor={[10, 50, 100, 500, 1000, 5000, 10000]}
      />
      <InputRow>
        <EpochControl />
        <RCPControl />
      </InputRow>
      <GCMControl />
    </SimpleHazardControl>
  );
};

export const CycloneIrisControl = () => {
  return (
    <SimpleHazardControl type="cyclone_iris">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows tropical cyclone maximum wind speeds (in m/s) for different return periods,
          derived from event sets published in Sparks and Toumi (2024).
        </DataNoticeTextBlock>
      </DataNotice>
      <ReturnPeriodControl
        valueLabelDisplay="auto"
        showMarkLabelsFor={[10, 50, 100, 500, 1000, 5000, 10000]}
      />
      <InputRow>
        <EpochControl />
        <SSPControl />
      </InputRow>
    </SimpleHazardControl>
  );
};

export const ExtremeHeatControl = () => {
  return (
    <SimpleHazardControl type="extreme_heat">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows the annual probability of an "extreme heat event" in each grid cell. Extreme
          heat events are defined by Lange et al (2020) as occurring when two indicators both exceed
          a threshold: a relative indicator based on temperature (Russo et al 2015, 2017) and an
          absolute indicator based on temperature and relative humidity (Masterton & Richardson,
          1979).
        </DataNoticeTextBlock>
      </DataNotice>
      <InputRow>
        <EpochControl />
        <RCPControl />
      </InputRow>
      <GCMControl />
    </SimpleHazardControl>
  );
};

export const DroughtControl = () => {
  return (
    <SimpleHazardControl type="drought">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows annual probability of a "drought event", defined by Lange et al (2020) as
          monthly soil moisture falling below the 2.5th percentile of the preindustrial baseline
          distribution for at least seven consecutive months. Multiple impact models are available,
          currently showing "WaterGAP2".
        </DataNoticeTextBlock>
      </DataNotice>
      <InputRow>
        <EpochControl />
        <RCPControl />
      </InputRow>
      <GCMControl />
    </SimpleHazardControl>
  );
};

export const LandslideControl = () => {
  return (
    <SimpleHazardControl type="landslide">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows landslide susceptibility, from Arup (2021) Global Landslide Hazard Map produced
          for the World Bank and GFDRR.
        </DataNoticeTextBlock>
      </DataNotice>
      <InputRow>
        <TriggerControl />
      </InputRow>
    </SimpleHazardControl>
  );
};

export const EarthquakeControl = () => {
  return (
    <SimpleHazardControl type="earthquake">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows seismic hazard as the peak ground acceleration (PGA) with a 10% probability of
          being exceeded in 50 years, from the Global Earthquake Model (GEM){' '}
          <a href="https://maps.openquake.org/map/global-seismic-hazard-map/">
            Global Seismic Hazard Map (version 2018.1)
          </a>
        </DataNoticeTextBlock>

        <DataNoticeTextBlock>Return Period: 475 years</DataNoticeTextBlock>
      </DataNotice>
    </SimpleHazardControl>
  );
};
