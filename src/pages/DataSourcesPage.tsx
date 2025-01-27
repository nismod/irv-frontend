import { Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { ExtLink } from '@/lib/nav';

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
            <TableBody>
              <TableRow>
                <TableCell>Coastal and River flooding</TableCell>
                <TableCell>
                  <ExtLink href="https://www.wri.org/data/aqueduct-floods-hazard-maps">
                    WRI Aqueduct Floods Hazard Maps
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A.
                  Díaz Loaiza, et al. 2020. “Aqueduct Floods Methodology.” Technical Note.
                  Washington, D.C.: World Resources Institute. Available online at:{' '}
                  <ExtLink href="https://www.wri.org/publication/aqueduct-floods-methodology">
                    www.wri.org/publication/aqueduct-floods-methodology
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>
                  All the products, methodologies, and datasets that make up Aqueduct are available
                  for use under the{' '}
                  <ExtLink href="https://creativecommons.org/licenses/by/4.0/">
                    Creative Commons Attribution International 4.0 License
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>
                  Inundation depth in meters for coastal and riverine floods over 1km grid squares.
                  1 in 2 to 1 in 1000 year return periods. Baseline, RCP 4.5 &amp; 8.5 emission
                  scenarios. Current and future maps in 2030, 2050 and 2080.
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>River flooding</TableCell>
                <TableCell>
                  <ExtLink href="data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif">
                    JRC Global River Flood Hazard Maps
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Baugh, Calum; Colonese, Juan; D'Angelo, Claudia; Dottori, Francesco; Neal,
                  Jeffrey; Prudhomme, Christel; Salamon, Peter (2024): Global river flood hazard
                  maps. European Commission, Joint Research Centre (JRC) [Dataset] Available online
                  at:
                  <ExtLink href="http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif">
                    data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>
                  <ExtLink href="http://creativecommons.org/licenses/by/4.0/legalcode">
                    Creative Commons Attribution 4.0 International
                  </ExtLink>
                </TableCell>
                <TableCell>
                  <TableCellParagraph>
                    The global river flood hazard maps are a gridded data set representing
                    inundation along the river network, for seven different flood return periods
                    (from 1-in-10-years to 1-in-500-years). The input river flow data for the new
                    maps are produced by means of the open-source hydrological model LISFLOOD, while
                    inundation simulations are performed with the hydrodynamic model LISFLOOD-FP.
                    The extent comprises the entire world with the exception of Greenland and
                    Antarctica and small islands with river basins smaller than 500km².
                  </TableCellParagraph>
                  <TableCellParagraph>
                    Cell values indicate water depth (in m). The maps can be used to assess the
                    exposure of population and economic assets to river floods, and to perform flood
                    risk assessments. The dataset is created as part of the Copernicus Emergency
                    Management Service. NOTE: this dataset is not an official flood hazard map (for
                    details and limitations please refer to related publications).
                  </TableCellParagraph>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Extreme Heat and Drought</TableCell>
                <TableCell>
                  <ExtLink href="https://data.isimip.org/search/tree/ISIMIP2b/DerivedOutputData/lange2020/">
                    Lange et al 2020, ISIMIP
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Lange, S., Volkholz, J., Geiger, T., Zhao, F., Vega, I., Veldkamp, T., et al.
                  (2020). Projecting exposure to extreme climate impact events across six event
                  categories and three spatial scales. Earth's Future, 8, e2020EF001616.{' '}
                  <ExtLink href="https://doi.org/10.1029/2020EF001616">
                    DOI 10.1029/2020EF001616
                  </ExtLink>
                </TableCell>
                <TableCell>CC0 1.0</TableCell>
                <TableCell>
                  <TableCellStack>
                    <TableCellParagraph>
                      Annual probability of drought (soil moisture below a baseline threshold) or
                      extreme heat (temperature and humidity-based indicators over a threshold)
                      events on a 0.5° grid. 8 hydrological models forced by 4 GCMs under baseline,
                      RCP 2.6 &amp; 6.0 emission scenarios. Current and future maps in 2030, 2050
                      and 2080.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      The ISIMIP2b climate input data and impact model output data analyzed in this
                      study are available in the ISIMIP data repository at ESGF, see
                      https://esg.pik-potsdam.de/search/isimip/?project=ISIMIP2b&product=input and
                      https://esg.pik-potsdam.de/search/isimip/?project=ISIMIP2b&product=output,
                      respectively. More information about the GHM, GGCM, and GVM output data is
                      provided by Gosling et al. (2020), Arneth et al. (2020), and Reyer et al.
                      (2019), respectively.{' '}
                    </TableCellParagraph>
                    <TableCellParagraph>
                      Event definitions are given in Lange et al, table 1. Land area is exposed to
                      drought if monthly soil moisture falls below the 2.5th percentile of the
                      preindustrial baseline distribution for at least seven consecutive months.
                      Land area is exposed to extreme heat if both a relative indicator based on
                      temperature (Russo et al 2015, 2017) and an absolute indicator based on
                      temperature and relative humidity (Masterton &amp; Richardson, 1979) exceed
                      their respective threshold value.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      Note that the time series of extreme events given by Lange et al has been
                      processed into an annual probability of occurrence by the GRI team for
                      visualisation purposes.
                    </TableCellParagraph>
                  </TableCellStack>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tropical Cyclones (STORM)</TableCell>
                <TableCell>
                  STORM Tropical Cyclone Maximum Windspeeds,{' '}
                  <ExtLink href="https://data.4tu.nl/articles/dataset/STORM_tropical_cyclone_wind_speed_return_periods/12705164/3">
                    Present{' '}
                  </ExtLink>
                  {' and '}{' '}
                  <ExtLink href="https://data.4tu.nl/articles/dataset/STORM_climate_change_tropical_cyclone_wind_speed_return_periods/14510817/3">
                    Future climate{' '}
                  </ExtLink>
                  .
                </TableCell>
                <TableCell>
                  Bloemendaal, Nadia; de Moel, H. (Hans); Muis, S; Haigh, I.D. (Ivan); Aerts,
                  J.C.J.H. (Jeroen) (2020): STORM tropical cyclone wind speed return periods.
                  4TU.ResearchData. Dataset.{' '}
                  <ExtLink href="https://doi.org/10.4121/12705164.v3">
                    DOI 10.4121/12705164.v3
                  </ExtLink>{' '}
                  and Bloemendaal, Nadia; de Moel, Hans; Dullaart, Job; Haarsma, R.J. (Reindert);
                  Haigh, I.D. (Ivan); Martinez, Andrew B.; et al. (2022): STORM climate change
                  tropical cyclone wind speed return periods. 4TU.ResearchData. Dataset.{' '}
                  <ExtLink href="https://doi.org/10.4121/14510817.v3">
                    DOI 10.4121/14510817.v3
                  </ExtLink>
                </TableCell>
                <TableCell>CC0 1.0</TableCell>
                <TableCell>
                  Tropical cyclone maximum wind speed (in m/s) return periods, generated using the
                  STORM climate change datasets. 1 in 10 to 1 in 10,000 year return periods at 10 km
                  resolution. Baseline and RCP 8.5 climate scenarios. Current and future (2050)
                  epochs.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tropical Cyclones (IRIS)</TableCell>
                <TableCell>
                  <ExtLink href="https://www.imperial.ac.uk/grantham/research/climate-science/modelling-tropical-cyclones/">
                    IRIS tropical cyclone model
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset.
                  Scientific Data 11, 424{' '}
                  <ExtLink href="https://doi.org/10.1038/s41597-024-03250-y">
                    DOI 10.1038/s41597-024-03250-y
                  </ExtLink>{' '}
                  and Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model.
                  Figshare. Collection.{' '}
                  <ExtLink href="https://doi.org/10.6084/m9.figshare.c.6724251.v1">
                    DOI 10.6084/m9.figshare.c.6724251.v1
                  </ExtLink>
                </TableCell>
                <TableCell>CC BY 4.0</TableCell>
                <TableCell>
                  Tropical cyclone maximum wind speeds (in m/s) generated using the IRIS tropical
                  cyclone model. Wind speeds available from 1 in 10 to 1 in 1,000 year return
                  periods at 1/10 degree spatial resolution. Present (2020) and future (2050)
                  epochs, with SSP1-2.6, SSP2-4.5 and SSP5-8.5 future scenarios. Return period maps
                  generated from an earlier version of the IRIS model event set.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Seismic Risk</TableCell>
                <TableCell>
                  <ExtLink href="https://www.globalquakemodel.org/gem-maps/global-earthquake-hazard-map">
                    GEM Global Earthquake Hazard Map
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Pagani M, Garcia-Pelaez J, Gee R, Johnson K, Silva V, Simionato M, Styron R,
                  Vigano D, Danciu L, Monelli D, Poggi V, Weatherill G. (2019). The 2018 version of
                  the Global Earthquake Model: Hazard component. Earthquake Spectra, 36(1),{' '}
                  <ExtLink href="https://doi.org/10.1177/8755293020931866">
                    DOI: 10.1177/8755293020931866
                  </ExtLink>
                  . and Johnson, K., Villani, M., Bayliss, K., Brooks, C., Chandrasekhar, S.,
                  Chartier, T., Chen, Y.-S., Garcia-Pelaez, J., Gee, R., Styron, R., Rood, A.,
                  Simionato, M., & Pagani, M. (2023). Global Seismic Hazard Map (v2023.1.0) [Data
                  set]. Zenodo.{' '}
                  <ExtLink href="https://doi.org/10.5281/zenodo.8409647">
                    DOI 10.5281/zenodo.8409647
                  </ExtLink>
                </TableCell>
                <TableCell>
                  <ExtLink href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
                    Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
                    (CC BY-NC-SA){' '}
                  </ExtLink>
                </TableCell>
                <TableCell>
                  The Global Earthquake Model (GEM) Global Seismic Hazard Map (version 2023.1)
                  depicts the geographic distribution of the Peak Ground Acceleration (PGA) with a
                  10% probability of being exceeded in 50 years, computed for reference rock
                  conditions (shear wave velocity, VS30, of 760-800 m/s).
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Landslide</TableCell>
                <TableCell>
                  <ExtLink href="https://datacatalog.worldbank.org/search/dataset/0037584/Global-landslide-hazard-map">
                    Global Landslide Hazard Map
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Arup (2021) Global Landslide Hazard Map, prepared for The World Bank and Global
                  Facility for Disaster Risk Reduction.
                </TableCell>
                <TableCell>
                  <ExtLink href="https://creativecommons.org/licenses/by-nc/4.0/">
                    Creative Commons Attribution-NonCommercial 4.0 International License (CC
                    BY-NC-SA){' '}
                  </ExtLink>
                </TableCell>
                <TableCell>
                  <TableCellStack>
                    <TableCellParagraph>
                      The Global Landslide hazard map is a gridded dataset of landslide hazard
                      produced at the global scale. The dataset comprises gridded maps of estimated
                      annual frequency of significant landslides per square kilometre. Significant
                      landslides are those which are likely to have been reported had they occurred
                      in a populated place; limited information on reported landslide size makes it
                      difficult to tie frequencies to size ranges but broadly speaking would be at
                      least greater than 100 m2. The data provides frequency estimates for each grid
                      cell on land between 60°S and 72°N for landslides triggered by seismicity and
                      rainfall.
                    </TableCellParagraph>

                    <TableCellParagraph>
                      The dataset is publicly available for download and use and it consists of 4
                      global map layers:
                      <ul>
                        <li>
                          Mean annual rainfall-triggered landslide hazard (1980&mdash;2018): raster
                          values represent the modelled average annual frequency of significant
                          rainfall-triggered landslides per sq. km.
                        </li>
                        <li>
                          Median annual rainfall-triggered landslide hazard (1980&mdash;2018):
                          raster values represent the modelled median annual frequency of
                          significant rainfall-triggered landslides per sq. km.
                        </li>
                        <li>
                          Mean annual earthquake-triggered landslide hazard: raster values represent
                          the modelled average annual frequency of significant earthquake-triggered
                          landslides per sq. km.
                        </li>
                        <li>Aggregate hazard index ranging from 1 (low) to 4 (very high)</li>
                      </ul>
                    </TableCellParagraph>
                  </TableCellStack>
                </TableCell>
              </TableRow>
            </TableBody>
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

              <TableRow>
                <TableCell>Population and built-up area</TableCell>
                <TableCell>JRC Global Human Settlement Layer</TableCell>
                <TableCell>
                  <TableCellStack>
                    <TableCellParagraph>
                      Schiavina, Marcello; Freire, Sergio; Alessandra Carioli; MacManus, Kytt
                      (2023): GHS-POP R2023A - GHS population grid multitemporal (1975-2030).
                      European Commission, Joint Research Centre (JRC) [Dataset] doi:
                      10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE PID:
                      http://data.europa.eu/89h/2ff68a52-5b5b-4a22-8f40-c41da8332cfe
                    </TableCellParagraph>
                    <TableCellParagraph>
                      Pesaresi, Martino; Politis, Panagiotis (2023): GHS-BUILT-S R2023A - GHS
                      built-up surface grid, derived from Sentinel2 composite and Landsat,
                      multitemporal (1975-2030). European Commission, Joint Research Centre (JRC)
                      [Dataset] doi: 10.2905/9F06F36F-4B11-47EC-ABB0-4F8B7B1D72EA PID:
                      http://data.europa.eu/89h/9f06f36f-4b11-47ec-abb0-4f8b7b1d72ea
                    </TableCellParagraph>
                    <TableCellParagraph>
                      Schiavina, M., Melchiorri, M., Pesaresi, M., Politis, P., Carneiro Freire,
                      S.M., Maffenini, L., Florio, P., Ehrlich, D., Goch, K., Carioli, A., Uhl, J.,
                      Tommasi, P. and Kemper, T., GHSL Data Package 2023, Publications Office of the
                      European Union, Luxembourg, 2023, ISBN 978-92-68-02341-9, doi:10.2760/098587,
                      JRC133256.
                    </TableCellParagraph>
                  </TableCellStack>
                </TableCell>
                <TableCell>
                  <ExtLink href="https://ec.europa.eu/info/legal-notice_en#copyright-notice">
                    CC-BY 4.0
                  </ExtLink>
                </TableCell>
                <TableCell>
                  <TableCellStack>
                    <TableCellParagraph>
                      GHS-POP R2023A - The spatial raster dataset depicts the distribution of
                      population, expressed as the number of people per cell. Residential population
                      estimates between 1975 and 2020 in 5 years intervals and projections to 2025
                      and 2030 derived from CIESIN GPWv4.11 were disaggregated from census or
                      administrative units to grid cells, informed by the distribution, density, and
                      classification of built-up as mapped in the Global Human Settlement Layer
                      (GHSL) global layer per corresponding epoch.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      This dataset is an update of the product released in 2022. Major improvements
                      are the following: use of built-up volume maps (GHS-BUILT-V R2022A); use of
                      more recent and detailed population estimates derived from GPWv4.11
                      integrating both UN World Population Prospects 2022 country population data
                      and World Urbanisation Prospects 2018 data on Cities; revision of GPWv4.11
                      population growthrates by convergence to upper administrative level
                      growthrates; systematic improvement of census coastlines; systematic revision
                      of census units declared as unpopulated; integration of non-residential
                      built-up volume information (GHS-BUILT-V_NRES R2023A); spatial resolution of
                      100m Mollweide (and 3 arcseconds in WGS84); projections to 2030.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      GHS-BUILT-S R2023A - The spatial raster dataset depicts the distribution of
                      the built-up (BU) surfaces estimates between 1975 and 2030 in 5 years
                      intervals and two functional use components a) the total BU surface and b) the
                      non-residential (NRES) BU surface. The data is made by spatial-temporal
                      interpolation of five observed collections of multiple-sensor,
                      multiple-platform satellite imageries. Landsat (MSS, TM, ETM sensor) supports
                      the 1975, 1990, 2000, and 2014 epochs. Sentinel2 (S2) composite
                      (GHS-composite-S2 R2020A) supports the 2018 epoch.
                    </TableCellParagraph>
                    <TableCellParagraph>
                      The built-up surface fraction (BUFRAC) is estimated at 10m of spatial
                      resolution from the S2 image data, using as learning set a composite of data
                      from GHS-BUILT-S2 R2020A, Facebook, Microsoft, and Open Street Map (OSM)
                      building delineation. The BUFRAC inference is made from the combination of
                      quantized image features (reflectance, derivative of morphological profile
                      DMP) through associative rule learning applied to spatial data analytics,
                      which was introduced as symbolic machine learning (SML).
                    </TableCellParagraph>
                    <TableCellParagraph>
                      The non-residential (NRES) domain is predicted from S2 image data by
                      observation of radiometric, textural, and morphological features in an
                      object-oriented image processing framework. The multi-temporal dimension is
                      provided by testing by the SML the association between the combination of the
                      quantized radiometric information collected by the Landsat imagery in the past
                      epochs, and the “built-up” (BU) and “non-built-up” (NBU) class abstraction on
                      image segments extracted from S2 images. The spatial-temporal interpolation is
                      solved by rank-optimal spatial allocation using explanatory variables related
                      to the landscape (slope, elevation, distance to water, and distance to
                      vegetation) and related to the observed dynamic of BU surfaces in the past
                      epochs.
                    </TableCellParagraph>
                  </TableCellStack>
                </TableCell>
              </TableRow>

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

              <TableRow>
                <TableCell>Land Cover</TableCell>
                <TableCell>
                  <ExtLink href="https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-land-cover?tab=overview">
                    ESA Land cover classification{' '}
                  </ExtLink>
                </TableCell>
                <TableCell>
                  European Space Agency Climate Change Initiative Land Cover project (2021) Land
                  cover classification gridded maps from 1992 to present derived from satellite
                  observations, v2.1.1. https://doi.org/10.24381/cds.006f2c9a
                </TableCell>
                <TableCell>ESA CCI</TableCell>
                <TableCell>
                  The source of these data are the ESA Climate Change Initiative and in particular
                  its Land Cover project © ESA Climate Change Initiative Land Cover led by
                  UCLouvain (2017), ESA Climate Change Initiative &ndash; Land Cover project 2020
                  and EC C3S Land Cover.
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Topography</TableCell>
                <TableCell>
                  <ExtLink href="https://doi.org/10.5281/zenodo.1447210">
                    Global DEM derivatives based on MERIT DEM
                  </ExtLink>
                </TableCell>
                <TableCell>
                  Tomislav Hengl. (2018). Global DEM derivatives at 250m, 1 km and 2 km based on the
                  MERIT DEM (1.0) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.1447210
                </TableCell>
                <TableCell>CC-BY-SA 4.0</TableCell>
                <TableCell>
                  DEM derivatives computed using SAGA GIS at 250m and using MERIT DEM (Yamazaki et
                  al., 2017) as input. Antarctica is not included. MERIT DEM was first reprojected
                  to 6 global tiles based on the Equi7 grid system (Bauer-Marschallinger et al.
                  2014) and then these were used to derive all DEM derivatives. To access original
                  DEM tiles please refer to the{' '}
                  <ExtLink href="http://hydro.iis.u-tokyo.ac.jp/~yamadai/MERIT_DEM/">
                    MERIT DEM download page
                  </ExtLink>
                  .
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Soil Organic Carbon stock</TableCell>
                <TableCell>
                  <ExtLink href="https://soilgrids.org/">SoilGrids 2.0</ExtLink>
                </TableCell>
                <TableCell>
                  Poggio, L., de Sousa, L.M., Batjes, N.H., Heuvelink, G.B.M., Kempen, B., Ribeiro,
                  E., Rossiter, D., 2021. SoilGrids 2.0: producing soil information for the globe
                  with quantified spatial uncertainty. SOIL 7, 217–240.
                  https://doi.org/10.5194/soil-7-217-2021
                </TableCell>
                <TableCell>CC-BY 4.0</TableCell>
                <TableCell>
                  Soil organic carbon content at 0-30cm, in tonnes/hectare, aggregated to 1000m
                  grid. Soil organic carbon content (fine earth fraction) in dg/kg at 6 standard
                  depths. Predictions were derived using a digital soil mapping approach based on
                  Quantile Random Forest, drawing on a global compilation of soil profile data and
                  environmental layers. This map is the result of resampling the mean SoilGrids 250
                  m predictions (Poggio et al. 2021) for each 1000 m cell.
                </TableCell>
              </TableRow>
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
              <TableRow>
                <TableCell>Cooling demand</TableCell>
                <TableCell>
                  Global CDD difference between 1.5°C and 2°C global warming scenarios.
                </TableCell>
                <TableCell>
                  <TableCellStack>
                    <TableCellParagraph>
                      Miranda, N.D., Lizana, J., Sparrow, S.N. et al. (2023) Change in cooling
                      degree days with global mean temperature rise increasing from 1.5°C to 2.0°C.
                      Nature Sustainability 6, 1326-1330.{' '}
                      <ExtLink href="https://doi.org/10.1038/s41893-023-01155-z">
                        DOI 10.1038/s41893-023-01155-z
                      </ExtLink>
                    </TableCellParagraph>
                    <TableCellParagraph>
                      Miranda, N. D., Lizana, J., Sparrow, S. N., Wallom, D. C. H., Zachau-Walker,
                      M., Watson, P., Khosla, R., & McCulloch, M. (2023). Changes in Cooling Degree
                      Days (CDD) between the 1.5°C and 2.0°C global warming scenarios. University of
                      Oxford.{' '}
                      <ExtLink href="https://ora.ox.ac.uk/objects/uuid:8d95c423-816c-4a4f-88b6-eb7a040cb40e">
                        https://ora.ox.ac.uk/objects/uuid:8d95c423-816c-4a4f-88b6-eb7a040cb40e
                      </ExtLink>
                    </TableCellParagraph>
                  </TableCellStack>
                </TableCell>
                <TableCell>CC-BY</TableCell>
                <TableCell>
                  Absolute and relative mean increase of cooling degree days (CDDs) from 1.5°C to
                  2°C global warming scenarios. Additionally, the standard deviation is provided.
                  The data has a horizontal resolution of 0.833 longitude and 0.556 latitude over
                  the land surface. These annual CDDs and standard deviation globally were
                  calculated using an ensemble of 700 simulations per climate change scenario.
                  Cooling degree days (CDDS) were calculated for the ensemble members using the
                  temperature threshold of 18°C. Then, annual mean CDDs and standard deviation per
                  coordinate across ensemble members were obtained for the 1.5°C and 2°C scenarios.
                  Finally, absolute and relative differences between 1.5°C and 2°C were computed.
                  The climate data, involving 700 simulations per scenario, was generated using the
                  HadAM4P Atmosphere-only General Circulation Model (AGCM) from the UK Met Office
                  Hadley Centre. Three scenarios were generated: historical (2006-16), 1.5°C and
                  2°C. The simulation outputs were mean temperatures with a 6-hour timestep and a
                  horizontal resolution of 0.833 longitude and 0.556 latitude. Simulations took
                  place within climateprediction.net (CPDN) climate simulation, which uses the
                  Berkeley Open Infrastructure for Network Computing (BOINC) framework. Biases in
                  simulated temperature were identified and corrected using a quantile mapping
                  approach.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Population Exposure</TableCell>
                <TableCell>Derived from ISIMIP hazards and GHSL population</TableCell>
                <TableCell>
                  Russell, T., Nicholas, C., & Bernhofen, M. (2024). Annual probability of extreme
                  heat and drought events, derived from Lange et al 2020 [Data set]. Zenodo.{' '}
                  <ExtLink href="https://doi.org/10.5281/zenodo.11582369">
                    10.5281/zenodo.11582369
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
