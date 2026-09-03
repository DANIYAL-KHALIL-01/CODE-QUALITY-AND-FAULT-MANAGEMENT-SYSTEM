import { Check, ChevronDown, GitBranch, Loader2, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '../context/AuthContext';
import { useRepositoryContext } from '../context/RepositoryContext';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';

export function Header() {
  const { user, logout } = useAuth();
  const { repositories, selectedRepository, setSelectedRepository } = useRepositoryContext();
  const { bugImport } = useAnalysis();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0D1117] border-b border-[#30363D] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="pl-55 flex-1">
          <h2 className="pl-50 text-xl font-semibold text-[#E6EDF3]">Fault Prediction Dashboard</h2>
          <p className="text-sm text-[#8B949E]">Monitor and prioritize your test cases</p>
        </div>

        <div className="flex items-center gap-4">
          {bugImport.isImporting && (
            <div className="flex items-center gap-2 text-sm text-[#F97316]" role="status">
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing {bugImport.source === 'issues' ? 'GitHub issues' : 'bug-fixing commits'}...
            </div>
          )}
          {repositories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  aria-label={`Switch repository. Current repository: ${selectedRepository?.name || 'none selected'}`}
                  title="Switch repository"
                  className="max-w-[280px] gap-2 border-[#30363D] text-[#E6EDF3] hover:bg-[#161B22]"
                >
                  <GitBranch className="h-4 w-4 shrink-0 text-[#F97316]" />
                  <span className="truncate">{selectedRepository?.name || 'Select repository'}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#8B949E]" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 bg-[#161B22] border-[#30363D]">
                <DropdownMenuLabel className="text-[#E6EDF3]">Switch Repository</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#30363D]" />
                {repositories.map((repository) => (
                  <DropdownMenuItem
                    key={repository.id}
                    className="cursor-pointer text-[#8B949E] hover:bg-[#0D1117] hover:text-[#E6EDF3]"
                    onClick={() => setSelectedRepository(repository)}
                  >
                    <GitBranch className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{repository.owner}/{repository.name}</span>
                    {repository.id === selectedRepository?.id && <Check className="ml-auto h-4 w-4 text-[#F97316]" aria-label="Selected" />}
                    {repository.id !== selectedRepository?.id && repository.analyzed && <span className="ml-auto text-xs text-green-400">Ready</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-inherit">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-white bg-[#f97316]">
                    {getInitials(user?.full_name || user?.username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[#E6EDF3] hidden md:inline">
                  {user?.full_name || user?.username || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#161B22] border-[#30363D]">
              <DropdownMenuLabel className="text-[#E6EDF3]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#30363D]" />
              <DropdownMenuItem 
                className="text-[#8B949E] hover:bg-[#0D1117] hover:text-[#E6EDF3] cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#30363D]" />
              <DropdownMenuItem 
                className="text-[#8B949E] hover:bg-[#0D1117] hover:text-[#E6EDF3] cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}