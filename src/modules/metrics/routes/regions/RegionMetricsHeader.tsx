import { Stack } from '@mui/material';

import { EmphasisTextParagraph } from '@/pages/ui/ArticleContainer';
import { BannerImage } from '@/pages/ui/BannerImage';
import { HeaderBlock, HeadingBoxText } from '@/pages/ui/HeadingBox';
import { IntroContainer } from '@/pages/ui/IntroContainer';

export const RegionMetricsHeader = () => {
  return (
    <Stack direction="column" width="100%" padding="0px">
      <HeaderBlock>
        <HeadingBoxText>Country Metrics</HeadingBoxText>
      </HeaderBlock>

      <BannerImage imageUrl="/tarzaniaflood_oli2_20240429_lrg.jpeg" />

      <IntroContainer>
        <EmphasisTextParagraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </EmphasisTextParagraph>
      </IntroContainer>
    </Stack>
  );
};
