import { appConfig } from '../../config/app.config';

// API Configuration using centralized config
export const API_CONFIG = {
  // Use centralized configuration
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  maxRetries: appConfig.api.maxRetries,
  endpoints: {
    applications: '/api/applications',
    applicationHealth: '/api/application-health',
    applicationViolations: '/api/application-violations',
    applicationRisks: '/api/application-risks',
    applicationProductivity: '/api/application-productivity',
    applicationSummaries: '/api/application-summaries',
    applicationISOTrends: '/api/application-iso-trends',
    applicationCWE: '/api/application-cwe',
    portfolioMetrics: '/api/portfolio-metrics',
    riskDistribution: '/api/risk-distribution',
    healthTrends: '/api/health-trends',
    technologyHealth: '/api/technology-health',
    health: '/api/health',
    architectureComplexity: '/api/architecture-complexity',
    securityMetrics: '/api/security-metrics',
    performanceMetrics: '/api/performance-metrics',
    codeQualityTrends: '/api/code-quality-trends',
    databaseTest: '/api/test-db',
  }
};

// Helper function to build full API URLs
export const getApiUrl = (endpoint: string, params?: string | number, queryParams?: Record<string, string | number>) => {
  const baseEndpoint = API_CONFIG.endpoints[endpoint as keyof typeof API_CONFIG.endpoints];
  if (!baseEndpoint) {
    throw new Error(`Unknown API endpoint: ${endpoint}`);
  }
  
  let url = `${API_CONFIG.baseURL}${baseEndpoint}`;
  if (params) {
    url = `${url}/${params}`;
  }
  
  // Add query parameters if provided
  if (queryParams) {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });
    url = `${url}?${searchParams.toString()}`;
  }
  
  return url;
};