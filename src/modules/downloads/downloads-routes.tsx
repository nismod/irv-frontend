import { RouteObject, redirect } from 'react-router';

import { DownloadsRoot } from './routes/downloads-root';

export const downloadsRoute: RouteObject = {
  path: '/downloads',
  element: <DownloadsRoot />,
  children: [
    {
      index: true,
      lazy: () => import('./routes/downloads-index'),
    },
    {
      path: 'regions',
      children: [
        {
          index: true,
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
