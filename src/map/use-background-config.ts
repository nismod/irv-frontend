import _ from 'lodash';

import { BACKGROUNDS, BACKGROUND_ATTRIBUTIONS, BackgroundName } from '@/config/backgrounds';

function visible(isVisible: boolean): 'visible' | 'none' {
  return isVisible ? 'visible' : 'none';
}

const makeBackgroundConfig = _.memoize((background: BackgroundName) => {
  return {
    version: 8,
    sources: _.mapValues(BACKGROUNDS, (b) => b.source),
    layers: Object.values(BACKGROUNDS).map((b) =>
      _.merge(b.layer, { layout: { visibility: visible(background === b.id) } }),
    ),
  };
});

export function useBackgroundConfig(background: BackgroundName) {
  return makeBackgroundConfig(background);
}

export function useBackgroundAttribution(background: BackgroundName) {
  return BACKGROUND_ATTRIBUTIONS[background];
}
