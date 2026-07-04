import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Github, GitBranch, Upload, Link as LinkIcon, Loader2, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { useRepositoryContext } from '../context/RepositoryContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useRepositories } from '../hooks/useApi';
import { toast } from 'sonner';
import { api } from '../lib/api';

export default function Repository() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [analyzingRepoId, setAnalyzingRepoId] = useState<number | null>(null);
  const [deletingRepoId, setDeletingRepoId] = useState<number | null>(null);
  
  const { repositories, refreshRepositories } = useRepositoryContext();
  const { connectRepository } = useRepositories();
  const { startAnalysis, isAnalyzing } = useAnalysis();

  const handleConnectRepository = async () => {
    if (!repoUrl.trim()) {
      toast.error('Please enter a repository URL');
      return;
    }

    setIsConnecting(true);
    const result = await connectRepository(repoUrl);
    setIsConnecting(false);

    if (result.success) {
      toast.success('Repository connected successfully!');
      setRepoUrl('');
      await refreshRepositories();
    } else {
      toast.error(result.error || 'Failed to connect repository');
    }
  };

  const handleAnalyzeRepository = async (repoId: number, repoName: string) => {
    setAnalyzingRepoId(repoId);
    await startAnalysis(repoId, repoName);
    setAnalyzingRepoId(null);
    await refreshRepositories();
  };

  const handleDeleteRepository = async (repoId: number) => {
    if (!confirm('Are you sure you want to delete this repository? This will remove all associated data.')) {
      return;
    }

    setDeletingRepoId(repoId);
    
    const result = await api.deleteRepository(repoId);
    
    if (result.error) {
      toast.error(result.error || 'Failed to delete repository');
    } else {
      toast.success('Repository deleted successfully!');
      await refreshRepositories();
    }
    
    setDeletingRepoId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">Repository Connection</h1>
        <p className="text-[#8B949E]">Connect your repositories for automated analysis</p>
      </div>

      {/* Connection Methods */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Add New Repository</CardTitle>
          <CardDescription className="text-[#8B949E]">
            Choose a method to connect your repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#0D1117]">
              <TabsTrigger value="url" className="data-[state=active]:bg-[#F97316]">
                <LinkIcon className="h-4 w-4 mr-2" />
                Repository URL
              </TabsTrigger>
              <TabsTrigger value="oauth" className="data-[state=active]:bg-[#F97316]">
                <Github className="h-4 w-4 mr-2" />
                OAuth
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-[#F97316]">
                <Upload className="h-4 w-4 mr-2" />
                File Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="repo-url" className="text-[#E6EDF3]">
                  Repository URL
                </Label>
                <Input
                  id="repo-url"
                  placeholder="https://github.com/username/repository"
                  className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConnectRepository()}
                />
              </div>
              <Button 
                className="w-full bg-[#F97316] hover:bg-[#F97316]/90"
                onClick={handleConnectRepository}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect & Analyze Repository'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="oauth" className="space-y-4 mt-6">
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto p-4 border-[#30363D] hover:bg-[#0D1117]"
                  disabled
                >
                  <Github className="h-8 w-8" />
                  <div className="text-left">
                    <p className="font-medium text-[#E6EDF3]">Connect with GitHub</p>
                    <p className="text-sm text-[#8B949E]">
                      Coming soon - OAuth integration
                    </p>
                  </div>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-6">
              <div className="border-2 border-dashed border-[#30363D] rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-[#8B949E] mb-4" />
                <p className="text-[#E6EDF3] font-medium mb-2">
                  File upload coming soon
                </p>
                <p className="text-sm text-[#8B949E]">
                  This feature is under development
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Connected Repositories */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Connected Repositories</CardTitle>
          <CardDescription className="text-[#8B949E]">
            Manage your connected repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {repositories.length === 0 ? (
            <div className="text-center py-8 text-[#8B949E]">
              No repositories connected yet. Add one above to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {repositories.map((repo: any) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0D1117] border border-[#30363D]"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <GitBranch className="h-5 w-5 text-[#8B949E]" />
                    <div className="flex-1">
                      <p className="font-medium text-[#E6EDF3]">{repo.name}</p>
                      <p className="text-sm text-[#8B949E] truncate">{repo.url}</p>
                      {repo.created_at && (
                        <p className="text-xs text-[#8B949E] mt-1">
                          Added: {format(new Date(repo.created_at), 'MMM dd, yyyy HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        repo.analyzed
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }
                    >
                      {repo.analyzed ? 'Analyzed' : 'Pending'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#30363D] hover:bg-[#0D1117]"
                      onClick={() => handleAnalyzeRepository(repo.id, repo.name)}
                      disabled={analyzingRepoId === repo.id || isAnalyzing}
                    >
                      {analyzingRepoId === repo.id || isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        repo.analyzed ? 'Re-analyze' : 'Analyze'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/20 hover:bg-red-500/10 text-red-500"
                      onClick={() => handleDeleteRepository(repo.id)}
                      disabled={deletingRepoId === repo.id}
                    >
                      {deletingRepoId === repo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}