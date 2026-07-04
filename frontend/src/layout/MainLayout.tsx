import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-hero-pattern animate-fade-in">
      <Sidebar />
      <div className="lg:pl-[280px] transition-all duration-300">
        <Header />
        <main className="p-8 bg-gradient-to-br from-brand-background via-gradient-middle to-brand-secondary max-h-screen">
          <div className="max-w-7xl mx-auto space-y-8 animate-slide-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
