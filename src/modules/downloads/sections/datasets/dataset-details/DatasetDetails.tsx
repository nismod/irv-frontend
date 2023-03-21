import { Box, List, ListItem, Typography } from '@mui/material';
import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import Markdown from 'markdown-to-jsx';
import ReactJson from 'react-json-view';
import { Link } from 'react-router-dom';

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
      <ReactJson src={meta} collapsed={true} />
      <Box py={1}>
        <Typography variant="h3">Downloads</Typography>
        <Typography variant="subtitle1" color="GrayText">
          Format: {meta.data_formats.join(', ')}
        </Typography>
        {status === PackageDataStatus.Available ? (
          <>
            <DownloadsList paths={data.path} />
            <ReactJson src={data} collapsed={true} />
          </>
        ) : (
          <Typography>No data yet.</Typography>
        )}
      </Box>
      <Box py={1}>
        <Typography variant="h3">Summary</Typography>
        <Typography sx={{ hyphens: 'auto' }}>
          <Markdown>{meta.data_summary}</Markdown>
        </Typography>
        <Typography variant="h3">Citation</Typography>
        <Markdown>{meta.data_citation}</Markdown>
        <Typography variant="h3"></Typography>
      </Box>
    </Box>
  );
}

function DownloadsList({ paths }: { paths: string[] | string }) {
  const pathList = Array.isArray(paths) ? paths : [paths];
  return (
    <List>
      {pathList.map((p) => (
        <ListItem key={p}>
          <Typography fontSize="12px" color="inherit">
            <Link color="inherit" to={p}>
              {p.substring(p.lastIndexOf('/') + 1)}
            </Link>
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}
