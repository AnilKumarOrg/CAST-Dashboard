import { useQuery } from '@tanstack/react-query';
import { getApiUrl, API_CONFIG } from '@/lib/api-config';
// import { castDatabase } from '../services/cast-database';
import type {
  PortfolioMetrics,
  ApplicationSummary,
  RiskDistribution,
  HealthTrend,
  TechnologyHealthSummary
} from '../types/cast-types';

// Query keys for React Query
export const CAST_QUERY_KEYS = {
  portfolioMetrics: ['cast', 'portfolio', 'metrics'] as const,
  applicationSummaries: ['cast', 'applications', 'summaries'] as const,
  riskDistribution: ['cast', 'risk', 'distribution'] as const,
  healthTrends: ['cast', 'health', 'trends'] as const,
  technologyHealth: ['cast', 'technology', 'health'] as const,
  connectionTest: ['cast', 'connection', 'test'] as const,
  architectureComplexity: ['cast', 'architecture', 'complexity'] as const,
  securityMetrics: ['cast', 'security', 'metrics'] as const,
  performanceMetrics: ['cast', 'performance', 'metrics'] as const,
  codeQualityTrends: ['cast', 'code-quality', 'trends'] as const,
  applications: ['cast', 'applications'] as const,
  applicationHealth: ['cast', 'application', 'health'] as const,
  applicationViolations: ['cast', 'application', 'violations'] as const,
  applicationRisks: ['cast', 'application', 'risks'] as const,
  applicationProductivity: ['cast', 'application', 'productivity'] as const,
} as const;

// Default query options
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

export function usePortfolioMetrics() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.portfolioMetrics,
    queryFn: async () => {
      const res = await fetch(getApiUrl('portfolioMetrics'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch portfolio metrics');
      }
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useApplicationSummaries(limit: number = 50) {
  return useQuery({
    queryKey: [...CAST_QUERY_KEYS.applicationSummaries, limit],
    queryFn: async () => {
      const res = await fetch(getApiUrl('applicationSummaries', undefined, { limit: limit.toString() }));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch application summaries');
      }
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useRiskDistribution() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.riskDistribution,
    queryFn: async () => {
      const res = await fetch(getApiUrl('riskDistribution'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch risk distribution');
      }
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useHealthTrends(months: number = 6) {
  return useQuery({
    queryKey: [...CAST_QUERY_KEYS.healthTrends, months],
    queryFn: async () => {
      const res = await fetch(getApiUrl('healthTrends', undefined, { months: months.toString() }));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch health trends');
      }
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useTechnologyHealth() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.technologyHealth,
    queryFn: async () => {
      const res = await fetch(getApiUrl('technologyHealth'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch technology health');
      }
      // Normalize to { technology, health_score }
      return response.data.map((r: any) => ({
        technology: r.technology_name || r.technology,
        health_score: parseFloat(r.avg_score || r.avg_health_score) || 0,
        ...r
      }));
    },
    ...defaultQueryOptions,
  });
}

export function useConnectionTest() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.connectionTest,
    queryFn: async () => {
      const res = await fetch(getApiUrl('health'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Database connection failed');
      }
      // Support multiple shapes: { data: boolean } or legacy { db: 1 }
      const value = response.data ?? response.db ?? false;
      return value;
    },
    retry: 1,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Utility hook for refreshing all CAST data (to be implemented if needed)
export function useRefreshCASTData() {
  // Call the other hooks to get their refetch functions
  const { refetch: refetchPortfolio } = usePortfolioMetrics();
  const { refetch: refetchApplications } = useApplicationSummaries();
  const { refetch: refetchRisk } = useRiskDistribution();
  const { refetch: refetchTrends } = useHealthTrends();
  const { refetch: refetchTechnology } = useTechnologyHealth();

  const refreshAll = async () => {
    await Promise.all([
      refetchPortfolio(),
      refetchApplications(),
      refetchRisk(),
      refetchTrends(),
      refetchTechnology(),
    ]);
  };

  return { refreshAll };
}

// CTO Dashboard specific hooks

export function useArchitectureComplexity() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.architectureComplexity,
    queryFn: async () => {
      const res = await fetch(getApiUrl('architectureComplexity'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch architecture complexity');
      }
      // response.data is expected to be { summary, applications }
      const data = response.data || {};
      const apps = data.applications || [];
      const summary = data.summary || {};

      // Build distribution from summary data, not limited applications array
      const colorFor = (lvl: string) => {
        if (lvl === 'High') return '#ef4444';
        if (lvl === 'Medium') return '#f59e0b';
        if (lvl === 'Low') return '#10b981';
        return '#60a5fa';
      };
      
      const distribution = [
        {
          complexity_level: 'High',
          application_count: summary.high_complexity_apps || 0,
          color: colorFor('High'),
        },
        {
          complexity_level: 'Medium', 
          application_count: summary.medium_complexity_apps || 0,
          color: colorFor('Medium'),
        },
        {
          complexity_level: 'Low',
          application_count: summary.low_complexity_apps || 0,
          color: colorFor('Low'),
        }
      ].filter(item => item.application_count > 0); // Only include levels with data

      return {
        summary: data.summary || {},
        applications: apps,
        distribution,
      };
    },
    ...defaultQueryOptions,
  });
}

export function useSecurityMetrics() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.securityMetrics,
    queryFn: async () => {
      const res = await fetch(getApiUrl('securityMetrics'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch security metrics');
      }
      // Flatten summary for convenient access in UI
      const data = response.data || {};
      return {
        ...(data.summary || {}),
        applications: data.applications || [],
      };
    },
    ...defaultQueryOptions,
  });
}

export function usePerformanceMetrics() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.performanceMetrics,
    queryFn: async () => {
      const res = await fetch(getApiUrl('performanceMetrics'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch performance metrics');
      }
      const data = response.data || {};
      return {
        ...(data.summary || {}),
        applications: data.applications || [],
      };
    },
    ...defaultQueryOptions,
  });
}

export function useCodeQualityTrends() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.codeQualityTrends,
    queryFn: async () => {
      const res = await fetch(getApiUrl('codeQualityTrends'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch code quality trends');
      }
      // Normalize code quality trends into fields used by CTODashboard
      const rows = response.data || [];
      return rows.map((r: any) => {
        const maintain = parseFloat(r.maintainability_score) || 0;
        const reliability = parseFloat(r.reliability_score) || 0;
        const security = parseFloat(r.security_score) || 0;
        const performance = parseFloat(r.performance_score) || 0;
        const quality_score = Math.round(((maintain + reliability + security + performance) / 4) * 10) / 10;
        return {
          period: r.period,
          quality_score,
          total_violations: r.total_violations || 0,
          maintainability_score: maintain,
          reliability_score: reliability,
          security_score: security,
          performance_score: performance,
        };
      });
    },
    ...defaultQueryOptions,
  });
}

// App Owner Dashboard Hooks

export function useApplications() {
  return useQuery({
    queryKey: CAST_QUERY_KEYS.applications,
    queryFn: async () => {
      const res = await fetch(getApiUrl('applications'));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch applications');
      }
      return response.data;
    },
    ...defaultQueryOptions,
  });
}

export function useApplicationHealth(appId: string) {
  return useQuery({
    queryKey: [...CAST_QUERY_KEYS.applicationHealth, appId],
    queryFn: async () => {
      const res = await fetch(getApiUrl('applicationHealth', appId));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch application health');
      }
      return response.data;
    },
    enabled: !!appId,
    ...defaultQueryOptions,
  });
}

export function useApplicationViolations(appId: string) {
  return useQuery({
    queryKey: [...CAST_QUERY_KEYS.applicationViolations, appId],
    queryFn: async () => {
      const res = await fetch(getApiUrl('applicationViolations', appId));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch application violations');
      }
      return response.data;
    },
    enabled: !!appId,
    ...defaultQueryOptions,
  });
}

export function useApplicationRisks(appId: string) {
  return useQuery({
    queryKey: [...CAST_QUERY_KEYS.applicationRisks, appId],
    queryFn: async () => {
      const res = await fetch(getApiUrl('applicationRisks', appId));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch application risks');
      }
      return response.data;
    },
    enabled: !!appId,
    ...defaultQueryOptions,
  });
}

export function useApplicationProductivity(appId: string) {
  return useQuery({
    queryKey: [...CAST_QUERY_KEYS.applicationProductivity, appId],
    queryFn: async () => {
      const res = await fetch(getApiUrl('applicationProductivity', appId));
      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch application productivity');
      }
      return response.data;
    },
    enabled: !!appId,
    ...defaultQueryOptions,
  });
}