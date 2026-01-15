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

import { PixelRecord } from './types';

/**
 * Represents a file to be included in the download ZIP.
 */
export interface ExportFile {
  filename: string;
  content: string | Blob;
  mimeType: string;
}

/**
 * Export function that receives all records and returns file data or null.
 * Each function handles its own filtering internally.
 */
export type ExportFunction = (records: PixelRecord[]) => Promise<ExportFile | null>;

interface DownloadDataContextValue {
  /**
   * Register an export function with a unique key.
   * Returns a cleanup function to unregister.
   */
  registerExportFunction: (key: string, fn: ExportFunction) => () => void;
  /**
   * Get all currently registered export functions.
   */
  getAllExportFunctions: () => Map<string, ExportFunction>;
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
  const functionsRef = useRef<Map<string, ExportFunction>>(new Map());
  // Use state to trigger re-renders when functions are registered/unregistered
  const [, setVersion] = useState(0);

  const registerExportFunction = useCallback(
    (key: string, fn: ExportFunction): (() => void) => {
      functionsRef.current.set(key, fn);
      setVersion((v) => v + 1);
      // Return cleanup function
      return () => {
        functionsRef.current.delete(key);
        setVersion((v) => v + 1);
      };
    },
    [setVersion],
  );

  const getAllExportFunctions = useCallback((): Map<string, ExportFunction> => {
    // Return a new Map to prevent external mutations
    return new Map(functionsRef.current);
  }, []);

  const value: DownloadDataContextValue = {
    registerExportFunction,
    getAllExportFunctions,
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
 * Hook to register an export function for a domain component.
 * Automatically unregisters the function when the component unmounts.
 *
 * @param key - Unique identifier for this export function (e.g., domain name)
 * @param exportFn - Function that receives all records and returns export file or null
 */

export const useRegisterExportFunction = (key: string, exportFn: ExportFunction): void => {
  const { registerExportFunction } = useDownloadDataContext();

  useEffect(() => {
    const unregister = registerExportFunction(key, exportFn);
    // Return cleanup function to unregister on unmount
    return unregister;
  }, [key, exportFn, registerExportFunction]);
};
