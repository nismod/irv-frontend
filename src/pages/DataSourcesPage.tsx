import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ExtLink } from '@/lib/nav';

import { getLayerMetadataBySection, type LayerMetadataSection } from '@/config/layer-metadata';
import { getLicenseByUrl } from '@/config/licenses';
import type { RdlsDataset, RdlsResource } from '@/details/pixel-driller/download/metadata-types';

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

const renderTextWithLinks = (text: string) => {
  const parts = text.split(/(https?:\/\/\S+)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <ExtLink key={i} href={part}>
            {part}
          </ExtLink>
        ) : (
          part
        ),
      )}
    </>
  );
};

const renderTextParagraphs = (paragraphs: string[]) => {
  return (
    <TableCellStack>
      {paragraphs.map((paragraph, index) => (
        <TableCellParagraph key={index}>{renderTextWithLinks(paragraph)}</TableCellParagraph>
      ))}
    </TableCellStack>
  );
};

const renderSourceLink = (resource: RdlsResource | undefined) => {
  if (!resource) return null;
  const url = resource?.access_url ?? resource?.download_url;
  return url ? <ExtLink href={url}>{resource.title}</ExtLink> : resource.title;
};

const renderLicenseLink = (url: string) => {
  const license = getLicenseByUrl(url);
  return <ExtLink href={url}>{license?.shortname ?? url}</ExtLink>;
};

const getDatasetCitations = (dataset: RdlsDataset): string[] =>
  dataset.lineage?.sources
    .map((source) => source.name)
    .filter((name): name is string => Boolean(name?.trim())) ?? [];

const renderDataSourceRows = (section: LayerMetadataSection) =>
  getLayerMetadataBySection(section).map((dataset) => (
    <TableRow key={dataset.id}>
      <TableCell>{dataset.title}</TableCell>
      <TableCell>
        <TableCellStack>
          {dataset.resources.map((resource, index) => (
            <TableCellParagraph key={resource.id ?? index}>
              {renderSourceLink(resource)}
            </TableCellParagraph>
          ))}
        </TableCellStack>
      </TableCell>
      <TableCell>{renderTextParagraphs(getDatasetCitations(dataset))}</TableCell>
      <TableCell>{renderLicenseLink(dataset.license)}</TableCell>
      <TableCell>{renderTextParagraphs(dataset.description.split('\n\n'))}</TableCell>
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
            <TableBody>{renderDataSourceRows('exposure')}</TableBody>
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
            <TableBody>{renderDataSourceRows('vulnerability')}</TableBody>
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
            <TableBody>{renderDataSourceRows('risk')}</TableBody>
          </Table>
        </StyledTableContainer>
      </TableSectionContainer>
    </ArticleContentContainer>
  </ArticleContainer>
);
