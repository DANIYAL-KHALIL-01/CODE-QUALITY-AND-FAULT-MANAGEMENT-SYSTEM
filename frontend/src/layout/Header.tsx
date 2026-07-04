import { Bell, LogOut } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
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
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative bg-inherit">
                <Bell className="h-5 w-5 text-[#8B949E]" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#F97316] rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-[#161B22] border-[#30363D]">
              <DropdownMenuLabel className="text-[#E6EDF3]">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#30363D]" />
              <DropdownMenuItem className="text-[#8B949E] hover:bg-[#0D1117] hover:text-[#E6EDF3]">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">High-risk module detected</p>
                  <p className="text-xs">AuthenticationService needs attention</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#8B949E] hover:bg-[#0D1117] hover:text-[#E6EDF3]">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Analysis completed</p>
                  <p className="text-xs">legacy-erp-system analysis finished</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#8B949E] hover:bg-[#0D1117] hover:text-[#E6EDF3]">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Test case failed</p>
                  <p className="text-xs">TC003 - User Registration failed</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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