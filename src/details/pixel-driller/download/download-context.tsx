import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { DownloadFile } from '@/lib/downloads/types';

import { PixelRecord } from '../types';
import { RdlsDataset, RdlsLocation } from './metadata-types';

/**
 * Export function that receives all records and returns a single file.
 * Each function handles its own filtering internally and typically returns
 * a single CSV file for its domain.
 */
export type ExportFunction = (records: PixelRecord[]) => Promise<DownloadFile>;

/**
 * Arguments for a metadata function.
 */
export interface MetadataArgs {
  spatial: RdlsLocation;
}

/**
 * Function that generates a RDLS dataset from a set of arguments.
 */
export type MetadataFunction = (args: MetadataArgs) => RdlsDataset;

/**
 * Contents of the README file.
 */
export interface ReadmeContents {
  datasetDescription: string;
  datasetSources: string[];
}

export type ReadmeFunction = () => ReadmeContents;

/**
 * Configuration for a domain export.
 * Includes the export function and the metadata function.
 */
export interface ExportConfig {
  exportFunction: ExportFunction;
  metadataFunction: MetadataFunction;
  /**
   * Function that returns the dataset-specific contents of the README file.
   * Values from all domains are deduplicated and combined into a single README file.
   */
  readmeFunction: ReadmeFunction;
}

interface DownloadDataContextValue {
  /**
   * Register an export configuration with a unique key.
   * Returns a cleanup function to unregister.
   */
  registerExportConfig: (key: string, config: ExportConfig) => () => void;
  /**
   * Get all currently registered export configurations.
   */
  getAllExportConfigs: () => Map<string, ExportConfig>;
}

const DownloadDataContext = createContext<DownloadDataContextValue | null>(null);

interface DownloadDataProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages registered export functions.
 * Each domain component can register its export function through this context.
 */
export const DownloadDataProvider: FC<DownloadDataProviderProps> = ({ children }) => {
  // Use ref to store the Map so it persists across renders without causing re-renders
  const configsRef = useRef<Map<string, ExportConfig>>(new Map());
  // Use state to trigger re-renders when functions are registered/unregistered
  const [, setVersion] = useState(0);

  const registerExportConfig = useCallback(
    (key: string, config: ExportConfig): (() => void) => {
      configsRef.current.set(key, config);
      setVersion((v) => v + 1);
      // Return cleanup function
      return () => {
        configsRef.current.delete(key);
        setVersion((v) => v + 1);
      };
    },
    [setVersion],
  );

  const getAllExportConfigs = useCallback((): Map<string, ExportConfig> => {
    // Return a new Map to prevent external mutations
    return new Map(configsRef.current);
  }, []);

  const value: DownloadDataContextValue = {
    registerExportConfig,
    getAllExportConfigs,
  };

  return <DownloadDataContext.Provider value={value}>{children}</DownloadDataContext.Provider>;
};

/**
 * Hook to access the download data context.
 * Throws an error if used outside of DownloadDataProvider.
 */
export const useDownloadDataContext = (): DownloadDataContextValue => {
  const context = useContext(DownloadDataContext);
  if (!context) {
    throw new Error('useDownloadDataContext must be used within DownloadDataProvider');
  }
  return context;
};

/**
 * Hook to register an export configuration for a domain component.
 * Automatically unregisters the configuration when the component unmounts.
 *
 * @param key - Unique identifier for this export configuration (e.g., domain name)
 * @param config - Configuration for this export
 */
export const useRegisterExportConfig = (key: string, config: ExportConfig): void => {
  const { registerExportConfig } = useDownloadDataContext();

  useEffect(() => {
    const unregister = registerExportConfig(key, config);
    // Return cleanup function to unregister on unmount
    return unregister;
  }, [key, config, registerExportConfig]);
};
