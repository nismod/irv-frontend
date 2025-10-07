import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';

import { ArticleSection, NarrowContainer } from './ArticleContainer';

export const BackToTop = ({ id }) => {
  const handleClick = (e) => {
    window.scrollTo({ top: 0 });
    e.preventDefault();
  };
  return (
    <ArticleSection>
      <NarrowContainer>
        <Link id={id} href="#contents" sx={{ opacity: 0.5 }} onClick={handleClick}>
          <IconButton edge="start" sx={{ mr: 1, border: 1 }}>
            <KeyboardArrowUpIcon />
          </IconButton>
          Back to top
        </Link>
      </NarrowContainer>
    </ArticleSection>
  );
};
