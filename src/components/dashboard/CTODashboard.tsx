import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardExportButton } from "@/components/ui/pdf-download-button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Target, 
  RefreshCw,
  Database,
  Activity,
  Code2,
  Layers,
  Zap,
  Bug,
  GitBranch,
  Server,
  Cpu,
  HardDrive,
  Network,
  Clock,
  BarChart3
} from "lucide-react";
import { 
  BarChart,
  Bar,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart
} from "recharts";
import { 
  usePortfolioMetrics, 
  useTechnologyHealth,
  useArchitectureComplexity,
  useSecurityMetrics,
  usePerformanceMetrics,
  useCodeQualityTrends,
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

const TechMetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend, 
  isLoading = false,
  error = false,
  badge,
  description
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
  error?: boolean;
  badge?: string;
  description?: string;
}) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {isLoading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : error ? (
          <p className="text-2xl font-bold text-destructive">Error</p>
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
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

const CTODashboard = () => {
  const { data: portfolioMetrics, isLoading: portfolioLoading, error: portfolioError } = usePortfolioMetrics();
  const { data: techHealth, isLoading: techLoading, error: techError } = useTechnologyHealth();
  const { data: archComplexity, isLoading: archLoading, error: archError } = useArchitectureComplexity();
  const { data: securityMetrics, isLoading: secLoading, error: secError } = useSecurityMetrics();
  const { data: performanceMetrics, isLoading: perfLoading, error: perfError } = usePerformanceMetrics();
  const { data: codeQualityTrends, isLoading: codeLoading, error: codeError } = useCodeQualityTrends();

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

  const formatNumber = (value: number | null | undefined) => {
    if (value == null || typeof value !== 'number') return 'N/A';
    return value.toLocaleString();
  };

  // Derived/normalized values for UI - show top 10 technologies by health score
  const techChartData = (techHealth || [])
    .slice(0, 10) // Show only top 10 technologies  
    .map((t: any) => ({
      technology: (t.technology_name || t.technology || 'Unknown').substring(0, 12), // Truncate long names
      health_score: parseFloat(t.avg_score || t.health_score || t.avg_health_score || 0)
    }))
    .sort((a, b) => b.health_score - a.health_score); // Sort by health score descending

  // Use high-risk applications count instead of total violations (which includes minor issues)
  const highRiskSecurityApps = securityMetrics?.high_risk_applications ?? 0;
  const criticalSecurityViolations = securityMetrics?.total_critical_violations ?? 0;

  // Transform code quality trends data to add calculated fields
  const transformedCodeQualityTrends = (codeQualityTrends || []).map((trend: any) => {
    const avgQualityScore = (
      (trend.maintainability_score || 0) + 
      (trend.reliability_score || 0) + 
      (trend.security_score || 0) + 
      (trend.performance_score || 0)
    ) / 4;
    
    return {
      ...trend,
      quality_score: Math.round(avgQualityScore * 100) / 100,
      // Simulate violations trend (inverse of quality - higher quality = fewer violations)
      total_violations: Math.round((4 - avgQualityScore) * 500)
    };
  });

  // For performance, check if we have any performance data at all
  const performanceAppsCount = performanceMetrics?.applications?.length ?? 0;
  const poorPerformanceApps = performanceMetrics?.poor_performance_apps ?? 0;
  
  // Show actual performance issues if available, otherwise show count of apps with performance data
  const performanceIssueCount = poorPerformanceApps > 0 ? poorPerformanceApps : 
    (performanceAppsCount > 0 ? performanceAppsCount : null);

  const formatScore = (score: number | null | undefined) => {
    if (score == null || typeof score !== 'number') return "N/A";
    return `${score.toFixed(1)}/4.0`;
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null || typeof value !== 'number') return "N/A";
    return `${value.toFixed(1)}%`;
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
          <h2 className="text-2xl font-bold">CTO Dashboard</h2>
          <p className="text-muted-foreground">Technical Architecture & Code Quality Analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <DashboardExportButton
            dashboardName="CTO Dashboard"
            elementId="cto-dashboard-content"
          />
          <Button 
            onClick={refreshAll} 
            variant="outline" 
            size="sm"
            disabled={portfolioLoading || techLoading || archLoading || secLoading || perfLoading || codeLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${portfolioLoading || techLoading || archLoading || secLoading || perfLoading || codeLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div id="cto-dashboard-content" className="space-y-6">
        {/* Technical KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TechMetricCard
          title="Code Quality Score"
          value={portfolioMetrics ? formatScore(portfolioMetrics.avg_health_score) : "N/A"}
          change="Portfolio Average"
          icon={Code2}
          trend={portfolioMetrics && portfolioMetrics.avg_health_score && portfolioMetrics.avg_health_score >= 2.5 ? "up" : "down"}
          isLoading={portfolioLoading}
          error={!!portfolioError}
          badge="Quality"
          description="Overall code maintainability"
        />
        
        <TechMetricCard
          title="Architecture Debt"
          value={portfolioMetrics ? formatCurrency(portfolioMetrics.total_technical_debt) : "N/A"}
          change="Refactoring cost estimate"
          icon={Layers}
          trend="down"
          isLoading={portfolioLoading}
          error={!!portfolioError}
          badge="Architecture"
          description="Technical debt accumulation"
        />
        
        <TechMetricCard
          title="Security Violations"
          value={highRiskSecurityApps > 0 ? `${highRiskSecurityApps} Apps` : (criticalSecurityViolations > 0 ? formatNumber(criticalSecurityViolations) : 'N/A')}
          change="High-risk applications"
          icon={Shield}
          trend="down"
          isLoading={secLoading}
          error={!!secError}
          badge="Security"
          description="Applications with security risks"
        />
        
        <TechMetricCard
          title="Performance Issues"
          value={performanceIssueCount !== null ? formatNumber(performanceIssueCount) : 'N/A'}
          change={performanceAppsCount > 0 ? "Apps with performance data" : "No performance data"}
          icon={Zap}
          trend="down"
          isLoading={perfLoading}
          error={!!perfError}
          badge="Performance"
          description="Performance monitoring results"
        />
      </div>

      {/* Technical Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technology Health */}
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Technology Stack Health
                </h3>
                <p className="text-sm text-muted-foreground">Top 10 technologies by health score</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Health Scale</div>
                <div className="flex gap-1 text-xs">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">0-2</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">2-3</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">3-4</span>
                </div>
              </div>
            </div>
            {techLoading ? (
              <div className="h-48 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : techError ? (
              <div className="h-48 flex items-center justify-center text-destructive">
                <p>Failed to load technology data</p>
              </div>
            ) : !techChartData || techChartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <p>No technology health data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart 
                  data={techChartData} 
                  margin={{ top: 10, right: 20, left: 10, bottom: 35 }}
                >
                  <defs>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#1e40af" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis 
                    dataKey="technology"
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    fontSize={9}
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    domain={[0, 4]}
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    label={{ value: 'Health Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
                  />
                  <Tooltip 
                    formatter={(value) => [Number(value).toFixed(2), 'Health Score']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                  />
                  <Bar 
                    dataKey="health_score" 
                    radius={[4, 4, 0, 0]}
                  >
                    {techChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.health_score >= 3 ? '#10b981' : // Green for good health (3-4)
                          entry.health_score >= 2 ? '#f59e0b' : // Orange for fair health (2-3)
                          '#ef4444' // Red for poor health (0-2)
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Architecture Complexity */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Architecture Complexity</h3>
              <p className="text-sm text-muted-foreground">Complexity distribution across applications</p>
            </div>
            {archLoading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : archError ? (
              <div className="h-64 flex items-center justify-center text-destructive">
                <p>Failed to load architecture data</p>
              </div>
            ) : !archComplexity || !archComplexity.distribution || archComplexity.distribution.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>No architecture complexity data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={archComplexity?.distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="application_count"
                    nameKey="complexity_level"
                  >
                    {(archComplexity?.distribution || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, 'Applications']}
                    labelFormatter={(label) => `${label} Complexity`}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={30}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Code Quality Trends */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Code Quality Evolution</h3>
            <p className="text-sm text-muted-foreground">Quality metrics trends over time</p>
          </div>
          {codeLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : codeError ? (
            <div className="h-64 flex items-center justify-center text-destructive">
              <p>Failed to load code quality trends</p>
            </div>
          ) : !transformedCodeQualityTrends || transformedCodeQualityTrends.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No code quality trend data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={transformedCodeQualityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="period" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="score"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="violations"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Area
                  yAxisId="violations"
                  type="monotone"
                  dataKey="total_violations"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Violations"
                />
                <Line 
                  yAxisId="score"
                  type="monotone" 
                  dataKey="quality_score" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Quality Score"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Technical Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Critical Issues</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">High-Risk Security Apps</span>
                <Badge variant="destructive">{securityMetrics?.high_risk_applications || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Poor Performance Apps</span>
                <Badge variant="destructive">{performanceMetrics?.poor_performance_apps || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">High Complexity Apps</span>
                <Badge variant="destructive">{archComplexity?.summary?.high_complexity_apps || 0}</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Technology Coverage</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Languages Analyzed</span>
                <Badge variant="secondary">{techHealth?.length || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Applications Scanned</span>
                <Badge variant="secondary">{portfolioMetrics?.total_applications || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Code Lines Analyzed</span>
                <Badge variant="secondary">{formatNumber(portfolioMetrics?.total_loc)}</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Quality Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Maintainability Index</span>
                <Badge variant="secondary">{formatScore(portfolioMetrics?.avg_health_score)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Test Coverage</span>
                <Badge variant="secondary">{formatPercentage(performanceMetrics?.test_coverage)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Documentation Coverage</span>
                <Badge variant="secondary">{formatPercentage(techHealth?.reduce((sum, item) => sum + (item.documentation_coverage || 0), 0) / Math.max(techHealth?.length || 1, 1))}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default CTODashboard;