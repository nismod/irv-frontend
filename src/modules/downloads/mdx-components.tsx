import { MDXComponents } from 'mdx/types';

import { H1, H2, H3, H4, H5, H6 } from '@/lib/ui/mui/typography';

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...otherProps }) => <H1>{children}</H1>,
  h2: ({ children, ...otherProps }) => <H2>{children}</H2>,
  h3: ({ children, ...otherProps }) => <H3>{children}</H3>,
  h4: ({ children, ...otherProps }) => <H4>{children}</H4>,
  h5: ({ children, ...otherProps }) => <H5>{children}</H5>,
  h6: ({ children, ...otherProps }) => <H6>{children}</H6>,
};
