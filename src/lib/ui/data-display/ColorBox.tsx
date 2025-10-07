import Square from '@mui/icons-material/Square';
import SquareOutlined from '@mui/icons-material/SquareOutlined';
import { FC } from 'react';

export const ColorBox: FC<{ color: string; empty?: boolean }> = ({ color, empty = false }) => {
  const Icon = empty ? SquareOutlined : Square;
  return (
    <Icon
      fontSize="inherit"
      sx={{ margin: '-0.125em', marginRight: '0.25em', verticalAlign: 'baseline' }}
      htmlColor={color}
    />
  );
};
