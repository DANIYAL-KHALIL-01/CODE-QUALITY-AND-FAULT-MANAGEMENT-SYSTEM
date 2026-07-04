import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
// import { format } from 'date-fns';
import { GitBranch } from 'lucide-react';

interface RecentAnalysisProps {
  metrics: any[];
}

export function RecentAnalysis({ metrics }: RecentAnalysisProps) {
  // Take the 5 most recent metrics (assuming they are sorted by some criteria)
  const recentMetrics = metrics.slice(0, 5);

  const getRiskBadgeColor = (highRiskCount: number, totalCount: number) => {
    if (totalCount === 0) return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    const riskPercentage = (highRiskCount / totalCount) * 100;
    if (riskPercentage > 50) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (riskPercentage > 25) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-green-500/10 text-green-500 border-green-500/20';
  };

  return (
    <Card className="bg-[#161B22] border-[#30363D]">
      <CardHeader>
        <CardTitle className="text-[#E6EDF3]">Recent Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {recentMetrics.length === 0 ? (
          <div className="text-center py-8 text-[#8B949E]">
            No analyzed files yet. Connect and analyze a repository to see results here.
          </div>
        ) : (
          <div className="space-y-3">
            {recentMetrics.map((metric: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-[#F97316]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GitBranch className="h-5 w-5 text-[#8B949E]" />
                  <div>
                    <p className="font-medium text-[#E6EDF3]">{metric.file_path}</p>
                    <p className="text-sm text-[#8B949E]">
                      {metric.lines_of_code} lines • Complexity: {metric.cyclomatic_complexity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#E6EDF3]">
                      Maintainability: {metric.maintainability_index?.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-xs text-[#8B949E]">
                      Bugs: {metric.bug_count || 0}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getRiskBadgeColor(
                      metric.bug_count || 0,
                      1
                    )}
                  >
                    {metric.bug_count > 0 ? 'High Risk' : 'Low Risk'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}