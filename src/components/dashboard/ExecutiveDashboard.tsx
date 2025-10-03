import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DashboardExportButton } from "@/components/ui/pdf-download-button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Target, 
  RefreshCw,
  Database,
  Activity
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  usePortfolioMetrics, 
  useRiskDistribution, 
  useHealthTrends,
  useApplicationSummaries,
  useConnectionTest,
} from "@/hooks/use-cast-data";
import { useQueryClient } from '@tanstack/react-query';

// Simple loading spinner component inline
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full border-2 border-muted border-t-primary w-6 h-6" />
);

// Simple connection status component inline
const ConnectionStatus = () => {
  const { data, isLoading, error } = useConnectionTest();
  
  if (isLoading) {
    return <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Connecting...</div>;
  }
  
  const isConnected = !!(data === true || data === 1 || data?.db === 1 || data?.data === true);
  
  if (error || !isConnected) {
    return (
      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-destructive text-destructive-foreground">
        Disconnected
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
      Connected
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend, 
  isLoading = false,
  error = false 
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
  error?: boolean;
}) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : error ? (
          <p className="text-2xl font-bold text-destructive">Error</p>
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
        {change && !isLoading && !error && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === "up" ? "text-green-600" : 
            trend === "down" ? "text-red-600" : 
            "text-muted-foreground"
          }`}>
            {trend === "up" && <TrendingUp className="w-4 h-4" />}
            {trend === "down" && <TrendingDown className="w-4 h-4" />}
            <span className="font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        error ? "bg-destructive/10 text-destructive" :
        trend === "up" ? "bg-green-100 text-green-600" : 
        trend === "down" ? "bg-red-100 text-red-600" :
        "bg-primary/10 text-primary"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </Card>
);

const ExecutiveDashboard = () => {
  const { data: portfolioMetrics, isLoading: portfolioLoading, error: portfolioError } = usePortfolioMetrics();
  const { data: riskDistribution, isLoading: riskLoading, error: riskError } = useRiskDistribution();
  const { data: healthTrends, isLoading: trendsLoading, error: trendsError } = useHealthTrends();
  const { data: applications, isLoading: appsLoading, error: appsError } = useApplicationSummaries(10);
  
  // useConnectionTest can return multiple shapes; normalize safely
  const connectionQuery = useConnectionTest();
  const rawConnection = connectionQuery.data;
  const connectionStatus = !!(
    rawConnection === true ||
    rawConnection === 1 ||
    rawConnection?.data === true ||
    rawConnection?.db === 1
  );
  const connectionLoading = connectionQuery.isLoading;
  const connectionError = connectionQuery.error;
  const queryClient = useQueryClient();
  const refreshAll = async () => {
    // invalidate all queries that start with 'cast'
    await queryClient.invalidateQueries({ queryKey: ['cast'] });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null || typeof value !== 'number') return "N/A";
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatScore = (score: number | null | undefined) => {
    if (score == null || typeof score !== 'number') return "N/A";
    return `${score.toFixed(1)}/4.0`;
  };

  const getHealthGrade = (score: number | null | undefined) => {
    if (score == null || typeof score !== 'number') return "N/A";
    if (score >= 3.5) return "A";
    if (score >= 3.0) return "B";
    if (score >= 2.5) return "C";
    if (score >= 2.0) return "D";
    return "F";
  };

  // Show connection error prominently
  if (connectionError || !connectionStatus) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Database Connection Failed:</strong> {connectionError?.message || 'Unable to connect to CAST DataMart'}
            <br />
            <span className="text-sm">Please check your .env file configuration and ensure PostgreSQL is accessible.</span>
          </AlertDescription>
        </Alert>
        
        <Card className="p-8 text-center">
          <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Configure Database Connection</h3>
          <p className="text-muted-foreground mb-4">
            Update your .env file with the correct CAST DataMart PostgreSQL connection details.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Executive Dashboard</h2>
          <p className="text-muted-foreground">CAST Application Intelligence Portfolio Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <DashboardExportButton
            dashboardName="Executive Dashboard"
            elementId="executive-dashboard-content"
          />
          <Button 
            onClick={refreshAll} 
            variant="outline" 
            size="sm"
            disabled={portfolioLoading || riskLoading || trendsLoading || appsLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${portfolioLoading || riskLoading || trendsLoading || appsLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div id="executive-dashboard-content" className="space-y-6">
        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Portfolio Health"
          value={portfolioMetrics ? formatScore(portfolioMetrics.avg_health_score) : "N/A"}
          change={portfolioMetrics ? `Grade: ${getHealthGrade(portfolioMetrics.avg_health_score)}` : ""}
          icon={Activity}
          trend={portfolioMetrics && portfolioMetrics.avg_health_score && portfolioMetrics.avg_health_score >= 2.5 ? "up" : "down"}
          isLoading={portfolioLoading}
          error={!!portfolioError}
        />
        
        <MetricCard
          title="Total Applications"
          value={portfolioMetrics?.total_applications || 0}
          change="Applications monitored"
          icon={Target}
          trend="neutral"
          isLoading={portfolioLoading}
          error={!!portfolioError}
        />
        
        <MetricCard
          title="Technical Debt"
          value={portfolioMetrics ? formatCurrency(portfolioMetrics.total_technical_debt) : "N/A"}
          change="Remediation cost estimate"
          icon={TrendingDown}
          trend="down"
          isLoading={portfolioLoading}
          error={!!portfolioError}
        />
        
        <MetricCard
          title="Applications at Risk"
          value={portfolioMetrics?.critical_risk_apps || 0}
          change="Critical + High risk (score < 2.5)"
          icon={AlertTriangle}
          trend="down"
          isLoading={portfolioLoading}
          error={!!portfolioError}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Portfolio Risk Distribution</h3>
              <p className="text-sm text-muted-foreground">Applications by risk level</p>
            </div>
            {riskLoading ? (
              <div className="h-52 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : riskError ? (
              <div className="h-52 flex items-center justify-center text-destructive">
                <p>Failed to load risk data</p>
              </div>
            ) : !riskDistribution || riskDistribution.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground">
                <p>No risk distribution data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="application_count"
                    nameKey="label"
                  >
                    {riskDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, 'Applications']}
                    labelFormatter={(label) => `${label} Risk`}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={30}
                    wrapperStyle={{ fontSize: '12px' }}
                    formatter={(value) => {
                      const item = riskDistribution?.find(d => d.label === value);
                      return `${value} (${item?.application_count || 0})`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Health Trends */}
        <Card className="p-6 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Portfolio Health Trend</h3>
              <p className="text-sm text-muted-foreground">6-month health score evolution</p>
            </div>
            {trendsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : trendsError ? (
              <div className="h-64 flex items-center justify-center text-destructive">
                <p>Failed to load trend data</p>
              </div>
            ) : !healthTrends || healthTrends.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>No health trend data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={healthTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="period" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    domain={[0, 4]}
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    labelFormatter={(label) => `Period: ${label}`}
                    formatter={(value) => [value, 'Health Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avg_score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    name="Health Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Top Risk Applications */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Applications Requiring Attention</h3>
              <p className="text-sm text-muted-foreground">Lowest health scores and highest technical debt</p>
            </div>
            <Shield className="w-5 h-5 text-muted-foreground" />
          </div>
          
          {appsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : appsError ? (
            <div className="text-center py-8 text-destructive">
              <p>Failed to load application data</p>
            </div>
          ) : (
            <div className="space-y-2">
              {applications?.slice(0, 10).map((app, index) => (
                <div 
                  key={app.application_name}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      app.risk_level === 'Critical' ? 'bg-red-500' :
                      app.risk_level === 'High' ? 'bg-orange-500' :
                      app.risk_level === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium">{app.application_name}</p>
                      {app.business_unit && (
                        <p className="text-sm text-muted-foreground">
                          {app.business_unit}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatScore(app.health_score)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(app.technical_debt)} debt
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;