import { redirect, RouteObject } from 'react-router';

export const metricsRoute: RouteObject = {
  path: '/metrics',
  children: [
    {
      index: true,
      loader: () => redirect('./regions/afg/development'),
    },
    {
      path: 'regions',
      children: [
        {
          index: true,
          handle: {
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
              path: ':metricId',
              children: [
                {
                  index: true,
                  lazy: () => import('./routes/regions/region-id'),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
