import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface OverviewCardsProps {
  metrics: any[];
  predictions: any[];
}

export function OverviewCards({ metrics, predictions }: OverviewCardsProps) {
  const totalModules = metrics?.length || 0;
  const highRiskModules = predictions?.filter((p: any) => p.risk_level === 'high' || p.risk_level === 'critical').length || 0;
  const analyzedRepos = 1; // Since this is for a single selected repository
  const totalRepos = 1;

  const cards = [
    {
      title: 'Total Modules',
      value: totalModules.toString(),
      change: '+12%',
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      title: 'High Risk Modules',
      value: highRiskModules.toString(),
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      title: 'Analyzed Repositories',
      value: `${analyzedRepos}/${totalRepos}`,
      change: '+8%',
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Average Complexity',
      value: totalModules > 0 ? ((highRiskModules / totalModules) * 100).toFixed(1) : '0',
      change: '+3%',
      icon: TrendingUp,
      color: 'text-yellow-500',
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
              <span className="text-green-500">{card.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}