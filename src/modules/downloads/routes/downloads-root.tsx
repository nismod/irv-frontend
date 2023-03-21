import { Outlet } from 'react-router-dom';

import { usePruneOldJobs } from '../data/jobs';

export const DownloadsRoot = () => {
  usePruneOldJobs();

  return <Outlet />;
};
