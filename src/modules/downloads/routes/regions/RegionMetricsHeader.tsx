import { Stack } from '@mui/material';

import { EmphasisTextParagraph } from '@/pages/ui/ArticleContainer';
import { BannerImage } from '@/pages/ui/BannerImage';
import { HeaderBlock, HeadingBoxText } from '@/pages/ui/HeadingBox';
import { IntroContainer } from '@/pages/ui/IntroContainer';

export const RegionMetricsHeader = () => {
  return (
    <Stack direction="column" width="100%" padding="0px" paddingBottom={4}>
      <HeaderBlock>
        <HeadingBoxText>Data Downloads</HeadingBoxText>
      </HeaderBlock>
      <BannerImage imageUrl="https://eoimages.gsfc.nasa.gov/images/imagerecords/150000/150528/mountterror_oli2_2021312_lrg.jpg" />

      <IntroContainer>
        <EmphasisTextParagraph>
          This page provides access to extracts of the datasets presented in the tool. The extracts
          are organised by country and data source.
        </EmphasisTextParagraph>
      </IntroContainer>
    </Stack>
  );
};
