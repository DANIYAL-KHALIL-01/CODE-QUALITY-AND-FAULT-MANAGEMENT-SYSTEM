import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MetricCard } from '../shared/MetricCard';
import { RiskBadge } from '../shared/RiskBadge';
import { Bug, CheckCircle, Clock, AlertCircle, Loader2, Eye } from 'lucide-react';
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
import { format } from 'date-fns';
import { useRepositoryContext } from '../context/RepositoryContext';
import { useBugReports } from '../hooks/useApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export default function BugReports() {
  const { selectedRepository } = useRepositoryContext();
  const { bugs, loading, fetchBugs } = useBugReports(selectedRepository?.id || null);
  const [selectedBug, setSelectedBug] = useState<any | null>(null);

  useEffect(() => {
    if (selectedRepository) {
      fetchBugs();
    }
  }, [selectedRepository]);

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

  const totalBugs = bugs.length;
  const resolvedBugs = bugs.filter((b: any) => b.status === 'resolved').length;
  const openBugs = bugs.filter((b: any) => b.status === 'open').length;
  const criticalBugs = bugs.filter((b: any) => b.severity === 'critical').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">Bug Reports</h1>
        <p className="text-[#8B949E]">Historical bug analysis and tracking</p>
      </div>

      {/* Bug Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Bugs" value={totalBugs} icon={Bug} />
        <MetricCard
          title="Resolved"
          value={resolvedBugs}
          description={totalBugs > 0 ? `${((resolvedBugs / totalBugs) * 100).toFixed(0)}% resolution rate` : '0%'}
          icon={CheckCircle}
        />
        <MetricCard title="Open" value={openBugs} icon={Clock} />
        <MetricCard title="Critical" value={criticalBugs} icon={AlertCircle} />
      </div>

      {/* Bug List Table */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Bug Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {bugs.length === 0 ? (
            <div className="text-center py-8 text-[#8B949E]">
              No bug reports available for this repository
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#30363D] hover:bg-[#0D1117]">
                  <TableHead className="text-[#8B949E]">Bug ID</TableHead>
                  <TableHead className="text-[#8B949E]">File Path</TableHead>
                  <TableHead className="text-[#8B949E]">Severity</TableHead>
                  <TableHead className="text-[#8B949E]">Status</TableHead>
                  <TableHead className="text-[#8B949E]">Description</TableHead>
                  <TableHead className="text-[#8B949E]">Reported</TableHead>
                  <TableHead className="text-[#8B949E]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bugs.map((bug: any) => (
                  <TableRow key={bug.id} className="border-[#30363D] hover:bg-[#0D1117]">
                    <TableCell className="font-mono text-[#E6EDF3]">#{bug.id}</TableCell>
                    <TableCell className="text-[#E6EDF3] max-w-xs truncate">
                      {bug.file_path}
                    </TableCell>
                    <TableCell>
                      <RiskBadge level={bug.severity} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          bug.status === 'resolved'
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : bug.status === 'in_progress'
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }
                      >
                        {bug.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#8B949E] max-w-sm">
                      {bug.description || 'N/A'}
                    </TableCell>
                    <TableCell className="text-[#8B949E]">
                      {bug.reported_at 
                        ? format(new Date(bug.reported_at), 'MMM dd, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#30363D] text-[#E6EDF3] hover:bg-[#0D1117]"
                        onClick={() => setSelectedBug(bug)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedBug !== null} onOpenChange={(open) => !open && setSelectedBug(null)}>
        <DialogContent className="bg-[#161B22] border-[#30363D] text-[#E6EDF3] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#E6EDF3]">Bug Report #{selectedBug?.id}</DialogTitle>
            <DialogDescription className="text-[#8B949E]">
              Full finding generated by the repository analysis system.
            </DialogDescription>
          </DialogHeader>

          {selectedBug && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8B949E]">File Path</p>
                  <p className="mt-1 break-all font-mono text-sm text-[#E6EDF3]">{selectedBug.file_path}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8B949E]">Severity</p>
                  <div className="mt-1"><RiskBadge level={selectedBug.severity} /></div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8B949E]">Status</p>
                  <p className="mt-1 text-sm text-[#E6EDF3]">{selectedBug.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#8B949E]">Reported</p>
                  <p className="mt-1 text-sm text-[#E6EDF3]">
                    {selectedBug.reported_at
                      ? format(new Date(selectedBug.reported_at), 'MMM dd, yyyy HH:mm')
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#8B949E]">System Finding</p>
                <p className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-[#30363D] bg-[#0D1117] p-4 text-sm leading-6 text-[#E6EDF3]">
                  {selectedBug.description || 'No description was provided by the analysis system.'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}