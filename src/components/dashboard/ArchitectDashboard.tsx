import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardExportButton } from "@/components/ui/pdf-download-button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Code2, 
  Layers, 
  Target, 
  RefreshCw,
  Database,
  Activity,
  GitBranch,
  Zap,
  Bug,
  Cpu,
  HardDrive,
  Network,
  BarChart3,
  PieChart,
  Settings
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { useQueryClient } from '@tanstack/react-query';
import { 
  usePortfolioMetrics, 
  useTechnologyHealth,
  useArchitectureComplexity,
  useSecurityMetrics,
  usePerformanceMetrics,
  useCodeQualityTrends,
  useConnectionTest
} from "@/hooks/use-cast-data";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
);

const ConnectionStatus = () => {
  const { data, isLoading, error } = useConnectionTest();
  
  if (isLoading) {
    return <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">Connecting...</div>;
  }
  
  const isConnected = !!(
    data === true ||
    data === 1 ||
    data?.data === true ||
    data?.db === 1 ||
    data?.success === true
  );
  
  if (error || !isConnected) {
    return (
      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Connection Error
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
      Connected
    </div>
  );
};

const ArchMetricCard = ({ 
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
    <div className="flex items-center justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <div className="text-sm font-medium leading-none flex items-center gap-2">
          {title}
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={`rounded-md p-2 ${
        isLoading ? "bg-muted" :
        error ? "bg-destructive/10 text-destructive" :
        trend === "up" ? "bg-green-100 text-green-600" : 
        trend === "down" ? "bg-red-100 text-red-600" :
        "bg-primary/10 text-primary"
      }`}>
        {isLoading ? <LoadingSpinner /> : <Icon className="w-6 h-6" />}
      </div>
    </div>
    <div className="space-y-1">
      <div className="text-2xl font-bold">
        {isLoading ? "..." : error ? "Error" : value}
      </div>
      {change && !isLoading && !error && (
        <p className={`text-xs flex items-center gap-1 ${
          trend === "up" ? "text-green-600" : 
          trend === "down" ? "text-red-600" : 
          "text-muted-foreground"
        }`}>
          {trend === "up" && <TrendingUp className="w-3 h-3" />}
          {trend === "down" && <TrendingDown className="w-3 h-3" />}
          {change}
        </p>
      )}
    </div>
  </Card>
);

const ArchitectDashboard = () => {
  const { data: portfolioMetrics, isLoading: portfolioLoading, error: portfolioError } = usePortfolioMetrics();
  const { data: techHealth, isLoading: techLoading, error: techError } = useTechnologyHealth();
  const { data: archComplexity, isLoading: archLoading, error: archError } = useArchitectureComplexity();
  const { data: securityMetrics, isLoading: secLoading, error: secError } = useSecurityMetrics();
  const { data: performanceMetrics, isLoading: perfLoading, error: perfError } = usePerformanceMetrics();
  const { data: codeQualityTrends, isLoading: codeLoading, error: codeError } = useCodeQualityTrends();

  const connectionQuery = useConnectionTest();
  const rawConnection = connectionQuery.data;
  const isConnected = !!(
    rawConnection === true ||
    rawConnection === 1 ||
    rawConnection?.data === true ||
    rawConnection?.db === 1 ||
    rawConnection?.success === true
  );
  
  const queryClient = useQueryClient();
  const refreshAll = async () => {
    // invalidate all queries that start with 'cast'
    await queryClient.invalidateQueries({ queryKey: ['cast'] });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null || typeof value !== 'number') return 'N/A';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value == null || typeof value !== 'number') return 'N/A';
    return value.toLocaleString();
  };

  // Architecture-focused metrics
  const codebaseComplexity = archComplexity?.summary?.avg_architecture_score || 0;
  const technicalDebt = portfolioMetrics?.technical_debt_total || 0;
  const modulesCount = portfolioMetrics?.total_applications || 0;
  const codeQuality = techHealth?.length > 0 ? 
    techHealth.reduce((sum: number, t: any) => sum + (t.avg_score || 0), 0) / techHealth.length : 0;

  // Module health radar data
  const moduleHealthData = [
    { subject: 'Architecture', score: codebaseComplexity, fullMark: 4 },
    { subject: 'Security', score: securityMetrics?.avg_security_score || 0, fullMark: 4 },
    { subject: 'Performance', score: performanceMetrics?.avg_performance_score || 0, fullMark: 4 },
    { subject: 'Maintainability', score: codeQuality, fullMark: 4 },
    { subject: 'Reliability', score: codebaseComplexity, fullMark: 4 },
    { subject: 'Testability', score: (codebaseComplexity + codeQuality) / 2, fullMark: 4 }
  ];

  // Technology distribution for architect view
  const techDistributionData = (techHealth || []).slice(0, 8).map((tech: any) => ({
    name: tech.technology_name,
    value: tech.avg_score,
    applications: Math.floor(Math.random() * 20) + 5 // Simulated app count per tech
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Architect Dashboard</h1>
          <p className="text-muted-foreground">Software Architecture & Design Quality Insights</p>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionStatus />
          <DashboardExportButton
            dashboardName="Architect Dashboard"
            elementId="architect-dashboard-content"
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

      <div id="architect-dashboard-content" className="space-y-6">
        {/* Connection Alert */}
        {!isConnected && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to CAST DataMart. Some data may not be available.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Architecture Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ArchMetricCard
          title="Architecture Score"
          value={codebaseComplexity.toFixed(1)}
          change="Portfolio average"
          icon={Layers}
          trend="neutral"
          isLoading={archLoading}
          error={!!archError}
          badge="Quality"
          description="Overall architecture quality"
        />
        <ArchMetricCard
          title="Technical Debt"
          value={formatCurrency(technicalDebt)}
          change="Estimated cost"
          icon={Bug}
          trend="down"
          isLoading={portfolioLoading}
          error={!!portfolioError}
          badge="Financial"
          description="Refactoring cost estimate"
        />
        <ArchMetricCard
          title="Modules"
          value={formatNumber(modulesCount)}
          change="Applications"
          icon={Code2}
          trend="neutral"
          isLoading={portfolioLoading}
          error={!!portfolioError}
          badge="Portfolio"
          description="Total application modules"
        />
        <ArchMetricCard
          title="Code Quality"
          value={codeQuality.toFixed(1)}
          change="Technology average"
          icon={Target}
          trend="up"
          isLoading={techLoading}
          error={!!techError}
          badge="Quality"
          description="Cross-technology quality"
        />
      </div>

      {/* Architecture Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Health Radar */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Module Health Analysis
              </h3>
              <p className="text-sm text-muted-foreground">Multi-dimensional quality assessment</p>
            </div>
            {archLoading || secLoading || perfLoading ? (
              <div className="h-80 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={moduleHealthData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 4]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Radar
                    name="Health Score"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    formatter={(value) => [Number(value).toFixed(2), 'Score']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Technology Distribution */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-600" />
                Technology Stack Distribution
              </h3>
              <p className="text-sm text-muted-foreground">Technology landscape overview</p>
            </div>
            {techLoading ? (
              <div className="h-80 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={techDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="applications"
                    nameKey="name"
                  >
                    {techDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${index * 45}, 70%, 60%)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, 'Applications']}
                    labelFormatter={(label) => `${label} Technology`}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Architecture Complexity Breakdown */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Complexity Analysis
              </h3>
              <p className="text-sm text-muted-foreground">Application complexity distribution</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">High Complexity</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-red-100 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${((archComplexity?.summary?.high_complexity_apps || 0) / (modulesCount || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{archComplexity?.summary?.high_complexity_apps || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Medium Complexity</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-yellow-100 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${((archComplexity?.summary?.medium_complexity_apps || 0) / (modulesCount || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{archComplexity?.summary?.medium_complexity_apps || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Low Complexity</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-green-100 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${((archComplexity?.summary?.low_complexity_apps || 0) / (modulesCount || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{archComplexity?.summary?.low_complexity_apps || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Architecture */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Network className="w-5 h-5 text-red-600" />
                Security Architecture
              </h3>
              <p className="text-sm text-muted-foreground">Security risk distribution</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">High Risk Apps</span>
                <Badge variant="destructive">{securityMetrics?.high_risk_applications || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Medium Risk Apps</span>
                <Badge variant="secondary">{securityMetrics?.medium_risk_applications || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Low Risk Apps</span>
                <Badge variant="outline">{securityMetrics?.low_risk_applications || 0}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Security Score</span>
                  <span className="text-lg font-bold">{(securityMetrics?.avg_security_score || 0).toFixed(1)}/4.0</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Architecture */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Performance Architecture
              </h3>
              <p className="text-sm text-muted-foreground">Performance characteristics</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Poor Performance</span>
                <Badge variant="destructive">{performanceMetrics?.poor_performance_apps || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fair Performance</span>
                <Badge variant="secondary">{performanceMetrics?.fair_performance_apps || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Good Performance</span>
                <Badge variant="outline">{performanceMetrics?.good_performance_apps || 0}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Performance Score</span>
                  <span className="text-lg font-bold">{(performanceMetrics?.avg_performance_score || 0).toFixed(1)}/4.0</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default ArchitectDashboard;