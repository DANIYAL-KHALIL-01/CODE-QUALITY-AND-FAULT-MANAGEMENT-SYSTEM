import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface OverviewCardsProps {
  metrics: any[];
  predictions: any[];
}

export function OverviewCards({ metrics, predictions }: OverviewCardsProps) {
  const totalModules = metrics?.length || 0;
  const highRiskModules = predictions?.filter((p: any) => p.risk_level === 'high' || p.risk_level === 'critical').length || 0;
  const averageComplexity = totalModules > 0
    ? metrics.reduce((sum: number, metric: any) => sum + (metric.cyclomatic_complexity || 0), 0) / totalModules
    : 0;
  const averageMaintainability = totalModules > 0
    ? metrics.reduce((sum: number, metric: any) => sum + (metric.maintainability_index || 0), 0) / totalModules
    : 0;

  const cards = [
    {
      title: 'Total Modules',
      value: totalModules.toString(),
      detail: totalModules > 0 ? 'From the selected repository analysis' : 'No module data available yet',
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      title: 'High Risk Modules',
      value: highRiskModules.toString(),
      detail: highRiskModules > 0 ? 'Flagged by current predictions' : 'No high-risk modules detected',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      title: 'Average Complexity',
      value: averageComplexity > 0 ? averageComplexity.toFixed(1) : '0',
      detail: totalModules > 0 ? 'Calculated from current metrics' : 'Waiting for analysis data',
      icon: TrendingUp,
      color: 'text-yellow-500',
    },
    {
      title: 'Avg Maintainability',
      value: averageMaintainability > 0 ? averageMaintainability.toFixed(1) : '0',
      detail: totalModules > 0 ? 'Calculated from current metrics' : 'Waiting for analysis data',
      icon: CheckCircle,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-[#161B22] border-[#30363D]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8B949E]">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E6EDF3]">{card.value}</div>
            <p className="text-xs text-[#8B949E] mt-1">
              {card.detail}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}