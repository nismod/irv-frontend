import {
  Box,
  List,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Adaptation } from '@nismod/irv-api-client';
import { csvFormat as d3CsvFormat } from 'd3-dsv';
import { FC } from 'react';

import { numFormat, numRangeFormat, titleCase, toLabelLookup } from '@/lib/helpers';
import { DataItem } from '@/lib/ui/data-display/DataItem';

import { ApiDetailsComponentType } from '@/details/features/asset-details';
import { DetailHeader, DetailsComponentProps } from '@/details/features/detail-components';
import { ButtonPlacement, DownloadButton } from '@/details/features/DownloadButton';

import { NBS_ADAPTATION_TYPE_LABELS, NBS_HAZARD_METADATA } from './metadata';

export const NbsDetails: FC<DetailsComponentProps> = ({ f }) => {
  return (
    <>
      <DetailHeader>{f.id}</DetailHeader>
      <List>
        <DataItem label="Land use" value={f.option_landuse} />
        <DataItem label="GADM 0" value={f.GID_0} />
        <DataItem label="GADM 1" value={f.GID_1} />
        <DataItem label="GADM 2" value={f.GID_2} />
        <DataItem label="HYBAS ID" value={f.HYBAS_ID} maximumSignificantDigits={10} />
      </List>
    </>
  );
};

const nbsAdaptationNameLabelLookup = toLabelLookup(NBS_ADAPTATION_TYPE_LABELS);

export const NbsExtendedDetails: ApiDetailsComponentType = ({ fd }) => {
  const adaptations = fd?.adaptation;
  return (
    <Box py={2}>
      <Stack spacing={3}>
        <Box position="relative">
          <Typography variant="h6">Adaptations</Typography>
          {fd && (
            <ButtonPlacement>
              <DownloadButton
                title="Download CSV with adaptations data"
                makeContent={() => makeAdaptationsCsv(adaptations)}
                filename={`feature_${fd.id}_adaptations.csv`}
              />
            </ButtonPlacement>
          )}
          <AdaptationOptionsTable adaptations={adaptations} />
        </Box>
      </Stack>
    </Box>
  );
};

function makeAdaptationsCsv(adaptations: Adaptation[]) {
  return d3CsvFormat(
    adaptations.map(
      ({
        hazard,
        rcp,
        adaptation_name,
        adaptation_protection_level,
        properties: { adaptation_cost, avoided_ead_amin, avoided_ead_amax, avoided_ead_mean },
      }) => ({
        hazard,
        rcp,
        adaptation_name,
        adaptation_protection_level,
        adaptation_cost,
        avoided_ead_mean,
        avoided_ead_amin,
        avoided_ead_amax,
      }),
    ),
  );
}

const AdaptationOptionsTable: FC<{ adaptations: Adaptation[] }> = ({ adaptations }) => {
  const padding = { px: 0.75, py: 0.1 };

  return (
    <TableContainer>
      <Table size="small" padding="none" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={padding}>Hazard</TableCell>
            <TableCell sx={padding}>
              <abbr title="Representative Concentration Pathway (Climate Scenario)">RCP</abbr>
            </TableCell>
            <TableCell sx={padding}>Adaptation type</TableCell>
            <TableCell sx={padding} align="right">
              Avoided <abbr title="Expected Annual Damages">EAD</abbr>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adaptations.map(
            ({
              hazard,
              rcp,
              adaptation_name,
              properties: { avoided_ead_amin, avoided_ead_amax, avoided_ead_mean },
            }) => (
              <TableRow>
                <TableCell sx={padding}>{NBS_HAZARD_METADATA[hazard]?.label}</TableCell>
                <TableCell sx={padding}>{titleCase(rcp)}</TableCell>
                <TableCell sx={padding}>{nbsAdaptationNameLabelLookup[adaptation_name]}</TableCell>
                <TableCell sx={padding} align="right">
                  {avoided_ead_amax ? numFormat(avoided_ead_mean) : '-'}
                  <br />
                  {avoided_ead_amax
                    ? `(${numRangeFormat(avoided_ead_amin, avoided_ead_amax)})`
                    : null}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
