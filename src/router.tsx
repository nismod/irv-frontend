import { redirect } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';

import { downloadsRoute } from './modules/downloads/downloads-routes';
import { metricsRoute } from './modules/metrics/metrics-routes';
import { AboutPage } from './pages/AboutPage';
import { ArticlesIndexPage } from './pages/articles/ArticlesIndexPage';
import { loader as articleSlugLoader, ArticleSlugPage } from './pages/articles/ArticleSlugPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { GuidePage } from './pages/GuidePage';
import { IntroPage } from './pages/IntroPage';
import { MapPage } from './pages/map/MapPage';
import { RootErrorRoute, RootRoute } from './pages/root';
import { TermsPage } from './pages/TermsPage';

export const router = createBrowserRouter(
  [
    {
      element: <RootRoute />,
      errorElement: <RootErrorRoute />,
      children: [
        {
          path: '/',
          element: <IntroPage />,
        },
        {
          path: '/view',
          children: [
            { index: true, loader: () => redirect('/view/hazard') },
            {
              path: ':view',
              element: <MapPage />,
            },
          ],
        },
        {
          path: '/about',
          element: <AboutPage />,
        },
        {
          path: '/guide',
          element: <GuidePage />,
        },
        {
          path: '/data',
          element: <DataSourcesPage />,
        },
        {
          path: '/terms-of-use',
          element: <TermsPage />,
        },
        {
          path: '/articles',
          children: [
            { index: true, element: <ArticlesIndexPage /> },
            { path: ':slug', element: <ArticleSlugPage />, loader: articleSlugLoader },
          ],
        },
        downloadsRoute,
        metricsRoute,
      ],
    },
  ],
  {
    // see https://reactrouter.com/6.30.0/upgrading/future
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
