import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import { apiClient } from '@/api-client';

export const rasterAllSourcesQueryAtom = atom(async () => {
  return await apiClient.tiles.tilesGetAllTileSourceMeta();
});

export const rasterSourceByDomainQueryAtomFamily = atomFamily((domain: string) =>
  atom(async (get) => {
    const sources = await get(rasterAllSourcesQueryAtom);

    const sourcesWithDomain = sources.filter((x) => x.domain === domain);

    if (sourcesWithDomain.length > 1) {
      throw new Error(`More than one raster source with domain: ${domain}`);
    }
    if (sourcesWithDomain.length === 0) {
      throw new Error(`No raster sources found with domain: ${domain}`);
    }

    return sourcesWithDomain[0];
  }),
);

export const rasterSourceDomainsQueryAtomFamily = atomFamily((domain: string) =>
  atom(async (get) => {
    const { id } = await get(rasterSourceByDomainQueryAtomFamily(domain));

    const { domains } = await apiClient.tiles.tilesGetTileSourceDomains({ sourceId: id });

    return domains;
  }),
);
