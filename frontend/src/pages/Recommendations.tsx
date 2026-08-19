import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { RiskBadge } from '../shared/RiskBadge';
import { Button } from '../ui/button';
import { Download, CheckCircle2, Loader2, AlertCircle, Eye, RotateCcw } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useRepositoryContext } from '../context/RepositoryContext';
import { usePredictions, useMetrics } from '../hooks/useApi';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  action: string;
  modules: string[];
}

export default function Recommendations() {
  const { selectedRepository } = useRepositoryContext();
  const { predictions, fetchPredictions, loading: predLoading } = usePredictions(selectedRepository?.id || null);
  const { metrics, fetchMetrics, loading: metricsLoading } = useMetrics(selectedRepository?.id || null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  const toggleRecommendation = (recommendationId: string) => {
    setCompletedRecommendations((completed) => {
      const next = new Set(completed);
      if (next.has(recommendationId)) {
        next.delete(recommendationId);
        toast.info('Recommendation marked as active');
      } else {
        next.add(recommendationId);
        toast.success('Recommendation marked as done');
      }
      return next;
    });
  };

  const exportReport = () => {
    if (recommendations.length === 0) {
      toast.info('There are no recommendations to export');
      return;
    }

    const report = {
      repository: selectedRepository?.name,
      generatedAt: new Date().toISOString(),
      recommendations: recommendations.map((recommendation) => ({
        ...recommendation,
        status: completedRecommendations.has(recommendation.id) ? 'done' : 'open',
      })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRepository?.name || 'repository'}-recommendations.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Recommendation report exported');
  };

  useEffect(() => {
    if (selectedRepository?.analyzed) {
      fetchPredictions();
      fetchMetrics();
    }
  }, [selectedRepository, fetchPredictions, fetchMetrics]);

  // Generate recommendations based on predictions and metrics
  useEffect(() => {
    if (predictions.length > 0 || metrics.length > 0) {
      const recs: Recommendation[] = [];

      // Find critical risk files
      const criticalFiles = predictions.filter((p: any) => p.risk_level === 'critical');
      if (criticalFiles.length > 0) {
        recs.push({
          id: 'critical-refactor',
          title: 'Refactor Critical Risk Modules',
          description: `${criticalFiles.length} module(s) have critical fault probability. Prioritize refactoring these.`,
          priority: 'critical',
          impact: 'Reduces production defects by up to 40%',
          action: 'Inspect the listed modules, split complex functions, and add focused regression tests before changing behavior.',
          modules: criticalFiles.slice(0, 5).map((f: any) => f.file_path),
        });
      }

      // Find high complexity files
      const highComplexity = metrics.filter((m: any) => m.cyclomatic_complexity > 15);
      if (highComplexity.length > 0) {
        recs.push({
          id: 'complexity-reduction',
          title: 'Reduce Code Complexity',
          description: `${highComplexity.length} file(s) have high cyclomatic complexity (>15). Break them into smaller functions.`,
          priority: 'high',
          impact: 'Improves maintainability and reduces bugs by 25%',
          action: 'Break the highest-complexity functions into smaller units and cover each branch with tests.',
          modules: highComplexity.slice(0, 5).map((m: any) => m.file_path),
        });
      }

      // Find low maintainability files
      const lowMaintainability = metrics.filter((m: any) => m.maintainability_index < 50);
      if (lowMaintainability.length > 0) {
        recs.push({
          id: 'maintainability-improve',
          title: 'Improve Code Maintainability',
          description: `${lowMaintainability.length} file(s) have low maintainability index (<50). Add documentation and refactor.`,
          priority: 'medium',
          impact: 'Improves team productivity by 20%',
          action: 'Document the module responsibilities, remove duplication, and refactor the least maintainable functions first.',
          modules: lowMaintainability.slice(0, 5).map((m: any) => m.file_path),
        });
      }

      // High risk files that need test coverage
      const highRiskFiles = predictions.filter((p: any) => p.fault_probability > 0.6);
      if (highRiskFiles.length > 0) {
        recs.push({
          id: 'test-coverage',
          title: 'Increase Test Coverage for High-Risk Files',
          description: `${highRiskFiles.length} file(s) have high fault probability (>0.6). Ensure 90%+ test coverage.`,
          priority: 'high',
          impact: 'Catches 60% more bugs before production',
          action: 'Add or strengthen automated tests for the listed files, starting with the files with the highest fault probability.',
          modules: highRiskFiles.slice(0, 5).map((f: any) => f.file_path),
        });
      }

      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }
  }, [predictions, metrics]);

  const loading = predLoading || metricsLoading;
  const orderedRecommendations = [...recommendations].sort((first, second) => {
    const firstCompleted = completedRecommendations.has(first.id) ? 1 : 0;
    const secondCompleted = completedRecommendations.has(second.id) ? 1 : 0;
    return firstCompleted - secondCompleted;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  if (!selectedRepository) {
    return (
      <div className="text-center py-12 text-[#8B949E]">
        Please select a repository from the Repository page
      </div>
    );
  }

  if (!selectedRepository.analyzed) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="bg-[#161B22] border-[#30363D] max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-[#E6EDF3] mb-2">Repository Not Analyzed</h3>
            <p className="text-[#8B949E] text-center">
              Analyze the repository first to generate recommendations.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">Recommendations</h1>
          <p className="text-[#8B949E]">AI-powered testing and refactoring suggestions based on analysis</p>
        </div>
        <Button
          className="bg-[#F97316] hover:bg-[#F97316]/90"
          onClick={exportReport}
          disabled={recommendations.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Recommendation Cards */}
      <div className="grid gap-6">
        {orderedRecommendations.length > 0 ? (
          orderedRecommendations.map((rec) => (
            <Card
              key={rec.id}
              className={`bg-[#161B22] border-[#30363D] ${completedRecommendations.has(rec.id) ? 'opacity-60' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-[#E6EDF3]">{rec.title}</CardTitle>
                      <RiskBadge level={rec.priority} />
                    </div>
                    <CardDescription className="text-[#8B949E]">
                      {rec.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Impact */}
                <div className="p-4 bg-[#0D1117] rounded-lg border border-[#30363D]">
                  <p className="text-sm font-medium text-[#E6EDF3] mb-1">Expected Impact</p>
                  <p className="text-sm text-[#8B949E]">{rec.impact}</p>
                </div>

                {/* Affected Modules */}
                <div>
                  <p className="text-sm font-medium text-[#E6EDF3] mb-2">Affected Modules</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.modules.map((module) => (
                      <Badge
                        key={module}
                        className="bg-[#0D1117] border-[#30363D] text-[#8B949E]"
                      >
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="bg-[#F97316] hover:bg-[#F97316]/90"
                    onClick={() => toggleRecommendation(rec.id)}
                  >
                    {completedRecommendations.has(rec.id) ? (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    {completedRecommendations.has(rec.id) ? 'Reopen' : 'Mark as Done'}
                  </Button>
                  <Button
                    className="border-[#30363D] text-[#E6EDF3] hover:bg-[#0D1117]"
                    onClick={() => setSelectedRecommendation(rec)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-[#161B22] border-[#30363D]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-16 w-16 text-[#8B949E] mb-4" />
              <p className="text-[#8B949E]">
                No recommendations generated for this repository yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">Total Files</p>
              <p className="text-2xl font-bold text-[#F97316] mt-1">{metrics.length}</p>
            </div>
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">Critical Risk</p>
              <p className="text-2xl font-bold text-red-500 mt-1">
                {predictions.filter((p: any) => p.risk_level === 'critical').length}
              </p>
            </div>
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">High Complexity</p>
              <p className="text-2xl font-bold text-yellow-500 mt-1">
                {metrics.filter((m: any) => m.cyclomatic_complexity > 15).length}
              </p>
            </div>
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">Recommendations</p>
              <p className="text-2xl font-bold text-[#F97316] mt-1">{recommendations.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={selectedRecommendation !== null}
        onOpenChange={(open) => !open && setSelectedRecommendation(null)}
      >
        <DialogContent className="bg-[#161B22] border-[#30363D] text-[#E6EDF3] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#E6EDF3]">{selectedRecommendation?.title}</DialogTitle>
            <DialogDescription className="text-[#8B949E]">
              Recommendation generated from the selected repository&apos;s analysis results.
            </DialogDescription>
          </DialogHeader>

          {selectedRecommendation && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <RiskBadge level={selectedRecommendation.priority} />
                <Badge className="bg-[#0D1117] border-[#30363D] text-[#8B949E]">
                  {completedRecommendations.has(selectedRecommendation.id) ? 'Done' : 'Open'}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8B949E]">Why this was recommended</p>
                <p className="mt-2 text-sm leading-6 text-[#E6EDF3]">{selectedRecommendation.description}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8B949E]">What to do</p>
                <p className="mt-2 rounded-lg border border-[#30363D] bg-[#0D1117] p-4 text-sm leading-6 text-[#E6EDF3]">
                  {selectedRecommendation.action}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8B949E]">Affected modules</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedRecommendation.modules.map((module) => (
                    <Badge key={module} className="bg-[#0D1117] border-[#30363D] text-[#8B949E]">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#8B949E]">Expected impact</p>
                <p className="mt-2 text-sm text-[#E6EDF3]">{selectedRecommendation.impact}</p>
              </div>
              <Button
                className="bg-[#F97316] hover:bg-[#F97316]/90"
                onClick={() => toggleRecommendation(selectedRecommendation.id)}
              >
                {completedRecommendations.has(selectedRecommendation.id) ? 'Reopen Recommendation' : 'Mark as Done'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}