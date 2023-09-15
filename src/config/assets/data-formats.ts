import { FieldSpec, FormatConfig } from '@/lib/data-map/view-layers';
import { isNullish, numFormatMoney } from '@/lib/helpers';

import { HAZARDS_METADATA } from '@/config/hazards/metadata';

function getSourceLabel(eadSource: string) {
  if (eadSource === 'all') return 'All Hazards';

  return HAZARDS_METADATA[eadSource].label;
}

function getDamageTypeLabel(field) {
  if (field === 'ead_mean') return 'Direct Damages';
  else if (field === 'eael_mean') return 'Economic Losses';
}

function formatDamageValue(value) {
  if (isNullish(value)) return value;

  return `$${numFormatMoney(value)}`;
}
const DAMAGES_EXPECTED_DEFAULT_FORMAT: FormatConfig = {
  getDataLabel: (colorField) => {
    const variableLabel = getDamageTypeLabel(colorField.field);
    const sourceLabel = getSourceLabel(colorField.fieldDimensions.hazard);
    return `${variableLabel} (${sourceLabel})`;
  },
  getValueFormatted: formatDamageValue,
};

const DAMAGES_EXPECTED_LEGEND_FORMAT: FormatConfig = {
  getDataLabel: ({ field }) => getDamageTypeLabel(field),
  getValueFormatted: formatDamageValue,
};

// ==== ALL FORMATS ====

type FormatTarget = 'legend' | 'default';

const DATA_FORMATS: Record<string, Record<FormatTarget, FormatConfig>> = {
  damages_expected: {
    default: DAMAGES_EXPECTED_DEFAULT_FORMAT,
    legend: DAMAGES_EXPECTED_LEGEND_FORMAT,
  },
};

export function getAssetDataFormats(fieldSpec: FieldSpec): FormatConfig {
  return DATA_FORMATS[fieldSpec.fieldGroup].default;
}

export function getAssetLegendDataFormats(fieldSpec: FieldSpec): FormatConfig {
  return DATA_FORMATS[fieldSpec.fieldGroup].legend;
}
