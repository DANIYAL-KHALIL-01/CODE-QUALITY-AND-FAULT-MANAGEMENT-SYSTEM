import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RiskChartProps {
  predictions: any[];
}

export function RiskChart({ predictions = [] }: RiskChartProps) {
  // Calculate risk distribution
  const riskDistribution = predictions.reduce((acc, pred) => {
    const level = pred.risk_level || 'low';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { name: 'Low', value: riskDistribution.low || 0, color: '#10B981' },
    { name: 'Medium', value: riskDistribution.medium || 0, color: '#F59E0B' },
    { name: 'High', value: riskDistribution.high || 0, color: '#F97316' },
    { name: 'Critical', value: riskDistribution.critical || 0, color: '#EF4444' },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-[#8B949E]">
            No prediction data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#161B22] border-[#30363D]">
      <CardHeader>
        <CardTitle className="text-[#E6EDF3]">Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '8px',
                color: '#E6EDF3',
              }}
            />
            <Legend wrapperStyle={{ color: '#E6EDF3' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}