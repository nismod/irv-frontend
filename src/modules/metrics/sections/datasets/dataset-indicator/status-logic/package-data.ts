import { DataPackage } from '@nismod/irv-autopkg-client';

type DR = DataPackage['resources'][number];
export interface DataResource extends DR {
  version?: string;
  hashes?: string[];
}

export enum PackageDataStatus {
  Unavailable = 'unavailable',
  Available = 'available',
}

export type ComputePackageDataResult =
  | { status: PackageDataStatus.Unavailable; data: null }
  | { status: PackageDataStatus.Available; data: DataResource };

export interface IPackage {
  datapackage: {
    resources: DataResource[];
  };
}

export function computePackageData(pkg: IPackage, pvName: string): ComputePackageDataResult {
  const resource = pkg.datapackage.resources.find((r) => pvName === `${r.name}.${r.version}`);

  if (resource == null) {
    return {
      status: PackageDataStatus.Unavailable,
      data: null,
    };
  } else {
    return {
      status: PackageDataStatus.Available,
      data: resource,
    };
  }
}
