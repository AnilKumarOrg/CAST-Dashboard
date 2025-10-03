import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000, target: 50000 },
  { month: "Feb", revenue: 52000, target: 50000 },
  { month: "Mar", revenue: 48000, target: 50000 },
  { month: "Apr", revenue: 61000, target: 55000 },
  { month: "May", revenue: 72000, target: 60000 },
  { month: "Jun", revenue: 68000, target: 65000 },
];

const categoryData = [
  { name: "Electronics", value: 35000, color: "hsl(var(--chart-1))" },
  { name: "Clothing", value: 25000, color: "hsl(var(--chart-2))" },
  { name: "Food", value: 20000, color: "hsl(var(--chart-3))" },
  { name: "Books", value: 15000, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 10000, color: "hsl(var(--chart-5))" },
];

const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-medium">{change}</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </Card>
);

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$346K"
          change="+18.2% vs last month"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Active Users"
          value="24.8K"
          change="+12.5% vs last month"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Orders"
          value="3,842"
          change="-3.1% vs last month"
          icon={ShoppingCart}
          trend="down"
        />
        <MetricCard
          title="Conversion Rate"
          value="4.8%"
          change="+0.4% vs last month"
          icon={Activity}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <p className="text-sm text-muted-foreground">Monthly revenue vs targets</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Revenue" />
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Revenue by Category</h3>
              <p className="text-sm text-muted-foreground">Top performing categories</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI-Generated Insights */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">AI Executive Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Revenue shows strong upward momentum with a <span className="font-semibold text-green-600">+18.2% growth</span> this month. 
              Electronics category continues to lead sales. Consider increasing marketing budget for Food category 
              which shows untapped potential. User engagement metrics indicate healthy platform growth.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;
