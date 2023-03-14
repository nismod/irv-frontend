import { RouteObject } from 'react-router';

import { AllRegionsPage, allRegionsLoader } from './routes/AllRegionsPage';
import { LandingPage, landingPageLoader } from './routes/LandingPage';
import { SingleRegionPage, singleRegionLoader } from './routes/SingleRegionPage';

export const downloadsRoute: RouteObject = {
  path: '/downloads',
  children: [
    {
      index: true,
      loader: landingPageLoader,
      element: <LandingPage />,
    },
    {
      path: 'regions',
      children: [
        {
          index: true,
          loader: allRegionsLoader,
          element: <AllRegionsPage />,
        },
        {
          path: ':regionId',
          loader: singleRegionLoader,
          element: <SingleRegionPage />,
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
