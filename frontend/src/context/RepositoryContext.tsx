/**
 * Repository Context
 * Manages the currently selected repository across the application
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRepositories } from '../hooks/useApi';
import { useAuth } from './AuthContext';

interface Repository {
  id: number;
  name: string;
  owner: string;
  url: string;
  description?: string;
  language?: string;
  stars?: number;
  last_commit?: string;
  analyzed: boolean;
  created_at: string;
}

interface RepositoryContextType {
  selectedRepository: Repository | null;
  setSelectedRepository: (repo: Repository | null) => void;
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  refreshRepositories: () => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const { repositories, loading, error, fetchRepositories } = useRepositories();
  const { user } = useAuth();

  // Load repositories when auth state changes
  useEffect(() => {
    if (user) {
      fetchRepositories();
    } else {
      setSelectedRepository(null);
    }
  }, [user, fetchRepositories]);

  // Auto-select first repository if none selected, and update selected repo if it exists in new list
  useEffect(() => {
    if (!selectedRepository && repositories.length > 0) {
      setSelectedRepository(repositories[0]);
    } else if (selectedRepository && repositories.length > 0) {
      // Update selected repository with fresh data from the list
      const updatedRepo = repositories.find((r: Repository) => r.id === selectedRepository.id);
      if (updatedRepo && updatedRepo !== selectedRepository) {
        setSelectedRepository(updatedRepo);
      }
    }
  }, [repositories, selectedRepository]);

  const refreshRepositories = async () => {
    await fetchRepositories();
  };

  return (
    <RepositoryContext.Provider
      value={{
        selectedRepository,
        setSelectedRepository,
        repositories,
        loading,
        error,
        refreshRepositories,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositoryContext() {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error('useRepositoryContext must be used within a RepositoryProvider');
  }
  return context;
}