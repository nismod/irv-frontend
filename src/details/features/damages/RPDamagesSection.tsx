import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReturnPeriodDamage } from '@nismod/irv-api-client';
import { atom, useAtomValue } from 'jotai';
import _ from 'lodash';

import { InputRow } from '@/sidebar/ui/InputRow';

import { ButtonPlacement, DownloadButton } from '../DownloadButton';
import {
  buildOrdering,
  featureAtom,
  hazardDataParamsAtom,
  orderDamages,
  QUIRKY_FIELDS_MAPPING,
} from './DamagesSection';
import {
  EpochSelect,
  ReturnPeriodSelect,
  selectedEpochAtom,
  selectedHazardAtom,
  selectedRpOptionAtom,
  SHOW_ALL_OPTION,
} from './param-controls';
import { ReturnPeriodDamageChart } from './ReturnPeriodDamageChart';
import { RPDamageTable } from './RPDamageTable';

function getRPDamageKey({ hazard, rcp, epoch, rp }) {
  return `${hazard}__rcp_${rcp}__epoch_${epoch}__rp_${rp}__conf_None`;
}

interface RPDamageCell {
  key: string;
  hazard: string;
  rcp: string;
  rp: number;
  probability: number;
  epoch: string;
  damage_mean: number;
  damage_amin: number;
  damage_amax: number;
  loss_mean: number;
  loss_amin: number;
  loss_amax: number;
}

function getRPDamageObject(d: ReturnPeriodDamage): RPDamageCell {
  const { hazard, epoch, rcp } = _.mapValues(QUIRKY_FIELDS_MAPPING, (fn, key) =>
    fn?.(d[key].toString()),
  );

  return {
    key: getRPDamageKey({ hazard, epoch, rcp, rp: d.rp }),
    hazard,
    epoch,
    rcp,
    rp: d.rp,
    probability: 1 / d.rp,
    damage_mean: d.damage_mean,
    damage_amin: d.damage_amin,
    damage_amax: d.damage_amax,
    loss_mean: d.loss_mean,
    loss_amin: d.loss_amin,
    loss_amax: d.loss_amax,
  };
}

function makeRPDamagesCsv(damages: RPDamageCell[]) {
  return (
    'hazard,rcp,epoch,rp,damage_mean,damage_amin,damage_amax,loss_mean,loss_amin,loss_amax\n' +
    damages
      .map(
        (d) =>
          `${d.hazard},${d.rcp},${d.epoch},${d.rp},${d.damage_mean},${d.damage_amin},${d.damage_amax},${d.loss_mean},${d.loss_amin},${d.loss_amax}`,
      )
      .join('\n')
  );
}

const rpOrderingAtom = atom((get) => {
  const params = get(hazardDataParamsAtom);

  return buildOrdering(params, ['rp', 'rcp', 'epoch']);
});

const rpDamageDataAtom = atom((get) => {
  const raw = get(featureAtom)?.damages_return_period;
  if (raw == null) return [];

  const prepared = raw.map(getRPDamageObject);

  return orderDamages(prepared, get(rpOrderingAtom), getRPDamageKey);
});

export const selectedRpDataAtom = atom((get) => {
  const selectedHazard = get(selectedHazardAtom);

  return selectedHazard
    ? get(rpDamageDataAtom).filter(
        (x) => x.hazard === selectedHazard && x.epoch === get(selectedEpochAtom),
      )
    : null;
});

const filteredTableDataAtom = atom((get) => {
  const selectedRpOption = get(selectedRpOptionAtom);
  const selectedRpData = get(selectedRpDataAtom);

  if (!selectedRpData) {
    return null;
  }

  if (!selectedRpOption || selectedRpOption === SHOW_ALL_OPTION) {
    return selectedRpData;
  }

  return selectedRpData.filter((dataRow) => dataRow.rp === +selectedRpOption);
});

export const RPDamagesSection = () => {
  const fd = useAtomValue(featureAtom);
  const returnPeriodDamagesData = useAtomValue(rpDamageDataAtom);
  const selectedRPData = useAtomValue(selectedRpDataAtom);
  const filteredTableData = useAtomValue(filteredTableDataAtom);

  return (
    <Box py={2}>
      <Stack spacing={3}>
        <Box position="relative">
          <Typography variant="h6">Return Period Damages</Typography>
          {fd && (
            <ButtonPlacement>
              <DownloadButton
                makeContent={() => makeRPDamagesCsv(returnPeriodDamagesData)}
                title="Download CSV with return period data"
                filename={`feature_${fd.id}_damages_rp.csv`}
              />
            </ButtonPlacement>
          )}
        </Box>

        <InputRow>
          <EpochSelect />
          <ReturnPeriodSelect />
        </InputRow>

        {selectedRPData ? (
          <>
            <ReturnPeriodDamageChart
              data={{
                table: selectedRPData,
              }}
              field_key="damage_mean"
              field_title="Damage (USD)"
              field_min="damage_amin"
              field_max="damage_amax"
            />
            <RPDamageTable damages={filteredTableData} />
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
