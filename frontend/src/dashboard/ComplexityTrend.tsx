import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ComplexityTrendProps {
  metrics: any[];
}

export function ComplexityTrend({ metrics = [] }: ComplexityTrendProps) {
  // Get top 10 most complex modules
  const chartData = metrics
    .sort((a, b) => (b.cyclomatic_complexity || 0) - (a.cyclomatic_complexity || 0))
    .slice(0, 10)
    .map((m) => ({
      name: m.file_path?.split('/').pop()?.substring(0, 15) || 'Unknown',
      complexity: m.cyclomatic_complexity || 0,
    }));

  if (chartData.length === 0) {
    return (
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Top Complex Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-[#8B949E]">
            No metrics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#161B22] border-[#30363D]">
      <CardHeader>
        <CardTitle className="text-[#E6EDF3]">Top Complex Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
            <XAxis 
              dataKey="name" 
              stroke="#8B949E" 
              angle={-45} 
              textAnchor="end" 
              height={100}
            />
            <YAxis stroke="#8B949E" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '8px',
                color: '#E6EDF3',
              }}
            />
            <Bar dataKey="complexity" fill="#F97316" name="Complexity" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}