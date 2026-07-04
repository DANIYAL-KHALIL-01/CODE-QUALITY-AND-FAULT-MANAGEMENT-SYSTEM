import { Badge } from '../ui/badge';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const variants = {
    low: 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20',
    high: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20',
  };

  return (
    <Badge  className={`${variants[level]} ${className}`}>
      {level.toUpperCase()}
    </Badge>
  );
}