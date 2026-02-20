import { ArrowLeft, Clock, TrendingUp, AlertTriangle, Zap, DollarSign, Flame, Coffee, IceCream, Salad } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const hourlyOrders = [
  { hour: "9AM", orders: 8 }, { hour: "10AM", orders: 15 }, { hour: "11AM", orders: 22 },
  { hour: "12PM", orders: 45 }, { hour: "1PM", orders: 38 }, { hour: "2PM", orders: 12 },
  { hour: "3PM", orders: 8 }, { hour: "4PM", orders: 10 }, { hour: "5PM", orders: 18 },
  { hour: "6PM", orders: 32 }, { hour: "7PM", orders: 35 }, { hour: "8PM", orders: 28 }, { hour: "9PM", orders: 20 },
];

const prepTimeData = [
  { hour: "9AM", time: 4 }, { hour: "10AM", time: 6 }, { hour: "11AM", time: 8 },
  { hour: "12PM", time: 12 }, { hour: "1PM", time: 10 }, { hour: "2PM", time: 7 },
  { hour: "3PM", time: 5 }, { hour: "4PM", time: 6 }, { hour: "5PM", time: 8 },
  { hour: "6PM", time: 11 }, { hour: "7PM", time: 9 }, { hour: "8PM", time: 10 }, { hour: "9PM", time: 14 },
];

const revenueData = [
  { hour: "9AM", revenue: 120 }, { hour: "10AM", revenue: 280 }, { hour: "11AM", revenue: 450 },
  { hour: "12PM", revenue: 820 }, { hour: "1PM", revenue: 680 }, { hour: "2PM", revenue: 220 },
  { hour: "3PM", revenue: 150 }, { hour: "4PM", revenue: 180 }, { hour: "5PM", revenue: 350 },
  { hour: "6PM", revenue: 620 }, { hour: "7PM", revenue: 750 }, { hour: "8PM", revenue: 580 }, { hour: "9PM", revenue: 420 },
];

const pieData = [
  { name: "Grill", value: 45, color: "hsl(0, 72%, 51%)" },
  { name: "Drinks", value: 18, color: "hsl(210, 80%, 55%)" },
  { name: "Desserts", value: 25, color: "hsl(280, 60%, 55%)" },
  { name: "Salads", value: 12, color: "hsl(142, 71%, 45%)" },
];

const weeklyData = [
  { day: "Mon", orders: 105, avgPrep: 10, delayed: 8 },
  { day: "Tue", orders: 120, avgPrep: 11, delayed: 5 },
  { day: "Wed", orders: 135, avgPrep: 9, delayed: 3 },
  { day: "Thu", orders: 142, avgPrep: 10, delayed: 6 },
  { day: "Fri", orders: 165, avgPrep: 12, delayed: 9 },
  { day: "Sat", orders: 155, avgPrep: 11, delayed: 7 },
  { day: "Sun", orders: 147, avgPrep: 10, delayed: 5 },
];

const stations = [
  { name: "GRILL", icon: Flame, orders: 58, avgTime: "14m", income: 1820, color: "border-kds-border-delayed" },
  { name: "DRINKS", icon: Coffee, orders: 42, avgTime: "5m", income: 630, color: "border-kds-border-new" },
  { name: "DESSERTS", icon: IceCream, orders: 28, avgTime: "9m", income: 880, color: "border-[hsl(280,60%,35%)]" },
  { name: "SALADS", icon: Salad, orders: 19, avgTime: "6m", income: 475, color: "border-kds-border-ready" },
];

function StatCard({ icon: Icon, value, label, change, changeColor }: { icon: any; value: string; label: string; change: string; changeColor: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-2xl font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4">
        <button onClick={() => navigate("/")} className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Analytics</h1>
          <p className="text-xs text-muted-foreground">Kitchen performance insights</p>
        </div>
      </header>

      <div className="space-y-4 px-6 pb-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={Clock} value="11.4m" label="Avg Prep Time" change="-0.8m" changeColor="text-kds-income" />
          <StatCard icon={TrendingUp} value="147" label="Orders Today" change="+12%" changeColor="text-kds-income" />
          <StatCard icon={AlertTriangle} value="3" label="Delayed Orders" change="-25%" changeColor="text-kds-income" />
          <StatCard icon={Zap} value="92%" label="Efficiency" change="+3%" changeColor="text-kds-income" />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Station Performance</h2>
          <div className="grid grid-cols-4 gap-4">
            {stations.map(s => (
              <div key={s.name} className={`rounded-lg border-2 ${s.color} bg-background p-3 space-y-1`}>
                <div className="flex items-center justify-between">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-foreground">{s.name}</span>
                </div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Orders</span><span className="text-foreground font-medium">{s.orders}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Avg Time</span><span className="text-foreground font-medium">{s.avgTime}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Income</span><span className="text-kds-income font-bold">${s.income.toLocaleString()}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Orders by Hour</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", color: "hsl(210,20%,92%)" }} />
                <Bar dataKey="orders" fill="hsl(210,80%,55%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Avg Prep Time by Hour</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={prepTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} tickFormatter={v => `${v}m`} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", color: "hsl(210,20%,92%)" }} />
                <Area type="monotone" dataKey="time" stroke="hsl(38,92%,50%)" fill="hsl(38,92%,50%)" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Revenue by Hour</h2>
              <span className="flex items-center gap-1 text-sm font-bold text-kds-income"><DollarSign className="h-3.5 w-3.5" />$6,765</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", color: "hsl(210,20%,92%)" }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(142,71%,45%)" fill="hsl(142,71%,45%)" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Income by Station</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(215,15%,55%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Weekly Order Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", color: "hsl(210,20%,92%)" }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(210,80%,55%)" strokeWidth={2} />
              <Line type="monotone" dataKey="avgPrep" stroke="hsl(38,92%,50%)" strokeWidth={2} />
              <Line type="monotone" dataKey="delayed" stroke="hsl(0,72%,51%)" strokeWidth={2} strokeDasharray="5 5" />
              <Legend wrapperStyle={{ fontSize: 11, color: "hsl(215,15%,55%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
