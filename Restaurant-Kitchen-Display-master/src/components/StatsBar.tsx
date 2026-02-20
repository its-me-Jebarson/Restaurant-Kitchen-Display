import { DollarSign, Clock, CheckCircle2, ArrowDownUp, AlertTriangle, TrendingUp } from "lucide-react";

interface StatsBarProps {
  stats: {
    totalIncome: number;
    avgPrep: string;
    completed: number;
    active: number;
    delayed: number;
    peak: string;
    efficiency: number;
  };
}

const StatCard = ({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) => (
  <div className="flex flex-col items-center gap-1.5 rounded-xl bg-kds-stat-bg border border-border/50 px-5 py-4 min-w-[130px] transition-all hover:shadow-glow-accent hover:border-accent/30">
    <Icon className={`h-5 w-5 ${color}`} />
    <span className="font-mono text-2xl font-bold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
  </div>
);

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <StatCard icon={DollarSign} value={`$${stats.totalIncome.toLocaleString()}`} label="Today's Income" color="text-kds-income" />
      <StatCard icon={Clock} value={stats.avgPrep} label="Avg Prep" color="text-kds-prep" />
      <StatCard icon={CheckCircle2} value={stats.completed.toString()} label="Completed" color="text-kds-ready" />
      <StatCard icon={ArrowDownUp} value={stats.active.toString()} label="Active" color="text-kds-warning" />
      <StatCard icon={AlertTriangle} value={stats.delayed.toString()} label="Delayed" color="text-kds-delayed" />
      <StatCard icon={Clock} value={stats.peak} label="Peak" color="text-foreground" />
      <StatCard icon={TrendingUp} value={`${stats.efficiency}%`} label="Efficiency" color="text-kds-ready" />
    </div>
  );
}
