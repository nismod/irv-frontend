import { Route, createRoutesFromElements, redirect } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';

import { DataPage } from './pages/DataPage';
import { IntroPage } from './pages/IntroPage';
import { TermsPage } from './pages/TermsPage';
import { MapPage } from './pages/map/MapPage';
import { RootErrorRoute, RootRoute } from './pages/root';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootRoute />} errorElement={<RootErrorRoute />}>
      <Route path="/" element={<IntroPage />} />
      <Route path="/view" loader={() => redirect('/view/hazard')} />
      <Route path="/view/:view" element={<MapPage />} />
      <Route path="/data" element={<DataPage />} />
      <Route path="/terms-of-use" element={<TermsPage />} />
    </Route>,
  ),
);
