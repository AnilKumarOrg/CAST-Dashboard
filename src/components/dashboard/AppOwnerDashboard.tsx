import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DashboardExportButton } from '@/components/ui/pdf-download-button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { getApiUrl } from '@/lib/api-config';
import { Activity, Shield, AlertTriangle, TrendingUp, Code, FileText, Target, Zap, ChevronDown, ChevronRight, TrendingDown } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  latest_analysis: string;
}

interface HealthScore {
  score: number;
  grade: string;
}

interface ApplicationHealth {
  application_name: string;
  technical_debt: number;
  lines_of_code: number;
  files_count: number;
  analysis_date: string;
  health_scores: Record<string, HealthScore>;
  overall_score: number;
  overall_grade: string;
}

interface ViolationTechnology {
  technology: string;
  total_violations: number;
  critical_violations: number;
  rules: Array<{
    rule_pattern: string;
    violations: number;
    critical_contributions: number;
  }>;
}

interface ApplicationViolations {
  application_name: string;
  total_violations: number;
  technologies: ViolationTechnology[];
}

interface RiskAnalysis {
  application_name: string;
  complexity_analysis: {
    high_complexity_objects: number;
    medium_complexity_objects: number;
    low_complexity_objects: number;
    total_objects: number;
    complexity_score: number;
    risk_level: string;
  };
  violation_analysis: {
    critical_violations: number;
    total_violations: number;
    risk_density: number;
  };
  overall_risk_rating: string;
}

interface ProductivityMetrics {
  application_name: string;
  size_metrics: {
    lines_of_code: number;
    number_of_files: number;
    number_of_artifacts: number;
    avg_lines_per_file: number;
  };
  quality_metrics: {
    quality_score: number;
    technical_debt: number;
    debt_ratio: number;
    quality_efficiency: number;
  };
  productivity_indicators: {
    code_density: number;
    maintainability_index: number;
    technical_debt_impact: string;
  };
  analysis_date: string;
}

const fetchApplications = async (): Promise<Application[]> => {
  const response = await fetch(getApiUrl('applications'));
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const fetchApplicationHealth = async (appId: string): Promise<ApplicationHealth> => {
  const response = await fetch(getApiUrl('applicationHealth', appId));
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const fetchApplicationViolations = async (appId: string): Promise<ApplicationViolations> => {
  const response = await fetch(getApiUrl('applicationViolations', appId));
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const fetchApplicationRisks = async (appId: string): Promise<RiskAnalysis> => {
  const response = await fetch(getApiUrl('applicationRisks', appId));
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const fetchProductivityMetrics = async (appId: string): Promise<ProductivityMetrics> => {
  const response = await fetch(getApiUrl('applicationProductivity', appId));
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

// Fetch ISO trends data
const fetchISOTrends = async (appId: string) => {
  const response = await fetch(getApiUrl('applicationISOTrends', appId));
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

// Fetch CWE data
const fetchCWEData = async (appId: string) => {
  const response = await fetch(getApiUrl('applicationCWE', appId));
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data;
};

const AppMetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}> = ({ title, value, subtitle, icon, trend, color = "blue" }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
            {trend}
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

const HealthScoreCard: React.FC<{ title: string; score: number; grade: string }> = ({ title, score, grade }) => {
  // Check if this is an ISO compliance score (typically 1-100) vs CAST health score (1-4)
  const isISOScore = title.toLowerCase().includes('iso');
  
  // For ISO scores, use the actual percentage value for color logic
  // For regular health scores, use the score as-is
  const scoreForColor = isISOScore ? score : score;
  
  const getScoreColor = (score: number, isISO: boolean) => {
    if (isISO) {
      // ISO compliance percentage thresholds
      if (score >= 95) return 'text-green-600';   // Green for excellent (≥95%)
      if (score >= 90) return 'text-purple-600';  // Purple for good (90-95%)
      return 'text-red-600'; // Red for below 90%
    } else {
      // Regular health score thresholds (1-4 scale)
      if (score >= 3.5) return 'text-green-800'; // Dark green for excellent
      if (score >= 3.0) return 'text-green-600'; // Light green for good
      if (score >= 2.5) return 'text-yellow-600'; // Yellow for fair
      return 'text-red-800'; // Dark red for poor
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A' || grade === 'B') return 'bg-green-100 text-green-800';
    if (grade === 'C') return 'bg-yellow-100 text-yellow-800';
    if (grade === 'D') return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
          <div className={`text-3xl font-bold ${getScoreColor(scoreForColor, isISOScore)}`}>
            {isISOScore ? `${score.toFixed(0)}%` : score.toFixed(1)}
          </div>
          {isISOScore ? (
            <Badge className={`mt-2 ${score >= 95 ? 'bg-green-100 text-green-800' : score >= 90 ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>
              {score >= 95 ? 'Excellent' : score >= 90 ? 'Good' : 'Needs Improvement'}
            </Badge>
          ) : (
            <Badge className={`mt-2 ${getGradeColor(grade)}`}>
              Grade {grade}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ISO Trends and CWE Widget Component
const ISOTrendsAndCWEWidget: React.FC<{ appId: string }> = ({ appId }) => {
  const [expandedCWEs, setExpandedCWEs] = useState<Set<string>>(new Set());
  
  const { data: isoTrends, isLoading: isoLoading } = useQuery({
    queryKey: ['iso-trends', appId],
    queryFn: () => fetchISOTrends(appId),
    enabled: !!appId,
  });

  const { data: cweData, isLoading: cweLoading } = useQuery({
    queryKey: ['cwe-data', appId],
    queryFn: () => fetchCWEData(appId),
    enabled: !!appId,
  });

  const toggleCWE = (cweId: string) => {
    const newExpanded = new Set(expandedCWEs);
    if (newExpanded.has(cweId)) {
      newExpanded.delete(cweId);
    } else {
      newExpanded.add(cweId);
    }
    setExpandedCWEs(newExpanded);
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value == null || typeof value !== 'number') return 'N/A';
    return value.toLocaleString();
  };

  if (isoLoading || cweLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-500">Loading ISO trends and CWE data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ISO Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>ISO Compliance Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isoTrends && isoTrends.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={isoTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Compliance %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="security" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Security" />
                  <Line type="monotone" dataKey="maintainability" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Maintainability" />
                  <Line type="monotone" dataKey="reliability" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Reliability" />
                  <Line type="monotone" dataKey="performance" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Performance" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TrendingDown className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No ISO trend data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CWE Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span>CWE Security Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cweData && cweData.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cweData.map((cwe: any) => (
                <div key={cwe.cwe_id} className="border rounded-lg p-3">
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => toggleCWE(cwe.cwe_id)}
                    >
                      <div className="flex items-center space-x-2">
                        {expandedCWEs.has(cwe.cwe_id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                        <div>
                          <div className="font-medium text-sm">{cwe.cwe_id}: {cwe.cwe_name}</div>
                          <div className="text-xs text-gray-600">{cwe.total_violations} violations</div>
                        </div>
                      </div>
                      <Badge 
                        variant={cwe.severity === 'High' ? 'destructive' : 
                                cwe.severity === 'Medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {cwe.severity}
                      </Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 pl-6">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">{cwe.description}</p>
                        <div className="space-y-1">
                          <h5 className="text-xs font-medium">Violation Rules:</h5>
                          {cwe.rules && cwe.rules.map((rule: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                              <span className="truncate">{rule.rule_name}</span>
                              <span className="font-medium ml-2">{formatNumber(rule.violation_count)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No CWE data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function AppOwnerDashboard() {
  const [selectedApp, setSelectedApp] = useState<string>('');

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });

  const { data: healthData, isLoading: healthLoading, error: healthError } = useQuery({
    queryKey: ['application-health', selectedApp],
    queryFn: () => fetchApplicationHealth(selectedApp),
    enabled: !!selectedApp,
  });

  const { data: violationsData, isLoading: violationsLoading } = useQuery({
    queryKey: ['application-violations', selectedApp],
    queryFn: () => fetchApplicationViolations(selectedApp),
    enabled: !!selectedApp,
  });

  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ['application-risks', selectedApp],
    queryFn: () => fetchApplicationRisks(selectedApp),
    enabled: !!selectedApp,
  });

  const { data: productivityData, isLoading: productivityLoading } = useQuery({
    queryKey: ['application-productivity', selectedApp],
    queryFn: () => fetchProductivityMetrics(selectedApp),
    enabled: !!selectedApp,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#60a5fa';
    }
  };

  // Prepare chart data
  const violationChartData = violationsData?.technologies.map(tech => ({
    name: tech.technology,
    violations: tech.total_violations,
    critical: tech.critical_violations
  })) || [];

  const complexityChartData = riskData ? [
    { name: 'High', value: riskData.complexity_analysis.high_complexity_objects, color: '#ef4444' },
    { name: 'Medium', value: riskData.complexity_analysis.medium_complexity_objects, color: '#f59e0b' },
    { name: 'Low', value: riskData.complexity_analysis.low_complexity_objects, color: '#10b981' }
  ] : [];

  if (appsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Application Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Application Owner Dashboard</span>
            </div>
            {selectedApp && (
              <DashboardExportButton
                dashboardName="App Owner Dashboard"
                elementId="app-owner-dashboard-content"
                className="ml-4"
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Application</label>
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Choose an application to analyze..." />
                </SelectTrigger>
                <SelectContent>
                  {applications?.map((app) => (
                    <SelectItem key={app.id} value={app.name}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedApp && (
              <Alert>
                <AlertDescription>
                  Viewing detailed metrics for <strong>{selectedApp}</strong>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedApp && (
        <div id="app-owner-dashboard-content" className="space-y-6">
          {/* Application Health Scorecard */}
          {healthData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Application Health Scorecard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <AppMetricCard
                    title="Overall Score"
                    value={healthData.overall_score.toFixed(1)}
                    subtitle={`Grade ${healthData.overall_grade}`}
                    icon={<Activity className="h-5 w-5 text-blue-600" />}
                    color="blue"
                  />
                  <AppMetricCard
                    title="Technical Debt"
                    value={formatNumber(healthData.technical_debt)}
                    subtitle="Hours"
                    icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
                    color="orange"
                  />
                  <AppMetricCard
                    title="Lines of Code"
                    value={formatNumber(healthData.lines_of_code)}
                    icon={<Code className="h-5 w-5 text-green-600" />}
                    color="green"
                  />
                  <AppMetricCard
                    title="Files"
                    value={formatNumber(healthData.files_count)}
                    icon={<FileText className="h-5 w-5 text-purple-600" />}
                    color="purple"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {/* Display only ISO health scores, filter out CISQ and others */}
                  {Object.entries(healthData.health_scores)
                    .filter(([criterion]) => criterion.toLowerCase().includes('iso'))
                    .map(([criterion, data]) => (
                      <HealthScoreCard
                        key={criterion}
                        title={criterion}
                        score={data.score}
                        grade={data.grade}
                      />
                    ))}
                  
                  {/* Original code - commented for reference
                  {Object.entries(healthData.health_scores).map(([criterion, data]) => (
                    <HealthScoreCard
                      key={criterion}
                      title={criterion}
                      score={data.score}
                      grade={data.grade}
                    />
                  ))}
                  */}
                </div>

                {/* Explanatory Text */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Quality Metrics Explained</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Performance Efficiency</div>
                      <div>Measures how efficiently the application uses system resources. Higher scores indicate better performance optimization.</div>
                      <div className="text-xs text-gray-500 mt-1">Scale: 1.0 (Poor) to 4.0 (Excellent)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Technical Debt</div>
                      <div>Estimated effort (in hours) required to fix quality issues and bring code to acceptable standards.</div>
                      <div className="text-xs text-gray-500 mt-1">Lower values indicate better code quality</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Security</div>
                      <div>Evaluates application security practices and vulnerability risks. Higher scores mean fewer security weaknesses.</div>
                      <div className="text-xs text-gray-500 mt-1">Scale: 1.0 (High Risk) to 4.0 (Low Risk)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ISO Trends and CWE Analysis Widget */}
          {selectedApp && (
            <ISOTrendsAndCWEWidget appId={selectedApp} />
          )}

          {/* Violation Details by Technology */}
          {violationsData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Violation Details by Technology</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-red-600">
                    {formatNumber(violationsData.total_violations)}
                  </div>
                  <div className="text-sm text-gray-600">Total Violations</div>
                </div>

                {violationChartData.length > 0 && (
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={violationChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="violations" fill="#60a5fa" name="Total Violations" />
                        <Bar dataKey="critical" fill="#ef4444" name="Critical Violations" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-4">
                  {violationsData.technologies.map((tech) => (
                    <Card key={tech.technology} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{tech.technology}</h4>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {formatNumber(tech.total_violations)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {tech.critical_violations} critical
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {tech.rules.slice(0, 3).map((rule, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600 truncate">{rule.rule_pattern}</span>
                            <span className="font-medium">{formatNumber(rule.violations)}</span>
                          </div>
                        ))}
                        {tech.rules.length > 3 && (
                          <div className="text-sm text-gray-500">
                            ... and {tech.rules.length - 3} more rules
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Source Object Risk Analysis */}
          {riskData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Source Object Risk Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Complexity Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={complexityChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {complexityChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Risk Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Overall Risk Level:</span>
                          <Badge 
                            style={{ backgroundColor: getRiskColor(riskData.overall_risk_rating) }}
                            className="text-white"
                          >
                            {riskData.overall_risk_rating}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Complexity Score:</span>
                          <span className="font-medium">{riskData.complexity_analysis.complexity_score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Density:</span>
                          <span className="font-medium">{riskData.violation_analysis.risk_density}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Object Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-600">High Complexity:</span>
                          <span className="font-medium">{riskData.complexity_analysis.high_complexity_objects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-600">Medium Complexity:</span>
                          <span className="font-medium">{riskData.complexity_analysis.medium_complexity_objects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Low Complexity:</span>
                          <span className="font-medium">{riskData.complexity_analysis.low_complexity_objects}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Total Objects:</span>
                          <span className="font-medium">{riskData.complexity_analysis.total_objects}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Development Productivity Metrics */}
          {productivityData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Development Productivity Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <AppMetricCard
                    title="Code Density"
                    value={productivityData.productivity_indicators.code_density}
                    subtitle="Lines per file"
                    icon={<Code className="h-5 w-5 text-blue-600" />}
                    color="blue"
                  />
                  <AppMetricCard
                    title="Quality Efficiency"
                    value={productivityData.quality_metrics.quality_efficiency}
                    icon={<Zap className="h-5 w-5 text-green-600" />}
                    color="green"
                  />
                  <AppMetricCard
                    title="Debt Ratio"
                    value={`${(productivityData.quality_metrics.debt_ratio * 100).toFixed(2)}%`}
                    icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
                    color="orange"
                  />
                  <AppMetricCard
                    title="Tech Debt Impact"
                    value={productivityData.productivity_indicators.technical_debt_impact}
                    icon={<Activity className="h-5 w-5 text-purple-600" />}
                    color="purple"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Size Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Lines of Code:</span>
                        <span className="font-medium">{formatNumber(productivityData.size_metrics.lines_of_code)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of Files:</span>
                        <span className="font-medium">{formatNumber(productivityData.size_metrics.number_of_files)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Artifacts:</span>
                        <span className="font-medium">{formatNumber(productivityData.size_metrics.number_of_artifacts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Lines/File:</span>
                        <span className="font-medium">{productivityData.size_metrics.avg_lines_per_file}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Quality Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Quality Score:</span>
                        <span className="font-medium">{productivityData.quality_metrics.quality_score.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical Debt:</span>
                        <span className="font-medium">{formatNumber(productivityData.quality_metrics.technical_debt)} hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintainability Index:</span>
                        <span className="font-medium">{productivityData.productivity_indicators.maintainability_index.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {healthError && (
            <Alert>
              <AlertDescription>
                Error loading application data: {healthError.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {!selectedApp && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Select an Application
            </h3>
            <p className="text-gray-500">
              Choose an application from the dropdown above to view detailed quality metrics,
              violation analysis, risk assessment, and productivity insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}