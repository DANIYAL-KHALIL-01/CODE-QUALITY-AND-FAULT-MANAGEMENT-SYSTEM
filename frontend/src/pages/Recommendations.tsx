import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { RiskBadge } from '../shared/RiskBadge';
import { Button } from '../ui/button';
import { Download, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useRepositoryContext } from '../context/RepositoryContext';
import { usePredictions, useMetrics } from '../hooks/useApi';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  modules: string[];
}

export default function Recommendations() {
  const { selectedRepository } = useRepositoryContext();
  const { predictions, fetchPredictions, loading: predLoading } = usePredictions(selectedRepository?.id || null);
  const { metrics, fetchMetrics, loading: metricsLoading } = useMetrics(selectedRepository?.id || null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (selectedRepository?.analyzed) {
      fetchPredictions();
      fetchMetrics();
    }
  }, [selectedRepository]);

  // Generate recommendations based on predictions and metrics
  useEffect(() => {
    if (predictions.length > 0 && metrics.length > 0) {
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
          modules: highRiskFiles.slice(0, 5).map((f: any) => f.file_path),
        });
      }

      setRecommendations(recs.length > 0 ? recs : []);
    }
  }, [predictions, metrics]);

  const loading = predLoading || metricsLoading;

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
        <Button className="bg-[#F97316] hover:bg-[#F97316]/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Recommendation Cards */}
      <div className="grid gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <Card key={rec.id} className="bg-[#161B22] border-[#30363D]">
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
                  <Button className="bg-[#F97316] hover:bg-[#F97316]/90">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Done
                  </Button>
                  <Button className="border-[#30363D] hover:bg-[#0D1117]">
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
                No recommendations at this time. Your code looks good!
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
    </div>
  );
}