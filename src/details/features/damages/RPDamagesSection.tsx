import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ReturnPeriodDamage } from '@nismod/irv-api-client';
import _ from 'lodash';
import { selector, useRecoilValue } from 'recoil';

import { InputRow } from '@/sidebar/ui/InputRow';

import { ButtonPlacement, DownloadButton } from '../DownloadButton';
import {
  buildOrdering,
  featureState,
  hazardDataParamsState,
  orderDamages,
  QUIRKY_FIELDS_MAPPING,
} from './DamagesSection';
import {
  EpochSelect,
  ReturnPeriodSelect,
  selectedEpochState,
  selectedHazardState,
  selectedRpOptionState,
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

const rpOrderingState = selector({
  key: 'rpOrderingState',
  get: ({ get }) => {
    const params = get(hazardDataParamsState);

    return buildOrdering(params, ['rp', 'rcp', 'epoch']);
  },
});

const rpDamageDataState = selector({
  key: 'DamagesSection/rpDamageDataState',
  get: ({ get }) => {
    const raw = get(featureState)?.damages_return_period;
    if (raw == null) return [];

    const prepared = raw.map(getRPDamageObject);

    return orderDamages(prepared, get(rpOrderingState), getRPDamageKey);
  },
});

export const selectedRpDataState = selector({
  key: 'DamagesSection/selectedRpDataState',
  get: ({ get }) => {
    const selectedHazard = get(selectedHazardState);

    return selectedHazard
      ? get(rpDamageDataState).filter(
          (x) => x.hazard === selectedHazard && x.epoch === get(selectedEpochState),
        )
      : null;
  },
});

const filteredTableDataState = selector({
  key: 'DamagesSection/filteredTableDataState',
  get: ({ get }) => {
    const selectedRpOption = get(selectedRpOptionState);
    const selectedRpData = get(selectedRpDataState);

    if (!selectedRpData) {
      return null;
    }

    if (!selectedRpOption || selectedRpOption === SHOW_ALL_OPTION) {
      return selectedRpData;
    }

    return selectedRpData.filter((dataRow) => dataRow.rp === +selectedRpOption);
  },
});

export const RPDamagesSection = () => {
  const fd = useRecoilValue(featureState);
  const returnPeriodDamagesData = useRecoilValue(rpDamageDataState);
  const selectedRPData = useRecoilValue(selectedRpDataState);
  const filteredTableData = useRecoilValue(filteredTableDataState);

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
              actions={false}
              padding={0}
              width={355} // this is currently picked to fit the chart to the sidebar width
              height={150}
              renderer="svg"
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
