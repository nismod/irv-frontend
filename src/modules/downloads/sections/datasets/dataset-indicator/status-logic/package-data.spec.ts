import { describe, expect, it } from 'vitest';

import { computePackageData, IPackage, PackageDataStatus } from './package-data';

describe('Compute package data status', () => {
  const PV_NAME = 'processor.version';

  it('returns status:available and data resource if data resource is present', () => {
    const RESOURCE = {
      name: 'processor',
      version: 'version',
    };
    const PACKAGE: IPackage = {
      datapackage: {
        resources: [RESOURCE],
      },
    };
    const { status, data } = computePackageData(PACKAGE, PV_NAME);

    expect(status).toBe(PackageDataStatus.Available);
    expect(data).toBe(RESOURCE);
  });

  it('returns status:unavailable and no data if data resource is not present', () => {
    const RESOURCE = {
      name: 'processor',
      version: 'version_not',
    };
    const PACKAGE: IPackage = {
      datapackage: {
        resources: [RESOURCE],
      },
    };
    const { status, data } = computePackageData(PACKAGE, PV_NAME);

    expect(status).toBe(PackageDataStatus.Unavailable);
    expect(data).toBe(null);
  });
});
