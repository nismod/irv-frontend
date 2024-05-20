import { Outlet } from 'react-router-dom';

import { usePruneJobsBeforeLast, usePruneOldJobs } from '../data/jobs';

export const DownloadsRoot = () => {
  usePruneOldJobs();
  usePruneJobsBeforeLast();

  return <Outlet />;
};
