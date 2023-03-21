import { Box, Typography } from '@mui/material';
import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import Markdown from 'markdown-to-jsx';
import prettyBytes from 'pretty-bytes';
import { Link } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { H3 } from '@/lib/ui/mui/typography';

import { mdToJsxOverrides } from '@/modules/downloads/markdown';

import { PackageDataStatus } from '../dataset-indicator/status-logic/package-data';
import { usePackageData } from '../use-package-data';

export function DatasetDetails({
  meta,
  boundary,
}: {
  meta: ProcessorVersionMetadata;
  boundary: Boundary;
}) {
  const { status, data } = usePackageData(boundary.name, meta.name);

  return (
    <Box p={2}>
      <Box py={1}>
        <Typography variant="h3">Downloads</Typography>
        <Typography variant="subtitle1" color="GrayText">
          Format: {meta.data_formats.join(', ')}
        </Typography>
        {status === PackageDataStatus.Available ? (
          <>
            <Typography variant="subtitle1" color="GrayText">
              Total size: {prettyBytes(data.bytes)}
            </Typography>
            <DownloadsList paths={data.path} />
          </>
        ) : (
          <Typography>No data yet.</Typography>
        )}
      </Box>
      <Box py={1}>
        {meta.data_summary && (
          <>
            <H3>Summary</H3>
            <Typography sx={{ hyphens: 'auto' }}>
              <MarkdownSection>{meta.data_summary}</MarkdownSection>
            </Typography>
          </>
        )}
        {meta.data_citation && (
          <>
            <H3>Citation</H3>
            <MarkdownSection>{meta.data_citation}</MarkdownSection>
          </>
        )}
        <H3>Authors</H3>
        <p>{meta.data_author}</p>
        {meta.data_license && (
          <>
            <H3>License</H3>
            <Typography>
              <Link to={meta.data_license.path} target="_blank">
                {meta.data_license?.title}
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

function DownloadsList({ paths }: { paths: string[] | string }) {
  const pathList = Array.isArray(paths) ? paths : [paths];
  return (
    <Box maxHeight="500px" overflow="auto">
      <Typography fontSize="14px" color="inherit">
        <ol>
          {pathList.map((p) => (
            <li key={p}>
              <AppLink to={p}>{p.substring(p.lastIndexOf('/') + 1)}</AppLink>
            </li>
          ))}
        </ol>
      </Typography>
    </Box>
  );
}

function MarkdownSection({ children }) {
  return <Markdown options={{ overrides: mdToJsxOverrides }}>{children}</Markdown>;
}
