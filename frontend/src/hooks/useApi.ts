/**
 * React Hook for API calls with loading and error states
 */

import { useState, useCallback } from 'react';

import { api } from '../lib/api';
import type {ApiResponse } from '../lib/api';
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiCall();

        if (response.error) {
          setState({ data: null, loading: false, error: response.error });
          return { success: false, error: response.error };
        }

        setState({ data: response.data || null, loading: false, error: null });
        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState({ data: null, loading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useRepositories() {
  const { data, loading, error, execute } = useApi();

  const fetchRepositories = useCallback(() => {
    return execute(() => api.listRepositories());
  }, [execute]);

  const connectRepository = useCallback(
    (url: string) => {
      return execute(() => api.connectRepository(url));
    },
    [execute]
  );

  const analyzeRepository = useCallback(
    (repoId: number) => {
      return execute(() => api.analyzeRepository(repoId));
    },
    [execute]
  );

  return {
    repositories: data?.repositories || [],
    loading,
    error,
    fetchRepositories,
    connectRepository,
    analyzeRepository,
  };
}

export function useMetrics(repoId: number | null) {
  const { data, loading, error, execute } = useApi();

  const fetchMetrics = useCallback(() => {
    if (!repoId) return Promise.resolve({ success: false, error: 'No repository selected' });
    return execute(() => api.getMetrics(repoId));
  }, [repoId, execute]);

  return {
    metrics: data?.metrics || [],
    loading,
    error,
    fetchMetrics
  };
}

export function usePredictions(repoId: number | null) {
  const { data, loading, error, execute } = useApi();

  const fetchPredictions = useCallback(() => {
    if (!repoId) return Promise.resolve({ success: false, error: 'No repository selected' });
    return execute(() => api.getPredictions(repoId));
  }, [repoId, execute]);

  const generatePredictions = useCallback(() => {
    if (!repoId) return Promise.resolve({ success: false, error: 'No repository selected' });
    return execute(() => api.predictFaults(repoId));
  }, [repoId, execute]);

  return {
    predictions: data?.predictions || [],
    loading,
    error,
    fetchPredictions,
    generatePredictions,
  };
}

export function useTestPrioritization(repoId: number | null) {
  const { data, loading, error, execute } = useApi();

  const fetchTests = useCallback(() => {
    if (!repoId) return Promise.resolve({ success: false, error: 'No repository selected' });
    return execute(() => api.getPrioritizedTests(repoId));
  }, [repoId, execute]);

  const prioritizeTests = useCallback(
    (testCases: any[]) => {
      if (!repoId) return Promise.resolve({ success: false, error: 'No repository selected' });
      return execute(() => api.prioritizeTests(repoId, testCases));
    },
    [repoId, execute]
  );

  return {
    tests: data?.tests || [],
    loading,
    error,
    fetchTests,
    prioritizeTests,
  };
}

export function useBugReports(repoId: number | null) {
  const { data, loading, error, execute } = useApi();

  const fetchBugs = useCallback(() => {
    if (!repoId) return Promise.resolve({ success: false, error: 'No repository selected' });
    return execute(() => api.getBugReports(repoId));
  }, [repoId, execute]);

  const addBug = useCallback(
    (bugData: any) => {
      return execute(() => api.addBugReport({ ...bugData, repository_id: repoId }));
    },
    [repoId, execute]
  );

  const updateBug = useCallback(
    (bugId: number, updates: any) => {
      return execute(() => api.updateBugReport(bugId, updates));
    },
    [execute]
  );

  return {
    bugs: data?.bugs || [],
    loading,
    error,
    fetchBugs,
    addBug,
    updateBug,
  };
}

export function useSettings() {
  const { data, loading, error, execute } = useApi();

  const fetchSettings = useCallback(() => {
    return execute(() => api.getSettings());
  }, [execute]);

  const updateSettings = useCallback(
    (settings: any) => {
      return execute(() => api.updateSettings(settings));
    },
    [execute]
  );

  return {
    settings: data?.settings || null,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };
}