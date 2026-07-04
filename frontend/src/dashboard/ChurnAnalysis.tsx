import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface ChurnAnalysisProps {
  metrics: any[];
}

export function ChurnAnalysis({ metrics }: ChurnAnalysisProps) {
  // Find high-churn files (top 5)
  const highChurnFiles = metrics
    .sort((a: any, b: any) => (b.code_churn || 0) - (a.code_churn || 0))
    .slice(0, 5);

  const avgChurn = metrics.length > 0
    ? metrics.reduce((sum: number, m: any) => sum + (m.code_churn || 0), 0) / metrics.length
    : 0;

  return (
    <Card className="bg-[#161B22] border-[#30363D]">
      <CardHeader>
        <CardTitle className="text-[#E6EDF3] flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          High Code Churn Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        {highChurnFiles.length === 0 ? (
          <div className="text-center py-8 text-[#8B949E]">
            No churn data available yet.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-2 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-xs text-[#8B949E]">Average Churn</p>
              <p className="text-lg font-bold text-[#F97316]">{avgChurn.toFixed(0)} lines</p>
            </div>
            <div className="space-y-2 mt-4">
              {highChurnFiles.map((metric: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-[#0D1117] border border-[#30363D] hover:border-[#F97316]/50 transition-colors"
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {metric.code_churn > avgChurn * 2 && (
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#E6EDF3] truncate">
                        {metric.file_path?.split('/').pop()}
                      </p>
                      <p className="text-xs text-[#8B949E] truncate">{metric.file_path}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 ml-2 flex-shrink-0">
                    {metric.code_churn} lines
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
