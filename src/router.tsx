import { redirect } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';

import { downloadsRoute } from './modules/downloads/downloads-routes';
import { DataPage } from './pages/DataPage';
import { IntroPage } from './pages/IntroPage';
import { TermsPage } from './pages/TermsPage';
import { MapPage } from './pages/map/MapPage';
import { RootErrorRoute, RootRoute } from './pages/root';

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
        loader: () => redirect('/view/hazard'),
      },
      {
        path: '/view/:view',
        element: <MapPage />,
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
