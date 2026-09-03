import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RiskBadge } from '../shared/RiskBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Download, Loader2, RefreshCw, Radio, AlertCircle } from 'lucide-react';
import { useRepositoryContext } from '../context/RepositoryContext';
import { useTestPrioritization, usePredictions, useChanges, useImpactedTests } from '../hooks/useApi';
import { toast } from 'sonner';

export default function TestPrioritization() {
  const { selectedRepository } = useRepositoryContext();
  const { tests, loading, fetchTests, prioritizeTests } = useTestPrioritization(selectedRepository?.id || null);
  const { predictions, fetchPredictions } = usePredictions(selectedRepository?.id || null);
  const { changes, fetchChanges } = useChanges(selectedRepository?.id || null);
  const { impactedTests, totalImpacted, fetchImpactedTests } = useImpactedTests(selectedRepository?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (selectedRepository?.analyzed) {
      fetchTests();
      fetchPredictions();
      fetchChanges();
      fetchImpactedTests();
    }
  }, [selectedRepository, fetchTests, fetchPredictions, fetchChanges, fetchImpactedTests]);

  useEffect(() => {
    if (!isMonitoring || !selectedRepository?.analyzed) return;

    const refreshPriority = async () => {
      await prioritizeTests([]);
      await fetchTests();
      await fetchPredictions();
    };

    const monitorTimer = window.setInterval(() => {
      refreshPriority();
    }, 15000);

    return () => window.clearInterval(monitorTimer);
  }, [isMonitoring, selectedRepository, prioritizeTests, fetchTests, fetchPredictions]);

  const handlePrioritize = async () => {
    if (!selectedRepository?.analyzed) return;

    setIsPrioritizing(true);
    const result = await prioritizeTests([]);
    if (result.success) {
      await fetchTests();
      await fetchPredictions();
      toast.success('Tests reprioritized using the latest ML analysis');
    } else {
      toast.error(result.error || 'Unable to prioritize tests');
    }
    setIsPrioritizing(false);
  };

  const exportPrioritizedTests = () => {
    if (prioritizedTests.length === 0) {
      toast.info('There are no prioritized regression targets to export');
      return;
    }

    const escapeCsvValue = (value: unknown) => {
      const text = String(value ?? '');
      return `"${text.replace(/"/g, '""')}"`;
    };
    const rows = prioritizedTests.map((test: any, index: number) => {
      const riskLevel = predictions.find(
        (prediction: any) => prediction.file_path === test.file_path
      )?.risk_level || 'unknown';
      return [
        index + 1,
        test.name,
        test.file_path,
        riskLevel,
        test.priority_score?.toFixed(2) || '0.00',
        test.failure_count ?? 0,
        test.execution_time ?? 'N/A',
      ].map(escapeCsvValue).join(',');
    });
    const csv = [
      'Priority,Regression Target,File Path,ML Risk,Priority Score,Historical Failures,Estimated Execution Time',
      ...rows,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRepository?.name || 'repository'}-regression-priorities.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Regression priority report exported');
  };

  const riskOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const prioritizedTests = [...tests].sort((first: any, second: any) => {
    const firstRisk = predictions.find((prediction: any) => prediction.file_path === first.file_path)?.risk_level || 'low';
    const secondRisk = predictions.find((prediction: any) => prediction.file_path === second.file_path)?.risk_level || 'low';
    const riskDifference = (riskOrder[firstRisk] ?? 4) - (riskOrder[secondRisk] ?? 4);

    if (riskDifference !== 0) return riskDifference;
    return (second.priority_score || 0) - (first.priority_score || 0);
  });

  const filteredTests = prioritizedTests.filter((test: any) =>
    test.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const changedFiles = changes?.changed_files || [];
  const highRiskTests = prioritizedTests.filter((test: any) => {
    const risk = predictions.find((prediction: any) => prediction.file_path === test.file_path)?.risk_level;
    return risk === 'high' || risk === 'critical';
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
      <div className="text-center py-12 text-[#8B949E]">
        Analyze the repository first to generate and prioritize its test targets.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">Test Case Prioritization</h1>
        <p className="text-[#8B949E]">ML-ranked regression targets based on risk, failures, and execution cost</p>
      </div>

      {/* Change Detection Alert */}
      {changes?.needs_reanalysis && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">Repository Changes Detected</h3>
              <p className="text-amber-200/80 text-sm mb-2">
                {changes?.changed_file_count} file(s) changed since last analysis. 
                {totalImpacted > 0 && ` ${totalImpacted} test(s) are affected.`}
              </p>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  toast.info('Reanalyze repository to detect all changes');
                }}
              >
                Re-analyze Repository
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Impacted Tests Section */}
      {totalImpacted > 0 && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Tests Impacted by Recent Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-300 mb-4">
              {totalImpacted} of {tests.length} tests are directly affected by changes
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {impactedTests.map((test: any, idx: number) => (
                <div key={idx} className="p-3 bg-[#0D1117] rounded border border-red-500/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-red-300 font-medium text-sm">{test.name}</p>
                      <p className="text-red-200/60 text-xs mt-1">{test.path}</p>
                      {test.covered_modules?.length > 0 && (
                        <p className="text-red-200/40 text-xs mt-1">
                          Covers: {test.covered_modules.join(', ')}
                        </p>
                      )}
                    </div>
                    <RiskBadge level={test.priority_score > 0.6 ? 'high' : test.priority_score > 0.3 ? 'medium' : 'low'} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Manual Regression Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-[#8B949E]">Perform these checks manually, starting with high-risk targets and files changed since the last analysis.</p>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-2">High-risk regression targets ({highRiskTests.length})</p>
            {highRiskTests.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-[#FCA5A5]">{highRiskTests.map((test: any) => <li key={`risk-${test.id}`}>{test.name} ({test.file_path})</li>)}</ul>
            ) : <p className="text-[#8B949E]">No high-risk test targets found.</p>}
          </div>
          <div>
            <p className="font-medium text-[#E6EDF3] mb-2">Changed source files ({changedFiles.length})</p>
            {changedFiles.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-amber-300">{changedFiles.map((file: string) => <li key={`changed-${file}`}>{file}</li>)}</ul>
            ) : <p className="text-[#8B949E]">No files changed since the last analysis.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
                <Input
                  placeholder="Search test cases..."
                  className="pl-10 bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="bg-[#F97316] hover:bg-[#F97316]/90"
              onClick={exportPrioritizedTests}
              disabled={prioritizedTests.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-[#30363D] text-[#E6EDF3] hover:bg-[#0D1117]"
              onClick={handlePrioritize}
              disabled={isPrioritizing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isPrioritizing ? 'animate-spin' : ''}`} />
              {isPrioritizing ? 'Prioritizing...' : 'Prioritize Now'}
            </Button>
            <Button
              variant="outline"
              className={isMonitoring
                ? 'border-green-500/40 text-green-400 hover:bg-green-500/10'
                : 'border-[#30363D] text-[#E6EDF3] hover:bg-[#0D1117]'}
              onClick={() => setIsMonitoring((monitoring) => !monitoring)}
            >
              <Radio className="h-4 w-4 mr-2" />
              {isMonitoring ? 'Monitoring On' : 'Monitor Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Priority Algorithm Info */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Priority Algorithm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#8B949E] mb-4">
            Test cases are prioritized using a multi-factor algorithm considering:
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">Code Complexity</p>
              <p className="text-xs text-[#8B949E] mt-1">Cyclomatic complexity score</p>
            </div>
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">Fault Probability</p>
              <p className="text-xs text-[#8B949E] mt-1">ML-predicted fault likelihood</p>
            </div>
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">Code Churn</p>
              <p className="text-xs text-[#8B949E] mt-1">Frequency of changes</p>
            </div>
            <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
              <p className="text-sm font-medium text-[#E6EDF3]">Execution Time</p>
              <p className="text-xs text-[#8B949E] mt-1">Test efficiency factor</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Table */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Prioritized Regression Targets</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTests.length === 0 ? (
            <div className="text-center py-8 text-[#8B949E]">
              {tests.length === 0 
                ? 'No test cases available. Generate predictions first.'
                : 'No test cases match your search.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#30363D] hover:bg-[#0D1117]">
                  <TableHead className="text-[#8B949E]">Priority</TableHead>
                  <TableHead className="text-[#8B949E]">Test Name</TableHead>
                  <TableHead className="text-[#8B949E]">File Path</TableHead>
                  <TableHead className="text-[#8B949E]">Priority Score</TableHead>
                  <TableHead className="text-[#8B949E]">ML Risk</TableHead>
                  <TableHead className="text-[#8B949E]">Failures</TableHead>
                  <TableHead className="text-[#8B949E]">Exec Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test: any, index: number) => (
                  <TableRow
                    key={test.id}
                    className="border-[#30363D] hover:bg-[#0D1117]"
                  >
                    <TableCell>
                      <Badge className="bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20">
                        #{index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#E6EDF3] max-w-xs">{test.name}</TableCell>
                    <TableCell className="text-[#8B949E] max-w-xs truncate">
                      {test.file_path || 'N/A'}
                    </TableCell>
                    <TableCell className="text-[#8B949E]">
                      {test.priority_score?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const riskLevel = predictions.find(
                          (prediction: any) => prediction.file_path === test.file_path
                        )?.risk_level;
                        return riskLevel === 'low' || riskLevel === 'medium' || riskLevel === 'high' || riskLevel === 'critical' ? (
                          <RiskBadge level={riskLevel} />
                        ) : (
                          <Badge className="bg-[#0D1117] border-[#30363D] text-[#8B949E]">
                            UNKNOWN
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-[#8B949E]">
                      {test.failure_count ?? 0}
                    </TableCell>
                    <TableCell className="text-[#8B949E]">
                      {test.execution_time ? `${test.execution_time}s` : 'N/A'}
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