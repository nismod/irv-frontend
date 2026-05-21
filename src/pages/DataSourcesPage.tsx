import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ExtLink } from '@/lib/nav';

import { getRasterDataSourceRows } from '@/config/raster-metadata';
import type {
  RasterDataSourceSection,
  RasterDataSourceTableRow,
} from '@/config/raster-metadata-types';

import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleParagraph,
  ArticleSection,
  ArticleSectionHeader,
  EmphasisTextContainer,
  EmphasisTextParagraph,
  MiniBar,
} from './ui/ArticleContainer';
import { BackToTop } from './ui/BackToTop';
import { HeadingBox, HeadingBoxText } from './ui/HeadingBox';
import {
  StyledTableContainer,
  TableCellParagraph,
  TableCellStack,
  TableHeader,
  TableSectionContainer,
} from './ui/TableContainer';

const renderTextParagraphs = (paragraphs: string[]) => {
  if (paragraphs.length <= 1) {
    return paragraphs[0] ?? null;
  }

  return (
    <TableCellStack>
      {paragraphs.map((paragraph, index) => (
        <TableCellParagraph key={index}>{paragraph}</TableCellParagraph>
      ))}
    </TableCellStack>
  );
};

const renderSourceLink = (source: RasterDataSourceTableRow['source']) =>
  source.url ? <ExtLink href={source.url}>{source.label}</ExtLink> : source.label;

const renderLicenseLink = (license: RasterDataSourceTableRow['license']) =>
  license.url ? <ExtLink href={license.url}>{license.label}</ExtLink> : license.label;

const getOrderedDataSourceRows = (section: RasterDataSourceSection, rowIds?: string[]) => {
  const rows = getRasterDataSourceRows(section);
  if (!rowIds) return rows;

  const rowsById = new Map(rows.map((row) => [row.id, row]));
  return rowIds.map((id) => {
    const row = rowsById.get(id);
    if (!row) {
      throw new Error(`Missing raster data source row ${id}`);
    }
    return row;
  });
};

const renderDataSourceRows = (section: RasterDataSourceSection, rowIds?: string[]) =>
  getOrderedDataSourceRows(section, rowIds).map((row) => (
    <TableRow key={row.id}>
      <TableCell>{row.dataset}</TableCell>
      <TableCell>{renderSourceLink(row.source)}</TableCell>
      <TableCell>{renderTextParagraphs(row.citation)}</TableCell>
      <TableCell>{renderLicenseLink(row.license)}</TableCell>
      <TableCell>{renderTextParagraphs(row.notes)}</TableCell>
    </TableRow>
  ));

export const DataSourcesPage = () => (
  <ArticleContainer>
    <HeadingBox>
      <HeadingBoxText>Data Sources</HeadingBoxText>
    </HeadingBox>
    <ArticleContentContainer>
      <ArticleSection>
        <EmphasisTextContainer>
          <MiniBar />
          <EmphasisTextParagraph>
            The GRI Risk Viewer draws on open data sources which are displayed in the maps and
            available for download.
          </EmphasisTextParagraph>
        </EmphasisTextContainer>
        <ArticleParagraph>
          <Link id="contents" href="#contents">
            Contents
          </Link>
        </ArticleParagraph>
        <ArticleParagraph>
          Scroll down the page for details of data sources under each category:
          <ul>
            <li>
              <Link href="#context">Contextual map data</Link>
            </li>
            <li>
              <Link href="#hazard">Hazard</Link>
            </li>
            <li>
              <Link href="#exposure">Exposure</Link>
            </li>
            <li>
              <Link href="#vulnerability">Vulnerability</Link>
            </li>
            <li>
              <Link href="#risk">Risk</Link>
            </li>
          </ul>
        </ArticleParagraph>
      </ArticleSection>

      <BackToTop id="context" />
      <ArticleSection>
        <ArticleSectionHeader>Contextual Map Data</ArticleSectionHeader>

        <ArticleParagraph>
          Background map data is &copy;{' '}
          <ExtLink href="https://www.openstreetmap.org/copyright">OpenStreetMap</ExtLink>{' '}
          contributors, style &copy; <ExtLink href="https://carto.com/attributions">CARTO</ExtLink>.
        </ArticleParagraph>

        <ArticleParagraph>
          Satellite imagery background is derived from{' '}
          <ExtLink href="https://s2maps.eu">Sentinel-2 cloudless - https://s2maps.eu</ExtLink> by{' '}
          <ExtLink href="https://eox.at">EOX IT Services GmbH</ExtLink> (Contains modified
          Copernicus Sentinel data 2020).
        </ArticleParagraph>
      </ArticleSection>

      <BackToTop id="hazard" />
      <TableSectionContainer>
        <TableHeader>Hazard Data</TableHeader>

        <StyledTableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dataset</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Citation</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderDataSourceRows('hazard')}</TableBody>
          </Table>
        </StyledTableContainer>
      </TableSectionContainer>

      <BackToTop id="exposure" />
      <TableSectionContainer>
        <TableHeader>Exposure Data</TableHeader>

        <StyledTableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dataset</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Citation</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Roads and Rail</TableCell>
                <TableCell>
                  <ExtLink href="https://planet.openstreetmap.org/">OpenStreetMap</ExtLink>
                </TableCell>
                <TableCell>
                  <ExtLink href="https://www.openstreetmap.org/copyright">
                    © OpenStreetMap contributors https://www.openstreetmap.org/copyright
                  </ExtLink>
                </TableCell>
                <TableCell>ODbL</TableCell>
                <TableCell>
                  Extract from OpenStreetMap October 2021. All roads tagged as trunk, motorway,
                  primary, secondary or tertiary, all rail lines tagged as rail and railway
                  stations.
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <ExtLink href="https://doi.org/10.5281/zenodo.3628142">
                    Gridfinder Power Transmission lines
                  </ExtLink>
                </TableCell>
                <TableCell>Source</TableCell>
                <TableCell>
                  Arderne, C., Zorn, C., Nicolas, C. et al. Predictive mapping of the global power
                  system using open data. Sci Data 7, 19 (2020).
                  https://doi.org/10.1038/s41597-019-0347-4
                </TableCell>
                <TableCell>CC BY 4.0</TableCell>
                <TableCell>
                  Predicted distribution and transmission line network, with existing OpenStreetMap
                  lines tagged in the 'source' column and © OpenStreetMap contributors
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Power plants</TableCell>
                <TableCell>
                  <ExtLink href="https://datasets.wri.org/dataset/globalpowerplantdatabase">
                    WRI Global Powerplants Database
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm,
                  Enipedia, World Resources Institute. 2018. Global Power Plant Database. Published
                  on Resource Watch and Google Earth Engine; http://resourcewatch.org/
                  https://earthengine.google.com/
                </TableCell>
                <TableCell>CC BY 4.0</TableCell>
                <TableCell>
                  The Global Power Plant Database is a comprehensive, open source database of power
                  plants around the world. It centralizes power plant data to make it easier to
                  navigate, compare and draw insights for one's own analysis. The database covers
                  approximately 35,000 power plants from 167 countries and includes thermal plants
                  (e.g. coal, gas, oil, nuclear, biomass, waste, geothermal) and renewables (e.g.
                  hydro, wind, solar). Each power plant is geolocated and entries contain
                  information on plant capacity, generation, ownership, and fuel type.
                </TableCell>
              </TableRow>

              {renderDataSourceRows('exposure', ['ghsl-population-built-up'])}

              <TableRow>
                <TableCell>Health site locations</TableCell>
                <TableCell>
                  <ExtLink href="http://healthsites.io">healthsites.io</ExtLink>
                </TableCell>
                <TableCell>
                  This data was generated as an extract from the OpenStreetMap global open database
                  (<ExtLink href="http://openstreetmap.org">openstreetmap.org</ExtLink>) by the
                  Healthsites.io (<ExtLink href="http://healthsites.io">healthsites.io</ExtLink>)
                  project. Data:{' '}
                  <ExtLink href="http://opendatacommons.org/licenses/odbl/">
                    Open Database License
                  </ExtLink>{' '}
                  Data credits: ©{' '}
                  <ExtLink href="http://www.openstreetmap.org/copyright">
                    OpenStreetMap contributors
                  </ExtLink>
                </TableCell>
                <TableCell>ODbL</TableCell>
                <TableCell>Health site locations as points/polygons</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Cement and Steel Production Assets</TableCell>
                <TableCell>
                  <ExtLink href="https://www.cgfi.ac.uk/spatial-finance-initiative/database-downloads/">
                    Global Databases of Cement and Iron and Steel Production Assets, Spatial Finance
                    Initiative
                  </ExtLink>
                </TableCell>
                <TableCell>
                  <TableCellStack>
                    <TableCellParagraph>
                      McCarten, M., Bayaraa, M., Caldecott, B., Christiaen, C., Foster, P., Hickey,
                      C., Kampmann, D., Layman, C., Rossi, C., Scott, K., Tang, K., Tkachenko, N.,
                      and Yoken, D. 2021. Global Database of Cement Production Assets. Spatial
                      Finance Initiative.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      McCarten, M., Bayaraa, M., Caldecott, B., Christiaen, C., Foster, P., Hickey,
                      C., Kampmann, D., Layman, C., Rossi, C., Scott, K., Tang, K., Tkachenko, N.,
                      and Yoken, D., 2021. Global Database of Iron and Steel Production Assets.
                      Spatial Finance Initiative
                    </TableCellParagraph>
                  </TableCellStack>
                </TableCell>
                <TableCell>CC BY 4.0</TableCell>
                <TableCell>Cement and Steel Asset site locations as points</TableCell>
              </TableRow>

              {renderDataSourceRows('exposure', [
                'esa-cci-land-cover',
                'global-dem-derivatives-merit-dem',
                'soilgrids-organic-carbon',
              ])}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </TableSectionContainer>

      <BackToTop id="vulnerability" />
      <TableSectionContainer>
        <TableHeader>Vulnerability Data</TableHeader>

        <StyledTableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dataset</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Citation</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Access to Healthcare</TableCell>
                <TableCell>
                  <ExtLink href="https://www.nature.com/articles/s41591-020-1059-1">
                    Global maps of travel time to healthcare facilities
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Weiss, D.J., Nelson, A., Vargas-Ruiz, C.A. et al. Global maps of travel time to
                  healthcare facilities. Nat Med 26, 1835–1838 (2020). DOI:{' '}
                  <ExtLink href="https://doi.org/10.1038/s41591-020-1059-1">
                    10.1038/s41591-020-1059-1
                  </ExtLink>
                </TableCell>
                <TableCell>CC BY 4.0</TableCell>
                <TableCell>Motorised/non-motorised travel time on 30arcsec grid.</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Human Development (Subnational)</TableCell>
                <TableCell>
                  <ExtLink href="https://globaldatalab.org/shdi/">
                    Global Data Lab Sub-national human development indices
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Global Data Lab (2019) Subnational Human Development Index (SHDI) Available
                  online:{' '}
                  <ExtLink href="https://globaldatalab.org/shdi/">globaldatalab.org/shdi</ExtLink>.
                </TableCell>
                <TableCell>
                  Free for use with acknowledgement of data source:{' '}
                  <ExtLink href="https://globaldatalab.org/termsofuse/">
                    globaldatalab.org/termsofuse
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>
                  <TableCellStack>
                    <TableCellParagraph>
                      Development, Health, Education and Income indices for 186 countries, 1783
                      sub-national regions.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      The SHDI is an average of the subnational values of three dimensions:
                      education, health and standard of living. To compute the SHDI on the basis of
                      the three dimension indices, the geometric mean of the three indices is taken.
                      Three major data sources were used to create the SHDI database: statistical
                      offices (including Eurostat, the statistical office of the European Union),
                      the Area Database of the Global Data Lab, and data from the HDI website of the
                      Human Development Report Office of the United Nations Development Program.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      Given that household surveys and censuses are not held every year, for many
                      countries the indicators are only available for a restricted number of years.
                      To obtain their values for the whole period 1990&ndash;2017, the missing
                      information was estimated by interpolation or extrapolation techniques. This
                      estimation process was facilitated by the fact that the UNDP Database contains
                      the national values for all four indicators for each year in this period,
                      which means that only the subnational variation had to be interpolated or
                      extrapolated. For a complete list of sources and surveys used, please refer to
                      the Area Database's Data Sources page.
                    </TableCellParagraph>
                  </TableCellStack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Human Development (Grid)</TableCell>
                <TableCell>
                  <ExtLink href="https://www.mosaiks.org/hdi">
                    Global High-Resolution Estimates of the United Nations Human Development Index
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Sherman, L., et al. 2023. Global High-Resolution Estimates of the United Nations
                  Human Development Index Using Satellite Imagery and Machine-learning. Working
                  Paper Series. 31044. National Bureau of Economic Research. DOI:{' '}
                  <ExtLink href="https://doi.org/10.3386/w31044">10.3386/w31044</ExtLink>. Available
                  online:{' '}
                  <ExtLink href="http://www.nber.org/papers/w31044">
                    www.nber.org/papers/w31044
                  </ExtLink>
                  . Data available at:{' '}
                  <ExtLink href="https://github.com/Global-Policy-Lab/hdi_downscaling_mosaiks">
                    github.com/Global-Policy-Lab/hdi_downscaling_mosaiks
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>MIT</TableCell>
                <TableCell>
                  Global estimates of United Nations Human Development Index (HDI) on a global 0.1
                  degree grid. Developed using a generalizable machine learning downscaling
                  technique based on satellite imagery that allows for training and prediction with
                  observations of arbitrary shape and size. This downscales the national HDI, which
                  is a multi-dimensional index used for measuring national development,
                  incorporating measures of income, education and health.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Relative Wealth Index</TableCell>
                <TableCell>
                  <ExtLink href="https://dataforgood.facebook.com/dfg/tools/relative-wealth-index">
                    Meta Relative Wealth Index
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Chi, G., et al. 2022. Microestimates of wealth for all low- and middle-income
                  countries. Proceedings of the National Academy of Sciences Jan 2022, 119 (3)
                  e2113658119; DOI:{' '}
                  <ExtLink href="https://doi.org/10.1073/pnas.2113658119">
                    10.1073/pnas.2113658119
                  </ExtLink>
                  . Data available at:{' '}
                  <ExtLink href="https://data.humdata.org/dataset/relative-wealth-index">
                    data.humdata.org/dataset/relative-wealth-index
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>CC-BY-NC 4.0</TableCell>
                <TableCell>
                  The Relative Wealth Index predicts the relative standard of living within
                  countries using privacy protecting connectivity data, satellite imagery, and other
                  novel data sources.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Biodiversity</TableCell>
                <TableCell>
                  <ExtLink href="https://data.nhm.ac.uk/dataset/global-map-of-the-biodiversity-intactness-index-from-newbold-et-al-2016-science/resource/8531b4dc-bd44-4586-8216-47b3b8d60e85">
                    Biodiversity Intactness Index
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Tim Newbold; Lawrence Hudson; Andy Arnell; Sara Contu et al. (2016). Map of
                  Biodiversity Intactness Index (from Global map of the Biodiversity Intactness
                  Index, from Newbold et al. (2016) Science) [Data set resource]. Natural History
                  Museum. Available online at:{' '}
                  <ExtLink href="https://data.nhm.ac.uk/dataset/global-map-of-the-biodiversity-intactness-index-from-newbold-et-al-2016-science/resource/8531b4dc-bd44-4586-8216-47b3b8d60e85">
                    data.nhm.ac.uk
                  </ExtLink>
                </TableCell>
                <TableCell>CC BY 4.0</TableCell>
                <TableCell>3 arcsec grid</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Protected Areas</TableCell>
                <TableCell>
                  <ExtLink href="https://www.protectedplanet.net/en/thematic-areas/wdpa?tab=WDPA">
                    World Database of Protected Areas
                  </ExtLink>
                </TableCell>
                <TableCell>
                  UNEP-WCMC and IUCN (2022), Protected Planet: The World Database on Protected Areas
                  (WDPA) [On-line], [October 2022], Cambridge, UK: UNEP-WCMC and IUCN. Available
                  online:{' '}
                  <ExtLink href="https://www.protectedplanet.net/en/thematic-areas/wdpa?tab=WDPA">
                    www.protectedplanet.net
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>
                  No Commercial Use, No Reposting and/or Redistribution without written consent
                </TableCell>
                <TableCell>Protected area locations as points/polygons</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Forest Integrity</TableCell>
                <TableCell>
                  <ExtLink href="https://www.nature.com/articles/s41467-020-19493-3">
                    Forest Landscape Integrity Index
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Grantham, H.S., Duncan, A., Evans, T.D. et al. Anthropogenic modification of
                  forests means only 40% of remaining forests have high ecosystem integrity. Nat
                  Commun 11, 5978 (2020). DOI:{' '}
                  <ExtLink href="https://doi.org/10.1038/s41467-020-19493-3">
                    10.1038/s41467-020-19493-3
                  </ExtLink>
                </TableCell>
                <TableCell>Published as available with article (license not specified)</TableCell>
                <TableCell>
                  10 arcsec grid. Data are available at www.forestlandscapeintegrity.com. The
                  datasets used to develop the Forest Landscape Integrity Index can be found at the
                  following websites:{' '}
                  <ExtLink href="http://earthenginepartners.appspot.com/science-2013-global-forest">
                    tree cover and loss
                  </ExtLink>
                  ,{' '}
                  <ExtLink href="https://data.globalforestwatch.org/datasets/f2b7de1bdde04f7a9034ecb363d71f0e">
                    tree cover loss driver
                  </ExtLink>
                  ,{' '}
                  <ExtLink href="https://data.globalforestwatch.org/datasets/potential-forest-coverage">
                    potential forest cover
                  </ExtLink>
                  ,{' '}
                  <ExtLink href="https://maps.elie.ucl.ac.be/CCI/viewer/index.php">
                    ESA-CCI Land Cover
                  </ExtLink>
                  , <ExtLink href="https://www.openstreetmap.org">Open Street Maps</ExtLink>,{' '}
                  <ExtLink href="https://lpdaac.usgs.gov/news/release-of-gfsad-30-meter-cropland-extent-products/">
                    croplands
                  </ExtLink>
                  ,{' '}
                  <ExtLink href="https://global-surface-water.appspot.com/">surface water</ExtLink>,{' '}
                  <ExtLink href="https://www.protectedplanet.net/en">protected areas</ExtLink>.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </TableSectionContainer>

      <BackToTop id="risk" />
      <TableSectionContainer>
        <TableHeader>Risk Data</TableHeader>

        <StyledTableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dataset</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Citation</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderDataSourceRows('risk')}
              <TableRow>
                <TableCell>Population Exposure</TableCell>
                <TableCell>Derived from ISIMIP hazards and GHSL population</TableCell>
                <TableCell>
                  Russell, T., Nicholas, C., & Bernhofen, M. (2024). Annual probability of extreme
                  heat and drought events, derived from Lange et al 2020 [Data set]. Zenodo.{' '}
                  <ExtLink href="https://doi.org/10.5281/zenodo.11582369">
                    10.5281/zenodo.11582369
                  </ExtLink>{' '}
                  Derived using{' '}
                  <ExtLink href="https://github.com/nismod/isimip-exposure">
                    github.com/nismod/isimip-exposure
                  </ExtLink>
                </TableCell>
                <TableCell>CC BY-SA 4.0 International</TableCell>
                <TableCell>
                  Population exposure is calculated as annual expected population directly exposed
                  to the occurrence of extreme heat or drought events, assuming any population
                  directly within the footprint of an event is exposed, but not otherwise taking any
                  other risk-mitigating or -propagating factors into account.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Infrastructure Risk</TableCell>
                <TableCell>Derived from exposure and hazard layers</TableCell>
                <TableCell>
                  Russell T., Thomas F., nismod/open-gira contributors and OpenStreetMap
                  contributors (2022) Global Infrastructure Damage Risk Estimates. [Dataset]
                  Available at https://global.infrastructureresilience.org
                </TableCell>
                <TableCell>CC-BY-SA, ODbL</TableCell>
                <TableCell>
                  Infrastructure expected annual direct damages are calculated from OpenStreetMap
                  and Gridfinder networks, STORM cyclones and Aqueduct floods.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Regional Summary</TableCell>
                <TableCell>Derived from exposure and hazard layers</TableCell>
                <TableCell>
                  GEM (2022) Analysis of earthquake and flooding population exposure
                </TableCell>
                <TableCell>CC-BY-SA</TableCell>
                <TableCell>Population exposed to various hazards at return periods.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </TableSectionContainer>
    </ArticleContentContainer>
  </ArticleContainer>
);
