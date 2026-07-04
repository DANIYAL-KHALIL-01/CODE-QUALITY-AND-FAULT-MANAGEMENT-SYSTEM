import { Toaster } from 'sonner';
import { TooltipProvider } from './ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RepositoryProvider } from './context/RepositoryContext';
import { AnalysisProvider } from './context/AnalysisContext';

import { MainLayout } from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Repository from './pages/Repository';
import Metrics from './pages/Metrics';
import TestPrioritization from './pages/TestPrioritization';
import BugReports from './pages/BugReports';
import Recommendations from './pages/Recommendations';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import './App.css';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/repository"
        element={
          <PrivateRoute>
            <MainLayout>
              <Repository />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/metrics"
        element={
          <PrivateRoute>
            <MainLayout>
              <Metrics />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/test-prioritization"
        element={
          <PrivateRoute>
            <MainLayout>
              <TestPrioritization />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/bug-reports"
        element={
          <PrivateRoute>
            <MainLayout>
              <BugReports />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <PrivateRoute>
            <MainLayout>
              <Recommendations />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RepositoryProvider>
            <AnalysisProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
              <Toaster richColors position="top-right" />
            </AnalysisProvider>
          </RepositoryProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}