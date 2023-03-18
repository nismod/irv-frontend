import { RouteObject } from 'react-router';

export const downloadsRoute: RouteObject = {
  path: '/downloads',
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
          lazy: () => import('./routes/regions/region-id'),
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
