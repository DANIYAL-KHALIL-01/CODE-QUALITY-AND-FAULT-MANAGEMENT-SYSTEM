/**
 * Analysis Context
 * Manages background repository analysis across page navigation
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface AnalysisState {
  repoId: number | null;
  repoName: string | null;
  isAnalyzing: boolean;
  progress: string;
  error: string | null;
}

interface AnalysisContextType {
  analysis: AnalysisState;
  startAnalysis: (repoId: number, repoName: string) => Promise<void>;
  cancelAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisState>({
    repoId: null,
    repoName: null,
    isAnalyzing: false,
    progress: '',
    error: null,
  });

  const startAnalysis = useCallback(async (repoId: number, repoName: string) => {
    setAnalysis({
      repoId,
      repoName,
      isAnalyzing: true,
      progress: 'Starting analysis...',
      error: null,
    });

    toast.loading(`Analyzing ${repoName}...`, { id: `analysis-${repoId}` });

    try {
      setAnalysis((prev) => ({ ...prev, progress: 'Cloning repository...' }));

      const result = (await api.analyzeRepository(repoId)) as any;

      if (result.error) {
        setAnalysis((prev) => ({
          ...prev,
          isAnalyzing: false,
          error: result.error,
        }));
        toast.error(result.error, { id: `analysis-${repoId}` });
        return;
      }

      setAnalysis((prev) => ({ ...prev, progress: 'Computing metrics...' }));

      // Small delay to simulate additional progress updates
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnalysis((prev) => ({ ...prev, progress: 'Generating predictions...' }));

      // Generate predictions
      const predictionResult = await api.predictFaults(repoId);
      if (predictionResult.error) {
        throw new Error(predictionResult.error);
      }

      setAnalysis({
        repoId: null,
        repoName: null,
        isAnalyzing: false,
        progress: '',
        error: null,
      });

      toast.success(`Analysis complete for ${repoName}!`, { id: `analysis-${repoId}` });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Analysis failed';
      setAnalysis((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: errorMsg,
      }));
      toast.error(errorMsg, { id: `analysis-${repoId}` });
    }
  }, []);

  const cancelAnalysis = useCallback(() => {
    setAnalysis({
      repoId: null,
      repoName: null,
      isAnalyzing: false,
      progress: '',
      error: null,
    });
    toast.info('Analysis cancelled');
  }, []);

  return (
    <AnalysisContext.Provider value={{ analysis, startAnalysis, cancelAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return {
    ...context,
    isAnalyzing: context.analysis.isAnalyzing,
  };
}
