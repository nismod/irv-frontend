import { List, ListItem, Typography } from '@mui/material';
import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { compiler } from 'markdown-to-jsx';
import { useMemo } from 'react';
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

  const summary = useMemo(() => compiler(meta.data_summary), [meta.data_summary]);
  return (
    <>
      <Typography variant="h3">Downloads</Typography>
      {status === PackageDataStatus.Available ? (
        <>
          <DownloadsList paths={data.path} />
          <ReactJson src={data} collapsed={true} />
        </>
      ) : (
        <Typography>No data yet.</Typography>
      )}
      <Typography variant="h3">Summary</Typography>
      <Typography>{summary}</Typography>
    </>
  );
}

function DownloadsList({ paths }: { paths: string[] | string }) {
  const pathList = Array.isArray(paths) ? paths : [paths];
  return (
    <List>
      {pathList.map((p) => (
        <ListItem key={p}>
          <Link to={p}>{p.substring(p.lastIndexOf('/') + 1)}</Link>
        </ListItem>
      ))}
    </List>
  );
}
