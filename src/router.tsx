import { redirect } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';

import { downloadsRoute } from './modules/downloads/downloads-routes';
import { DataPage } from './pages/DataPage';
import { IntroPage } from './pages/IntroPage';
import { MapPage } from './pages/map/MapPage';
import { RootErrorRoute, RootRoute } from './pages/root';
import { TermsPage } from './pages/TermsPage';

export const router = createBrowserRouter([
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
        path: '/data',
        element: <DataPage />,
      },
      {
        path: '/terms-of-use',
        element: <TermsPage />,
      },
      downloadsRoute,
    ],
  },
]);
