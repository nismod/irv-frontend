import { MapMarker } from '@/lib/map/marker/MapMarker';
import { AppLink } from '@/lib/nav';
import { H1, H2, H3, H4, H5, H6 } from '@/lib/ui/mui/typography';

import { ArticleParagraph } from '@/pages/ui/ArticleContainer';

import { ArticleChart } from './ArticleChart';
import { ArticleFigure } from './ArticleFigure';
import { ArticleMap } from './ArticleMap';
import { Callout } from './Callout';

/**
 * Components available inside article MDX files.
 * Add new interactive or presentational components here so authors can use them by name.
 */
const MdLink = ({
  href,
  children,
  title,
}: {
  href?: string;
  title?: string;
  children?: React.ReactNode;
}) => {
  if (!href) return <>{children}</>;
  const isExternal = href.startsWith('http');
  return (
    <AppLink
      to={href}
      title={title}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
    </AppLink>
  );
};

/**
 * Component map passed to MDX. Keys are the names authors use in MDX (e.g. <Callout>).
 * Extend this object to add more embeddable components (e.g. Chart, DataMapEmbed).
 */
export const articleMdxComponents = {
  a: ({ href, title, children }: { href?: string; title?: string; children?: React.ReactNode }) => (
    <MdLink href={href} title={title}>
      {children}
    </MdLink>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => <H1>{children}</H1>,
  h2: ({ children }: { children?: React.ReactNode }) => <H2>{children}</H2>,
  h3: ({ children }: { children?: React.ReactNode }) => <H3>{children}</H3>,
  h4: ({ children }: { children?: React.ReactNode }) => <H4>{children}</H4>,
  h5: ({ children }: { children?: React.ReactNode }) => <H5>{children}</H5>,
  h6: ({ children }: { children?: React.ReactNode }) => <H6>{children}</H6>,
  p: ({ children }: { children?: React.ReactNode }) => (
    <ArticleParagraph>{children}</ArticleParagraph>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ArticleParagraph>
      <ul>{children}</ul>
    </ArticleParagraph>
  ),
  Callout,
  ArticleChart,
  ArticleFigure,
  ArticleMap,
  MapMarker,
  MdLink,
};
