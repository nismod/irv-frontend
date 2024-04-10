import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ArticleTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Georgia, Times New Roman, Times, serif',
  fontSize: '1.25rem',
  letterSpacing: '-0.5px',
  lineHeight: 1.45,
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.6rem',
  },
}));

export const ArticleParagraph = ({ children }) => {
  return (
    <ArticleTypography paragraph={true} marginY={3}>
      {children}
    </ArticleTypography>
  );
};
