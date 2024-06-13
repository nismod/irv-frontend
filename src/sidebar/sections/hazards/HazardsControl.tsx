import { Stack } from '@mui/material';
import { Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { DataGroup } from '@/lib/data-selection/DataGroup';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { HazardType } from '@/config/hazards/metadata';
import { DataNotice, DataNoticeTextBlock } from '@/sidebar/ui/DataNotice';
import { InputRow } from '@/sidebar/ui/InputRow';
import { EpochControl } from '@/sidebar/ui/params/EpochControl';
import { GCMControl } from '@/sidebar/ui/params/GCMControl';
import { RCPControl } from '@/sidebar/ui/params/RCPControl';
import { ReturnPeriodControl } from '@/sidebar/ui/params/ReturnPeriodControl';
import { SSPControl } from '@/sidebar/ui/params/SSPControl';
import { hazardDomainsConfigState } from '@/state/data-domains/hazards';
import { paramsConfigState, useLoadParamsConfig } from '@/state/data-params';

/**
 * Takes the config for the specified hazard type and loads all the param domains/dependencies from the backend
 */
export const InitHazardData = ({ type }: { type: HazardType }) => {
  useLoadParamsConfig(hazardDomainsConfigState(type), type);

  return null;
};

/**
 *  Ensures the config for the specified data param group has been loaded
 */
const EnsureHazardData = ({ type }) => {
  useRecoilValue(paramsConfigState(type));

  return null;
};

const HazardControl = ({ type, children }) => {
  return (
    <ErrorBoundary message="There was a problem loading configuration for this layer">
      {/* Wrap the data init and usage in separate Suspenses to prevent deadlock */}
      <Suspense fallback={null}>
        <InitHazardData type={type} />
      </Suspense>
      <Suspense fallback="Loading data...">
        <EnsureHazardData type={type} />
        <DataGroup group={type}>
          <Stack spacing={3}>{children}</Stack>
        </DataGroup>
      </Suspense>
    </ErrorBoundary>
  );
};

export const FluvialControl = () => {
  return (
    <HazardControl type="fluvial">
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
    </HazardControl>
  );
};

export const CoastalControl = () => {
  return (
    <HazardControl type="coastal">
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
    </HazardControl>
  );
};

export const CycloneControl = () => {
  return (
    <HazardControl type="cyclone">
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
    </HazardControl>
  );
};

export const CycloneIrisControl = () => {
  return (
    <HazardControl type="cyclone_iris">
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
    </HazardControl>
  );
};

export const ExtremeHeatControl = () => {
  return (
    <HazardControl type="extreme_heat">
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
    </HazardControl>
  );
};

export const DroughtControl = () => {
  return (
    <HazardControl type="drought">
      <DataNotice>
        <DataNoticeTextBlock>
          Map shows annual probability of a "drought event", defined by Lange et al (2020) as
          monthly soil moisture falling below the 2.5th percentile of the preindustrial baseline
          distribution for at least seven consecutive months.
        </DataNoticeTextBlock>
      </DataNotice>
      <InputRow>
        <EpochControl />
        <RCPControl />
      </InputRow>
      <GCMControl />
    </HazardControl>
  );
};

export const EarthquakeControl = () => {
  return (
    <HazardControl type="earthquake">
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
    </HazardControl>
  );
};
