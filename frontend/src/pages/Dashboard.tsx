import { useEffect, useState, useCallback } from 'react';
import { OverviewCards } from '../dashboard/OverviewCards';
import { RiskChart } from '../dashboard/RiskChart';
import { RecentAnalysis } from '../dashboard/RecentAnalysis';
import { ComplexityTrend } from '../dashboard/ComplexityTrend';
import { ChurnAnalysis } from '../dashboard/ChurnAnalysis';
import { Button } from '../ui/button';
import { Plus, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRepositoryContext } from '../context/RepositoryContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useMetrics, usePredictions } from '../hooks/useApi';
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedRepository, refreshRepositories } = useRepositoryContext();
  const { analysis } = useAnalysis();
  const { metrics, fetchMetrics, loading: metricsLoading } = useMetrics(selectedRepository?.id || null);
  const { predictions, fetchPredictions, loading: predictionsLoading } = usePredictions(selectedRepository?.id || null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (selectedRepository?.analyzed) {
      fetchMetrics();
      fetchPredictions();
    }
  }, [selectedRepository, refreshTrigger, fetchMetrics, fetchPredictions]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    console.log('🔄 Refresh clicked, selectedRepository:', selectedRepository);
    try {
      console.log('📦 Refreshing repositories...');
      await refreshRepositories();
      console.log('✅ Repositories refreshed');
      
      // Trigger a manual refresh by incrementing the trigger
      setRefreshTrigger(prev => prev + 1);
      console.log('📊 Triggered data refresh');
      
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('❌ Refresh error:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshRepositories]);

  const loading = metricsLoading || predictionsLoading;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div
        className="relative rounded-xl overflow-hidden p-8 bg-cover bg-center shadow-glow-lg animate-bounce-in"
        style={{ backgroundImage: "url('/images/CoverImage.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-primary/5 animate-pulse-slow"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-brand-foreground mb-3 bg-gradient-to-r from-brand-foreground via-brand-muted to-brand-primary bg-clip-text animate-fade-in">
            Welcome to Fault Prediction Tool
          </h1>
          <p className="text-brand-muted mb-8 text-lg animate-slide-in">
            Intelligent test case prioritization for legacy software systems
          </p>
          <div className="flex gap-4">
            <Button
              className="bg-yellow-800 hover:bg-yellow-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => navigate('/repository')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>

            <Button
              className="bg-inherit text-muted-foreground hover:bg-yellow-800 hover:text-foreground backdrop-blur-sm transition-all duration-300"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {analysis.isAnalyzing && (
        <Card className="bg-[#161B22] border-[#30363D] border-l-4 border-l-[#F97316]">
          <CardContent className="flex items-center gap-4 py-4 px-6">
            <Loader2 className="h-5 w-5 animate-spin text-[#F97316]" />
            <div className="flex-1">
              <p className="text-[#E6EDF3] font-semibold">Analyzing {analysis.repoName}...</p>
              <p className="text-[#8B949E] text-sm">{analysis.progress}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Area */}
      {!selectedRepository ? (
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-[#F97316] mb-4" />
            <h3 className="text-xl font-semibold text-[#E6EDF3] mb-2">No Repository Selected</h3>
            <p className="text-[#8B949E] text-center mb-6 max-w-md">
              Get started by connecting a GitHub repository to analyze code quality and predict fault-prone modules.
            </p>
            <Button
              className="bg-[#F97316] hover:bg-[#F97316]/90"
              onClick={() => navigate('/repository')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Repository
            </Button>
          </CardContent>
        </Card>
      ) : !selectedRepository.analyzed ? (
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-[#E6EDF3] mb-2">Repository Not Analyzed</h3>
            <p className="text-[#8B949E] text-center mb-6 max-w-md">
              The repository <span className="text-[#F97316] font-semibold">{selectedRepository.name}</span> has been connected but not yet analyzed.
              Click the button below to start the analysis.
            </p>
            <Button
              className="bg-[#F97316] hover:bg-[#F97316]/90"
              onClick={() => navigate('/repository')}
            >
              Go to Repository Page
            </Button>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
        </div>
      )  : (
        <>
          <OverviewCards metrics={metrics} predictions={predictions} />

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <RiskChart predictions={predictions} />
            <ComplexityTrend metrics={metrics} />
          </div>

          {/* Code Churn Analysis */}
          <ChurnAnalysis metrics={metrics} />

          {/* Recent Analysis */}
          <RecentAnalysis metrics={metrics} />
        </>
      )}
    </div>
  );
}