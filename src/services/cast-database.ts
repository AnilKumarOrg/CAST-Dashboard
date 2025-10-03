import { Pool, PoolClient } from 'pg';
import { getDatabaseConfig } from '../../config/app.config';
import type {
  PortfolioMetrics,
  ApplicationSummary,
  TechnologyHealthSummary,
  RiskDistribution,
  HealthTrend,
  SecurityMetrics,
  ExecutiveKPIs,
  BusinessCriterionScore,
  DatabaseConfig,
  CASTAPIResponse
} from '../types/cast-types';

class CASTDatabaseService {
  private pool: Pool | null = null;
  private config: DatabaseConfig;

  constructor() {
    const centralConfig = getDatabaseConfig();
    this.config = {
      host: centralConfig.host,
      port: centralConfig.port,
      database: centralConfig.name,
      user: centralConfig.user,
      password: centralConfig.password,
      ssl: centralConfig.ssl
    };
  }

  private async getConnection(): Promise<PoolClient> {
    if (!this.pool) {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }

    return await this.pool.connect();
  }

  async testConnection(): Promise<CASTAPIResponse<boolean>> {
    try {
      const client = await this.getConnection();
      const result = await client.query('SELECT 1 as test');
      client.release();
      
      return {
        success: true,
        data: result.rows.length > 0,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: false,
        error: error instanceof Error ? error.message : 'Unknown connection error',
        timestamp: new Date()
      };
    }
  }

  async getPortfolioMetrics(): Promise<CASTAPIResponse<PortfolioMetrics>> {
    try {
      const client = await this.getConnection();
      
      const query = `
        SELECT 
          COUNT(DISTINCT snap.application_name) as total_applications,
          ROUND(AVG(health.score), 2) as avg_health_score,
          ROUND(SUM(size.technical_debt_total), 2) as total_technical_debt,
          COUNT(CASE WHEN health.score < 2.0 THEN 1 END) as critical_risk_apps,
          MAX(snap.analysis_date) as last_analysis_date
        FROM APP_HEALTH_SCORES health
        JOIN APP_SIZING_MEASURES size ON health.snapshot_id = size.snapshot_id
        JOIN DIM_SNAPSHOTS snap ON health.snapshot_id = snap.snapshot_id
        WHERE snap.is_latest = true
          AND health.business_criterion_name = 'Total Quality Index'
      `;

      const result = await client.query(query);
      client.release();

      if (result.rows.length === 0) {
        throw new Error('No data found for portfolio metrics');
      }

      const row = result.rows[0];
      const portfolioMetrics: PortfolioMetrics = {
        total_applications: parseInt(row.total_applications) || 0,
        avg_health_score: parseFloat(row.avg_health_score) || 0,
        total_technical_debt: parseFloat(row.total_technical_debt) || 0,
        critical_risk_apps: parseInt(row.critical_risk_apps) || 0,
        improvement_trend: 0, // Will be calculated with historical data
        last_analysis_date: new Date(row.last_analysis_date)
      };

      return {
        success: true,
        data: portfolioMetrics,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: {
          total_applications: 0,
          avg_health_score: 0,
          total_technical_debt: 0,
          critical_risk_apps: 0,
          improvement_trend: 0,
          last_analysis_date: new Date()
        },
        error: error instanceof Error ? error.message : 'Failed to fetch portfolio metrics',
        timestamp: new Date()
      };
    }
  }

  async getApplicationSummaries(limit: number = 50): Promise<CASTAPIResponse<ApplicationSummary[]>> {
    try {
      const client = await this.getConnection();
      
      const query = `
        SELECT 
          snap.application_name,
          snap.snapshot_id as latest_snapshot_id,
          ROUND(health.score, 2) as health_score,
          ROUND(size.technical_debt_total, 2) as technical_debt,
          size.nb_critical_violations as critical_violations,
          size.nb_violations as total_violations,
          snap.analysis_date as last_analysis,
          app.\"Business Unit\" as business_unit,
          CASE 
            WHEN health.score >= 3.0 THEN 'Low'
            WHEN health.score >= 2.0 THEN 'Medium'
            WHEN health.score >= 1.0 THEN 'High'
            ELSE 'Critical'
          END as risk_level
        FROM DIM_SNAPSHOTS snap
        JOIN APP_HEALTH_SCORES health ON snap.snapshot_id = health.snapshot_id
        JOIN APP_SIZING_MEASURES size ON snap.snapshot_id = size.snapshot_id
        LEFT JOIN DIM_APPLICATIONS app ON snap.application_name = app.application_name
        WHERE snap.is_latest = true
          AND health.business_criterion_name = 'Total Quality Index'
        ORDER BY health.score ASC, size.technical_debt_total DESC
        LIMIT $1
      `;

      const result = await client.query(query, [limit]);
      client.release();

      const applications: ApplicationSummary[] = result.rows.map(row => ({
        application_name: row.application_name,
        latest_snapshot_id: row.latest_snapshot_id,
        health_score: parseFloat(row.health_score) || 0,
        technical_debt: parseFloat(row.technical_debt) || 0,
        critical_violations: parseInt(row.critical_violations) || 0,
        total_violations: parseInt(row.total_violations) || 0,
        risk_level: row.risk_level as 'Low' | 'Medium' | 'High' | 'Critical',
        last_analysis: new Date(row.last_analysis),
        business_unit: row.business_unit || undefined,
        technology_stack: [] // Will be populated with separate query if needed
      }));

      return {
        success: true,
        data: applications,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch application summaries',
        timestamp: new Date()
      };
    }
  }

  async getRiskDistribution(): Promise<CASTAPIResponse<RiskDistribution[]>> {
    try {
      const client = await this.getConnection();
      
      const query = `
        SELECT 
          CASE 
            WHEN health.score >= 3.0 THEN 'Low Risk'
            WHEN health.score >= 2.0 THEN 'Medium Risk'
            WHEN health.score >= 1.0 THEN 'High Risk'
            ELSE 'Critical Risk'
          END as risk_level,
          COUNT(*) as application_count
        FROM APP_HEALTH_SCORES health
        JOIN DIM_SNAPSHOTS snap ON health.snapshot_id = snap.snapshot_id
        WHERE snap.is_latest = true
          AND health.business_criterion_name = 'Total Quality Index'
        GROUP BY 
          CASE 
            WHEN health.score >= 3.0 THEN 'Low Risk'
            WHEN health.score >= 2.0 THEN 'Medium Risk'
            WHEN health.score >= 1.0 THEN 'High Risk'
            ELSE 'Critical Risk'
          END
        ORDER BY application_count DESC
      `;

      const result = await client.query(query);
      client.release();

      const total = result.rows.reduce((sum, row) => sum + parseInt(row.application_count), 0);
      
      const colorMap = {
        'Low Risk': '#22c55e',
        'Medium Risk': '#eab308', 
        'High Risk': '#f97316',
        'Critical Risk': '#ef4444'
      };

      const distribution: RiskDistribution[] = result.rows.map(row => ({
        risk_level: row.risk_level,
        application_count: parseInt(row.application_count),
        percentage: total > 0 ? Math.round((parseInt(row.application_count) / total) * 100) : 0,
        color: colorMap[row.risk_level as keyof typeof colorMap] || '#6b7280'
      }));

      return {
        success: true,
        data: distribution,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch risk distribution',
        timestamp: new Date()
      };
    }
  }

  async getHealthTrends(months: number = 6): Promise<CASTAPIResponse<HealthTrend[]>> {
    try {
      const client = await this.getConnection();
      
      const query = `
        SELECT 
          snap.year_month as period,
          ROUND(AVG(health.score), 2) as avg_score,
          ROUND(SUM(size.technical_debt_total), 2) as total_debt,
          SUM(size.nb_critical_violations) as critical_violations
        FROM DIM_SNAPSHOTS snap
        JOIN APP_HEALTH_SCORES health ON snap.snapshot_id = health.snapshot_id
        JOIN APP_SIZING_MEASURES size ON snap.snapshot_id = size.snapshot_id
        WHERE health.business_criterion_name = 'Total Quality Index'
          AND snap.year_month IS NOT NULL
          AND snap.analysis_date >= CURRENT_DATE - INTERVAL '$1 months'
        GROUP BY snap.year_month
        ORDER BY snap.year_month ASC
      `;

      const result = await client.query(query, [months]);
      client.release();

      const trends: HealthTrend[] = result.rows.map(row => ({
        period: row.period,
        avg_score: parseFloat(row.avg_score) || 0,
        total_debt: parseFloat(row.total_debt) || 0,
        critical_violations: parseInt(row.critical_violations) || 0
      }));

      return {
        success: true,
        data: trends,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch health trends',
        timestamp: new Date()
      };
    }
  }

  async getTechnologyHealthSummary(): Promise<CASTAPIResponse<TechnologyHealthSummary[]>> {
    try {
      const client = await this.getConnection();
      
      const query = `
        SELECT 
          techno.technology,
          COUNT(DISTINCT snap.application_name) as application_count,
          ROUND(AVG(techno.score), 2) as avg_health_score,
          SUM(size.nb_critical_violations) as total_critical_violations,
          ROUND(SUM(size.technical_debt_total), 2) as total_technical_debt
        FROM APP_TECHNO_SCORES techno
        JOIN DIM_SNAPSHOTS snap ON techno.snapshot_id = snap.snapshot_id
        JOIN APP_TECHNO_SIZING_MEASURES size ON techno.snapshot_id = size.snapshot_id 
          AND techno.technology = size.technology
        WHERE snap.is_latest = true
          AND techno.metric_name = 'Total Quality Index'
        GROUP BY techno.technology
        ORDER BY avg_health_score DESC
      `;

      const result = await client.query(query);
      client.release();

      const technologies: TechnologyHealthSummary[] = result.rows.map(row => ({
        technology: row.technology,
        application_count: parseInt(row.application_count) || 0,
        avg_health_score: parseFloat(row.avg_health_score) || 0,
        total_critical_violations: parseInt(row.total_critical_violations) || 0,
        total_technical_debt: parseFloat(row.total_technical_debt) || 0,
        trend: 'Stable' as const // Will be calculated with historical data
      }));

      return {
        success: true,
        data: technologies,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch technology health summary',
        timestamp: new Date()
      };
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

// Singleton instance
export const castDatabase = new CASTDatabaseService();

// Export the service class for potential additional instances
export default CASTDatabaseService;