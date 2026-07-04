import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MetricCard } from '../shared/MetricCard';
import { RiskBadge } from '../shared/RiskBadge';
import { Code, FileCode, TrendingUp, GitCommit, Bug, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useRepositoryContext } from '../context/RepositoryContext';
import { useMetrics } from '../hooks/useApi';

interface Metric {
  id: number;
  file_path?: string;
  cyclomatic_complexity?: number;
  lines_of_code?: number;
  maintainability_index?: number;
  code_churn?: number;
  bug_count?: number;
}

export default function Metrics() {
  const { selectedRepository } = useRepositoryContext();
  const { metrics, loading, fetchMetrics } = useMetrics(selectedRepository?.id || null);

  useEffect(() => {
    if (selectedRepository?.analyzed) {
      fetchMetrics();
    }
  }, [selectedRepository]);

  const getRiskLevel = (complexity: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (complexity >= 30) return 'critical';
    if (complexity >= 20) return 'high';
    if (complexity >= 10) return 'medium';
    return 'low';
  };

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
      <div className="text-center py-12 text-[#8B949E]">
        Repository not analyzed yet. Please analyze it first from the Repository page.
      </div>
    );
  }

  const avgComplexity = metrics.length > 0
    ? metrics.reduce((sum: number, m: Metric) => sum + (m.cyclomatic_complexity || 0), 0) / metrics.length
    : 0;

  const avgLOC = metrics.length > 0
    ? metrics.reduce((sum: number, m: Metric) => sum + (m.lines_of_code || 0), 0) / metrics.length
    : 0;

  const avgChurn = metrics.length > 0
    ? metrics.reduce((sum: number, m: Metric) => sum + (m.code_churn || 0), 0) / metrics.length
    : 0;

  const avgMaintainability = metrics.length > 0
    ? metrics.reduce((sum: number, m: Metric) => sum + (m.maintainability_index || 0), 0) / metrics.length
    : 0;

  const chartData = metrics
    .sort((a: Metric, b: Metric) => (b.cyclomatic_complexity || 0) - (a.cyclomatic_complexity || 0))
    .slice(0, 10)
    .map((m: Metric) => ({
      name: m.file_path?.split('/').pop()?.substring(0, 15) || 'Unknown',
      complexity: m.cyclomatic_complexity || 0,
      loc: (m.lines_of_code || 0) / 100,
      churn: (m.code_churn || 0) * 10,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">Code Metrics</h1>
        <p className="text-[#8B949E]">Analyze code complexity and quality metrics</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Avg Cyclomatic Complexity"
          value={avgComplexity.toFixed(1)}
          description="Lower is better"
          icon={Code}
        />
        <MetricCard
          title="Avg Lines of Code"
          value={avgLOC.toFixed(0)}
          description="Per module"
          icon={FileCode}
        />
        <MetricCard
          title="Avg Maintainability"
          value={avgMaintainability.toFixed(1)}
          description="Higher is better"
          icon={TrendingUp}
        />
        <MetricCard
          title="Avg Code Churn"
          value={avgChurn.toFixed(1)}
          description="Change frequency"
          icon={GitCommit}
        />
      </div>

      {/* Complexity Chart */}
      {chartData.length > 0 && (
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader>
            <CardTitle className="text-[#E6EDF3]">Module Complexity Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="name" stroke="#8B949E" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#8B949E" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161B22',
                    border: '1px solid #30363D',
                    borderRadius: '8px',
                    color: '#E6EDF3',
                  }}
                />
                <Legend wrapperStyle={{ color: '#E6EDF3' }} />
                <Bar dataKey="complexity" fill="#F97316" name="Complexity" />
                <Bar dataKey="loc" fill="#10B981" name="LOC (÷100)" />
                <Bar dataKey="churn" fill="#F59E0B" name="Churn (×10)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Module Breakdown Table */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Module Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <div className="text-center py-8 text-[#8B949E]">
              No metrics data available
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#30363D] hover:bg-[#0D1117]">
                  <TableHead className="text-[#8B949E]">File Path</TableHead>
                  <TableHead className="text-[#8B949E]">Complexity</TableHead>
                  <TableHead className="text-[#8B949E]">LOC</TableHead>
                  <TableHead className="text-[#8B949E]">Maintainability</TableHead>
                  <TableHead className="text-[#8B949E]">Churn</TableHead>
                  <TableHead className="text-[#8B949E]">Bugs</TableHead>
                  <TableHead className="text-[#8B949E]">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric: Metric) => (
                  <TableRow
                    key={metric.id}
                    className="border-[#30363D] hover:bg-[#0D1117]"
                  >
                    <TableCell className="font-medium text-[#E6EDF3] max-w-xs truncate">
                      {metric.file_path}
                    </TableCell>
                    <TableCell className="text-[#8B949E]">
                      {metric.cyclomatic_complexity?.toFixed(1) || '0.0'}
                    </TableCell>
                    <TableCell className="text-[#8B949E]">{metric.lines_of_code || 0}</TableCell>
                    <TableCell className="text-[#8B949E]">
                      {metric.maintainability_index?.toFixed(1) || '0.0'}
                    </TableCell>
                    <TableCell className="text-[#8B949E]">
                      {metric.code_churn || 0}
                    </TableCell>
                    <TableCell>
                      {metric.bug_count && metric.bug_count > 0 ? (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                          <Bug className="h-3 w-3 mr-1" />
                          {metric.bug_count}
                        </Badge>
                      ) : (
                        <span className="text-[#8B949E]">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <RiskBadge level={getRiskLevel(metric.cyclomatic_complexity || 0)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}