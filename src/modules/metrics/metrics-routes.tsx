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
          path: ':regionId',
          children: [
            {
              index: true,
              lazy: () => import('./routes/region-id'),
            },
            {
              path: ':metricId',
              children: [
                {
                  index: true,
                  lazy: () => import('./routes/region-id'),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
