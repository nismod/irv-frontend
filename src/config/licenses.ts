export const LICENSES = [
  {
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    shortname: 'CC0 1.0',
    longname: 'Creative Commons CC0 1.0 Universal',
  },
  {
    url: 'https://creativecommons.org/licenses/by/4.0/',
    shortname: 'CC BY 4.0',
    longname: 'Creative Commons Attribution 4.0 International',
  },
  {
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    shortname: 'CC BY-SA 4.0',
    longname: 'Creative Commons Attribution-ShareAlike 4.0 International',
  },
  {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    shortname: 'CC BY-NC 4.0',
    longname: 'Creative Commons Attribution-NonCommercial 4.0 International',
  },
  {
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    shortname: 'CC BY-NC-SA 4.0',
    longname: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International',
  },
  {
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
    shortname: 'CC BY-ND 4.0',
    longname: 'Creative Commons Attribution-NoDerivatives 4.0 International',
  },
  {
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    shortname: 'CC BY-NC-ND 4.0',
    longname: 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International',
  },
  {
    url: 'https://opendatacommons.org/licenses/odbl/1-0/',
    shortname: 'ODbL 1.0',
    longname: 'Open Data Commons Open Database License v1.0',
  },
  {
    url: 'https://opendatacommons.org/licenses/by/1-0/',
    shortname: 'ODC-By 1.0',
    longname: 'Open Data Commons Attribution License v1.0',
  },
  {
    url: 'http://opendatacommons.org/licenses/pddl/1.0/',
    shortname: 'ODC PDDL 1.0',
    longname: 'Open Data Commons Public Domain Dedication and License v1.0',
  },
  {
    url: 'https://www.protectedplanet.net/en/legal',
    shortname: 'WDPCA Terms',
    longname: 'No Commercial Use, No Reposting and/or Redistribution without written consent',
  },
  {
    url: 'https://www.forestlandscapeintegrity.com/download-data',
    shortname: 'None specified',
    longname: 'Published as available with article (license not specified)',
  },
  {
    url: 'https://globaldatalab.org/termsofuse',
    shortname: 'GDL NC-BY',
    longname: 'Free for non-commercial use with acknowledgment',
  },
  {
    url: 'https://spdx.org/licenses/MIT',
    shortname: 'MIT',
    longname: 'MIT License',
  },
  {
    url: 'https://cds.climate.copernicus.eu/licences/satellite-land-cover',
    shortname: 'ESA CCI',
    longname: 'ESA Climate Change Initiative Land Cover Terms',
  },
  {
    url: 'https://global.infrastructureresilience.org/terms-of-use',
    shortname: 'CC BY-SA / ODbL',
    longname: 'Creative Commons Attribution-ShareAlike and Open Database License terms',
  },
] as const;

export type License = (typeof LICENSES)[number];

export const getLicenseByUrl = (url: string): License | undefined =>
  LICENSES.find((license) => license.url === url);

export const getLicenseByShortname = (shortname: string): License | undefined =>
  LICENSES.find((license) => license.shortname === shortname);
