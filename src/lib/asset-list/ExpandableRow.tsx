import { Collapse, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';

export const ExpandableRow = ({
  children,
  expanded,
  onExpandedChange,
  onMouseEnter = null,
  onMouseLeave = null,
  expandableContent,
}) => {
  const [headerRowHovered, setHeaderRowHovered] = useState(false);
  return (
    <>
      <TableRow
        className={headerRowHovered ? 'row-hovered' : ''}
        onClick={() => onExpandedChange(!expanded)}
        onMouseEnter={() => {
          setHeaderRowHovered(true);
          onMouseEnter?.();
        }}
        onMouseLeave={() => {
          setHeaderRowHovered(false);
          onMouseLeave?.();
        }}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {children}
      </TableRow>
      <TableRow
        onMouseEnter={() => onMouseEnter?.()}
        onMouseLeave={() => onMouseLeave?.()}
        sx={{
          bgcolor: '#eee',
          width: '100%',
        }}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {expandableContent}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
