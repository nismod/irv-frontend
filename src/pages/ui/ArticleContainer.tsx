import { Box, Stack, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';

const ParagraphTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Georgia, Times New Roman, Times, serif',
  fontSize: '1rem',
  letterSpacing: '-0.5px',
  lineHeight: 1.45,
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.2em',
  },
}));

export const ArticleSection = ({ children }) => {
  return (
    <Stack spacing={2} paddingX={2} marginY={6} alignItems={'center'}>
      {children}
    </Stack>
  );
};

export const ArticleSectionHeader = ({ children }) => {
  return (
    <NarrowContainer>
      <Typography variant="h2">{children}</Typography>
    </NarrowContainer>
  );
};

export const SuperSectionHeader = ({ children }) => {
  return (
    <NarrowContainer>
      <Typography variant="h1">{children}</Typography>
    </NarrowContainer>
  );
};

export const SubSectionHeader = ({ children }) => {
  return (
    <NarrowContainer>
      <Typography variant="h3">{children}</Typography>
    </NarrowContainer>
  );
};

export const NarrowContainer = ({ children }) => {
  return (
    <Box width={'100%'} maxWidth={'50rem'}>
      {children}
    </Box>
  );
};

export const ArticleParagraph = ({ children }) => {
  return (
    <NarrowContainer>
      <ParagraphTypography paragraph={true} margin={'0px'}>
        {children}
      </ParagraphTypography>
    </NarrowContainer>
  );
};

export const EmphasisTextContainer = ({ children }) => {
  return <NarrowContainer>{children}</NarrowContainer>;
};

export const EmphasisTextParagraph = ({ children }) => {
  return (
    <Typography variant="h5" paragraph={true}>
      {children}
    </Typography>
  );
};

export const ArticleContainer = ({ children }) => {
  return <Box component={'article'}>{children}</Box>;
};

export const ArticleContentContainer = ({ children }) => {
  return (
    <Box component={'div'} paddingY={2}>
      {children}
    </Box>
  );
};

export const MiniBar = () => {
  return (
    <Divider
      sx={{
        width: '3rem',
        height: '4px',
        border: 0,
        backgroundColor: '#222',
      }}
    ></Divider>
  );
};

export const ExternalLink = ({ href, children }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};
