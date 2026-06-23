import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ExpectedDamage } from '@nismod/irv-api-client';
import { atom, useAtomValue } from 'jotai';
import _ from 'lodash';
import { useMemo } from 'react';

import { getFeatureId } from '@/lib/deck/utils/get-feature-id';

import { ButtonPlacement, DownloadButton } from '../DownloadButton';
import {
  buildOrdering,
  featureAtom,
  hazardDataParamsAtom,
  orderDamages,
  QUIRKY_FIELDS_MAPPING,
} from './DamagesSection';
import { DamageTable } from './DamageTable';
import { ExpectedDamageChart } from './ExpectedDamageChart';
import { HazardSelect, selectedHazardAtom } from './param-controls';

function getDamageKey({ hazard, rcp, epoch }) {
  return `${hazard}__rcp_${rcp}__epoch_${epoch}__conf_None`;
}

export interface ExpectedDamageCell {
  key: string;
  hazard: string;
  rcp: string;
  epoch: string;
  ead_mean: number;
  ead_amin: number;
  ead_amax: number;
  eael_mean: number;
  eael_amin: number;
  eael_amax: number;
}
function getExpectedDamageObject(d: ExpectedDamage): ExpectedDamageCell {
  const { hazard, epoch, rcp } = _.mapValues(QUIRKY_FIELDS_MAPPING, (fn, key) =>
    fn?.(d[key].toString()),
  );

  return {
    key: getDamageKey({ hazard, rcp, epoch }),
    hazard,
    rcp,
    epoch,
    ead_mean: d.ead_mean,
    ead_amin: d.ead_amin,
    ead_amax: d.ead_amax,
    eael_mean: d.eael_mean,
    eael_amin: d.eael_amin,
    eael_amax: d.eael_amax,
  };
}

function prepareExpectedDamages(expectedDamages: ExpectedDamage[]) {
  return expectedDamages.filter((d) => d.protection_standard === 0).map(getExpectedDamageObject);
}

function makeDamagesCsv(damages: ExpectedDamageCell[]) {
  return (
    'hazard,rcp,epoch,ead_mean,ead_amin,ead_amax,eael_mean,eael_amin,eael_amax\n' +
    damages
      .map(
        (d) =>
          `${d.hazard},${d.rcp},${d.epoch},${d.ead_mean},${d.ead_amin},${d.ead_amax},${d.eael_mean},${d.eael_amin},${d.eael_amax}`,
      )
      .join('\n')
  );
}

const damagesOrderingAtom = atom((get) => {
  const params = get(hazardDataParamsAtom);

  return buildOrdering(params, ['rcp', 'epoch']);
});

export const damagesDataAtom = atom((get) => {
  const raw = get(featureAtom)?.damages_expected;
  if (raw == null) return [];

  const prepared = prepareExpectedDamages(raw);

  return orderDamages(prepared, get(damagesOrderingAtom), getDamageKey);
});

const selectedDamagesDataAtom = atom((get) => {
  const selectedHazard = get(selectedHazardAtom);
  return selectedHazard ? get(damagesDataAtom).filter((x) => x.hazard === selectedHazard) : null;
});

export const ExpectedDamagesSection = () => {
  const fd = useAtomValue(featureAtom);
  const damagesData = useAtomValue(damagesDataAtom);
  const selectedData = useAtomValue(selectedDamagesDataAtom);

  const has_eael = useMemo(
    () => (selectedData ? selectedData.some((d) => d.eael_amax > 0) : null),
    [selectedData],
  );

  return (
    <Box py={2}>
      <Stack spacing={3}>
        <Box position="relative">
          <Typography variant="h6">Expected Annual Damages</Typography>
          {fd && (
            <ButtonPlacement>
              <DownloadButton
                title="Download CSV with damages data"
                makeContent={() => makeDamagesCsv(damagesData)}
                filename={`feature_${getFeatureId(fd)}_damages.csv`}
              />
            </ButtonPlacement>
          )}
        </Box>
        <HazardSelect />
        {selectedData ? (
          <>
            <Box mt={1}>
              <ExpectedDamageChart
                data={{
                  table: selectedData,
                }}
                field="ead_mean"
                field_min="ead_amin"
                field_max="ead_amax"
                field_title="EAD (USD)"
              />
            </Box>
            {has_eael ? (
              <Box mt={1}>
                <Typography variant="subtitle2">Expected Annual Economic Losses</Typography>
                <ExpectedDamageChart
                  data={{
                    table: selectedData,
                  }}
                  field="eael_mean"
                  field_min="eael_amin"
                  field_max="eael_amax"
                  field_title="EAEL (USD/day)"
                />
              </Box>
            ) : (
              <Box mt={1}>
                <Typography variant="body2">
                  Indirect damages (losses) due to disruption of infrastructure services (loss of
                  power, transport disruption) are not yet available.
                </Typography>
              </Box>
            )}
            <Box mt={1}>
              <DamageTable damages={selectedData} />
            </Box>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No direct damages or indirect losses estimated.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
