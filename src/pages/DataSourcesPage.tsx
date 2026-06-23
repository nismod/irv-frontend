import { Card, Paper, Typography, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ExtLink } from '@/lib/nav';
import { DataItem } from '@/lib/ui/data-display/DataItem';
import { H2 } from '@/lib/ui/mui/typography';

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
  Paragraph,
  SpacedStack,
  StyledTableContainer,
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
    <SpacedStack>
      {paragraphs.map((paragraph, index) => (
        <Paragraph key={index}>{renderTextWithLinks(paragraph)}</Paragraph>
      ))}
    </SpacedStack>
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
        <SpacedStack>
          {dataset.resources.map((resource, index) => (
            <Paragraph key={resource.id ?? index}>{renderSourceLink(resource)}</Paragraph>
          ))}
        </SpacedStack>
      </TableCell>
      <TableCell>{renderTextParagraphs(getDatasetCitations(dataset))}</TableCell>
      <TableCell>{renderLicenseLink(dataset.license)}</TableCell>
      <TableCell>{renderTextParagraphs(dataset.description.split('\n\n'))}</TableCell>
    </TableRow>
  ));

const renderDataSourceCards = (section: LayerMetadataSection) =>
  getLayerMetadataBySection(section).map((dataset) => (
    <Card key={dataset.id} sx={{ my: 4, p: 2 }}>
      <Typography variant="h3">{dataset.title}</Typography>
      <DataItem
        label="Source"
        value={
          <SpacedStack>
            {dataset.resources.map((resource, index) => (
              <Paragraph key={resource.id ?? index}>{renderSourceLink(resource)}</Paragraph>
            ))}
          </SpacedStack>
        }
      />
      <DataItem label="Citation" value={renderTextParagraphs(getDatasetCitations(dataset))} />
      <DataItem label="License" value={renderLicenseLink(dataset.license)} />
      <DataItem label="Notes" value={renderTextParagraphs(dataset.description.split('\n\n'))} />
    </Card>
  ));

export const DataSourcesPage = () => {
  const isMediumOrUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  return (
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
            contributors, style &copy;{' '}
            <ExtLink href="https://carto.com/attributions">CARTO</ExtLink>.
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
          <H2>Hazard Data</H2>
          {isMediumOrUp ? (
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
          ) : (
            renderDataSourceCards('hazard')
          )}
        </TableSectionContainer>

        <BackToTop id="exposure" />
        <TableSectionContainer>
          <H2>Exposure Data</H2>
          {isMediumOrUp ? (
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
          ) : (
            renderDataSourceCards('exposure')
          )}
        </TableSectionContainer>

        <BackToTop id="vulnerability" />
        <TableSectionContainer>
          <H2>Vulnerability Data</H2>
          {isMediumOrUp ? (
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
          ) : (
            renderDataSourceCards('vulnerability')
          )}
        </TableSectionContainer>

        <BackToTop id="risk" />
        <TableSectionContainer>
          <H2>Risk Data</H2>
          {isMediumOrUp ? (
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
          ) : (
            renderDataSourceCards('risk')
          )}
        </TableSectionContainer>
      </ArticleContentContainer>
    </ArticleContainer>
  );
};
