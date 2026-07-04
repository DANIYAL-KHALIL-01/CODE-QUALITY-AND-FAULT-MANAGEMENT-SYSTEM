import { Link, useLocation } from 'react-router-dom';
import { Home, GitBranch, BarChart3, ListChecks, Bug, Lightbulb, Settings, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: GitBranch, label: 'Repository', path: '/repository' },
  { icon: BarChart3, label: 'Code Metrics', path: '/metrics' },
  { icon: ListChecks, label: 'Test Prioritization', path: '/test-prioritization' },
  { icon: Bug, label: 'Bug Reports', path: '/bug-reports' },
  { icon: Lightbulb, label: 'Recommendations', path: '/recommendations' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        className="fixed  z-50 lg:hidden bg-[#f97316] text-black   mt-20 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile (click to close sidebar) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-[#0D1117] border-r border-[#30363D] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >

        {/* Logo & Title */}
        <div className="flex items-center gap-3 pt-10 pb-6 px-6 border-b border-[#30363D] bg-gradient-to-r from-orange-500/10 to-transparent">
      
          <div className="h-15 w-15 rounded-lg bg-gradient-to-br flex items-center justify-center animate-float">
            <img src="src/assets/image.png" alt="Logo" className="h-12 w-12 rounded-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">FaultPredict</h1>
            <p className="text-xs text-gray-400">Test Prioritization</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)} // Close sidebar on mobile
              >
                <Button
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                      : 'text-gray-400 hover:bg-[#161B22] hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#30363D] bg-gradient-to-t from-gray-800/50 to-transparent">
          <div className="text-xs text-gray-400 text-center animate-fade-in">
            <p className="font-medium text-white/80">Version 1.0.0</p>
            <p className="mt-1 text-gray-400/60">© 2025 FaultPredict</p>
          </div>
        </div>
      </aside>
    </>
  );
}
