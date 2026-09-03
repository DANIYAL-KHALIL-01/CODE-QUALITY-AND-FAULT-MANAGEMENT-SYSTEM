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
  last_analysis_at?: string;
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
  const [selectionRestored, setSelectionRestored] = useState(false);
  const { repositories, loading, error, fetchRepositories } = useRepositories();
  const { user } = useAuth();

  // Load repositories when auth state changes
  useEffect(() => {
    if (user) {
      setSelectionRestored(false);
      fetchRepositories();
    } else {
      setSelectedRepository(null);
      setSelectionRestored(false);
    }
  }, [user, fetchRepositories]);

  // Restore the last repository for this user, preferring the latest analyzed one for new sessions.
  useEffect(() => {
    if (!user || repositories.length === 0 || selectionRestored) return;

    const savedId = window.localStorage.getItem(`selectedRepositoryId:${user.id}`);
    const savedRepository = savedId
      ? repositories.find((repository: Repository) => repository.id === Number(savedId))
      : undefined;
    const latestAnalyzed = [...repositories]
      .filter((repository: Repository) => repository.analyzed)
      .sort((first, second) =>
        new Date(second.last_analysis_at || second.created_at).getTime()
        - new Date(first.last_analysis_at || first.created_at).getTime()
      )[0];

    setSelectedRepository(savedRepository || latestAnalyzed || repositories[0]);
    setSelectionRestored(true);
  }, [user, repositories, selectionRestored]);

  // Keep the selected repository state fresh after a repository refresh.
  useEffect(() => {
    if (selectedRepository && repositories.length > 0) {
      // Update selected repository with fresh data from the list
      const updatedRepo = repositories.find((r: Repository) => r.id === selectedRepository.id);
      if (updatedRepo && updatedRepo !== selectedRepository) {
        setSelectedRepository(updatedRepo);
      }
    }
  }, [repositories, selectedRepository]);

  useEffect(() => {
    if (user && selectedRepository) {
      window.localStorage.setItem(`selectedRepositoryId:${user.id}`, String(selectedRepository.id));
    }
  }, [user, selectedRepository]);

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