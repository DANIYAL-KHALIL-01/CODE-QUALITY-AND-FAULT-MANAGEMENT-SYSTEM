import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { LucideIcon } from "lucide-react";


interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({ title, value, description, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <Card className={`bg-card-gradient border-brand-accent hover:shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-fade-in ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-brand-muted">{title}</CardTitle>
        <Icon className="h-4 w-4 text-brand-primary animate-pulse-slow" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-brand-foreground animate-slide-in">{value}</div>
        {description && <p className="text-xs text-brand-muted mt-1">{description}</p>}
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'} animate-fade-in`}>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}% from last week
          </p>
        )}
      </CardContent>
    </Card>
  );
}
