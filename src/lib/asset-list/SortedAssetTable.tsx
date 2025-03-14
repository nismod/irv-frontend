import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { ApiClient } from '@nismod/irv-api-client';
import { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { FieldSpec } from '@/lib/data-map/view-layers';

import { LayerSpec, ListFeature, ScopeSpec, useSortedFeatures } from './use-sorted-features';

import './asset-table.css';

export const SortedAssetTable: FC<{
  apiClient: ApiClient;
  layerSpec: LayerSpec;
  fieldSpec: FieldSpec;
  scopeSpec?: ScopeSpec;
  header: ReactNode;
  renderRow: (feature: ListFeature, localIndex: number, globalIndex: number) => ReactNode;
  pageSize?: number;
}> = ({ apiClient, layerSpec, fieldSpec, scopeSpec, header, renderRow, pageSize = 20 }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [layerSpec, fieldSpec]);

  const { features, pageInfo, loading, error } = useSortedFeatures(
    apiClient,
    layerSpec,
    fieldSpec,
    page,
    pageSize,
    scopeSpec,
  );

  const handleTablePaginationChange = useCallback((event, value) => setPage(value + 1), [setPage]);

  const currentPageFirstItemIndex = (page - 1) * pageSize;

  return (
    <>
      <TableContainer component={Box} height="calc(100% - 48px)" overflow="scroll">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>{header}</TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2">Loading...</Typography>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2">Error: {error.message}</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              features.map((feature, index) =>
                renderRow(feature, index, currentPageFirstItemIndex + index),
              )}
            {!loading && !error && !features.length ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2">No results found.</Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
      {pageInfo && (
        <TablePagination
          component={Box}
          sx={{
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '48px',
          }}
          count={pageInfo.total}
          page={page - 1}
          onPageChange={handleTablePaginationChange}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[pageSize]}
        />
      )}
    </>
  );
};
