import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MetricCard } from '../shared/MetricCard';
import { RiskBadge } from '../shared/RiskBadge';
import { Bug, CheckCircle, Clock, AlertCircle, Loader2, Eye, Download, Trash2, Plus } from 'lucide-react';
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
import { useRepositoryContext } from '../context/RepositoryContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useBugReports } from '../hooks/useApi';
import { formatPakistanDate, formatPakistanDateTime } from '../lib/dateTime';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export default function BugReports() {
  const { selectedRepository } = useRepositoryContext();
  const { bugs, loading, fetchBugs, addBug, deleteBug } = useBugReports(selectedRepository?.id || null);
  const { bugImport, startBugImport } = useAnalysis();
  const [selectedBug, setSelectedBug] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBug, setNewBug] = useState({ file_path: '', title: '', description: '', severity: 'medium' });

  useEffect(() => {
    if (selectedRepository) {
      fetchBugs();
    }
  }, [selectedRepository]);

  const handleAddBug = async () => {
    if (!newBug.file_path.trim() || !newBug.description.trim()) {
      toast.error('File path and description are required');
      return;
    }
    const result = await addBug(newBug);
    if (result.success) {
      setNewBug({ file_path: '', title: '', description: '', severity: 'medium' });
      setShowAddForm(false);
      await fetchBugs();
      toast.success('Manual bug report added');
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteBug = async (bugId: number) => {
    if (!window.confirm('Delete this bug report?')) return;
    const result = await deleteBug(bugId);
    if (result.error) toast.error(result.error);
    else {
      await fetchBugs();
      toast.success('Bug report deleted');
    }
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

  const totalBugs = bugs.length;
  const resolvedBugs = bugs.filter((b: any) => b.status === 'resolved').length;
  const openBugs = bugs.filter((b: any) => b.status === 'open').length;
  const criticalBugs = bugs.filter((b: any) => b.severity === 'critical').length;
  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const orderedBugs = [...bugs].sort(
    (first: any, second: any) =>
      (severityOrder[first.severity] ?? 4) - (severityOrder[second.severity] ?? 4)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">Bug Reports</h1>
        <p className="text-[#8B949E]">Historical bug analysis and tracking</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setShowAddForm((visible) => !visible)} className="bg-[#F97316] hover:bg-[#F97316]/90">
          <Plus className="h-4 w-4 mr-2" /> Manual Bug
        </Button>
        <Button variant="outline" disabled={bugImport.isImporting} onClick={() => startBugImport(selectedRepository.id, selectedRepository.name, 'issues')}>
          <Download className="h-4 w-4 mr-2" /> Import GitHub Issues
        </Button>
        <Button variant="outline" disabled={bugImport.isImporting} onClick={() => startBugImport(selectedRepository.id, selectedRepository.name, 'commits')}>
          <Download className="h-4 w-4 mr-2" /> Import Bug-Fixing Commits
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-[#161B22] border-[#30363D]">
          <CardHeader><CardTitle className="text-[#E6EDF3]">Add Manual Bug Report</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input placeholder="File path, e.g. src/auth.py" value={newBug.file_path} onChange={(e) => setNewBug({ ...newBug, file_path: e.target.value })} />
            <Input placeholder="Bug title" value={newBug.title} onChange={(e) => setNewBug({ ...newBug, title: e.target.value })} />
            <select className="rounded-md border border-[#30363D] bg-[#0D1117] p-2 text-[#E6EDF3]" value={newBug.severity} onChange={(e) => setNewBug({ ...newBug, severity: e.target.value })}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
            <Input placeholder="Description" value={newBug.description} onChange={(e) => setNewBug({ ...newBug, description: e.target.value })} />
            <Button onClick={handleAddBug} className="bg-[#F97316] hover:bg-[#F97316]/90 md:col-span-2">Save Bug Report</Button>
          </CardContent>
        </Card>
      )}

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
                {orderedBugs.map((bug: any) => (
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
                      <span
                        className="block max-w-sm truncate"
                        title={bug.description || 'N/A'}
                      >
                        {bug.description || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#8B949E]">
                      {bug.reported_at 
                        ? formatPakistanDate(bug.reported_at)
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2"><Button
                        variant="outline"
                        size="sm"
                        className="border-[#30363D] text-[#E6EDF3] hover:bg-[#0D1117]"
                        onClick={() => setSelectedBug(bug)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button><Button variant="outline" size="sm" className="border-red-500/20 text-red-500" onClick={() => handleDeleteBug(bug.id)}><Trash2 className="h-4 w-4" /></Button></div>
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
                      ? formatPakistanDateTime(selectedBug.reported_at)
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