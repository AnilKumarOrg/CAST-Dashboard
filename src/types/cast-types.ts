// CAST DataMart Type Definitions
// Based on the CAST AIP DataMart schema

export interface ApplicationHealth {
  snapshot_id: string;
  business_criterion_name: string;
  is_health_factor: boolean;
  nb_critical_violations: number;
  nb_violations: number;
  omg_technical_debt: bigint;
  score: number;
  compliance_score: number;
}

export interface ApplicationSizing {
  snapshot_id: string;
  nb_artifacts: number;
  nb_code_lines: number;
  nb_comment_lines: number;
  nb_commented_out_code_lines: number;
  nb_complexity_very_high: number;
  nb_complexity_high: number;
  nb_complexity_medium: number;
  nb_complexity_low: number;
  nb_critical_violations: number;
  nb_files: number;
  nb_violations: number;
  technical_debt_density: number;
  technical_debt_total: number;
}

export interface ApplicationSnapshot {
  snapshot_id: string;
  application_id: number;
  application_name: string;
  date: Date;
  analysis_date: Date;
  snapshot_number: number;
  is_latest: boolean;
  year: number;
  year_quarter: string;
  year_month: string;
  label: string;
  version: string;
}

export interface ApplicationMetadata {
  application_name: string;
  age?: string;
  business_unit?: string;
  country?: string;
  release_frequency?: string;
  sourcing?: string;
  methodology?: string;
}

export interface TechnologyScore {
  snapshot_id: string;
  technology: string;
  metric_id: number;
  metric_name: string;
  metric_type: string;
  score: number;
  compliance_score: number;
}

export interface ViolationMeasure {
  snapshot_id: string;
  rule_id: string;
  metric_id: number;
  technology: string;
  nb_violations: number;
  nb_total_checks: number;
  violation_ratio: number;
  compliance_ratio: number;
}

export interface HealthEvolution {
  snapshot_id: string;
  previous_snapshot_id: string;
  business_criterion_name: string;
  is_health_factor: boolean;
  nb_critical_violations_added: number;
  nb_critical_violations_removed: number;
  nb_violations_added: number;
  nb_violations_removed: number;
  omg_technical_debt_added: bigint;
  omg_technical_debt_deleted: bigint;
}

// Dashboard-specific aggregated types
export interface PortfolioMetrics {
  total_applications: number;
  avg_health_score: number;
  total_technical_debt: number;
  critical_risk_apps: number;
  improvement_trend: number;
  last_analysis_date: Date;
}

export interface ApplicationSummary {
  application_name: string;
  latest_snapshot_id: string;
  health_score: number;
  technical_debt: number;
  critical_violations: number;
  total_violations: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  last_analysis: Date;
  business_unit?: string;
  technology_stack: string[];
}

export interface TechnologyHealthSummary {
  technology: string;
  application_count: number;
  avg_health_score: number;
  total_critical_violations: number;
  total_technical_debt: number;
  trend: 'Improving' | 'Stable' | 'Declining';
}

export interface RiskDistribution {
  risk_level: string;
  application_count: number;
  percentage: number;
  color: string;
}

export interface HealthTrend {
  period: string;
  avg_score: number;
  total_debt: number;
  critical_violations: number;
}

export interface SecurityMetrics {
  total_security_violations: number;
  critical_security_violations: number;
  security_score: number;
  owasp_violations: number;
  cwe_violations: number;
  security_trend: number;
}

export interface QualityRule {
  rule_id: string;
  rule_name: string;
  business_criterion_name: string;
  technical_criterion_name: string;
  is_critical: boolean;
  weight: number;
}

// Executive Dashboard specific types
export interface ExecutiveKPIs {
  portfolio_health: number;
  total_applications: number;
  total_technical_debt: number;
  applications_at_risk: number;
  monthly_improvement: number;
  security_exposure: number;
}

export interface BusinessCriterionScore {
  criterion_name: string;
  score: number;
  violation_count: number;
  technical_debt: number;
  trend: number;
}

// Database connection configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

// API Response types
export interface CASTAPIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Chart data types for Recharts
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface TrendChartData {
  period: string;
  [metric: string]: number | string;
}

export interface ComparisonChartData {
  category: string;
  current: number;
  previous: number;
  target?: number;
}