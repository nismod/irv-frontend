import { redirect, RouteObject } from 'react-router';

import { DownloadsRoot } from './routes/metrics-root';

export const metricsRoute: RouteObject = {
  path: '/metrics',
  element: <DownloadsRoot />,
  children: [
    {
      index: true,
      lazy: () => import('./routes/metrics-index'),
    },
    {
      path: 'regions',
      children: [
        {
          index: true,
          handle: {
            // see @lib/nav.tsx
            pathBasedScroll: true,
          },
          lazy: () => import('./routes/regions/regions-index'),
        },
        {
          path: ':regionId',
          children: [
            {
              index: true,
              lazy: () => import('./routes/regions/region-id'),
            },
            {
              path: 'packages',
              children: [
                {
                  index: true,
                  loader: () => redirect('..'),
                },
                {
                  path: ':pvId',
                  lazy: () => import('./routes/regions/packages/package-id'),
                },
              ],
            },
          ],
        },
      ],
    },
    // {
    //   path: 'datasets',
    //   children: [
    //     {
    //       index: true,
    //       loader: () => redirect('/downloads'),
    //     },
    //     {
    //       path: ':datasetId',
    //       loader: singleDatasetLoader,
    //       element: <SingleDatasetPage />,
    //     },
    //   ],
    // },
  ],
};
