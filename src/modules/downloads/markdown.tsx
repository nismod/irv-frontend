import { MDXComponents } from 'mdx/types';

import { AppLink } from '@/lib/nav';
import { H1, H2, H3, H4, H5, H6 } from '@/lib/ui/mui/typography';

export const MdLink = ({ to, title, children }) => {
  const isExternal = to.startsWith('http');
  return (
    <AppLink
      to={to}
      title={title}
      children={children}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    />
  );
};

const mapping = {
  a: ({ children, href, title }) => (
    <MdLink to={href} title={title}>
      {children}
    </MdLink>
  ),
  h1: ({ children }) => <H1>{children}</H1>,
  h2: ({ children }) => <H2>{children}</H2>,
  h3: ({ children }) => <H3>{children}</H3>,
  h4: ({ children }) => <H4>{children}</H4>,
  h5: ({ children }) => <H5>{children}</H5>,
  h6: ({ children }) => <H6>{children}</H6>,
};

export const mdxComponents: MDXComponents = {
  ...mapping,
};

export const mdToJsxOverrides = {
  ...mapping,
};
