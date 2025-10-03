# CAST DataMart Executive Dashboard - Copilot Instructions

## Overview

Transform the existing React/TypeScript dashboard into a comprehensive CAST AIP (Application Intelligence Platform) executive dashboard that provides multi-level insights from executive to application owner perspectives. The dashboard will connect to CAST's DataMart PostgreSQL database to visualize software quality, security, and technical debt metrics.

## Project Context

- **Technology Stack**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Recharts
- **Database**: PostgreSQL (CAST DataMart schema)
- **Data Source**: CAST AIP/Imaging/Gatekeeper analysis results
- **Existing Structure**: Basic dashboard framework with placeholder data

## Database Schema Understanding

### Core Data Tables (CAST DataMart)

The CAST DataMart contains the following key table categories:

1. **Application Level Tables** (APP_*)

   - `APP_HEALTH_SCORES`: Quality scores by business criteria (Security, Efficiency, etc.)
   - `APP_SIZING_MEASURES`: Technical size metrics (LOC, artifacts, violations)
   - `APP_VIOLATIONS_MEASURES`: Violation ratios by rules and technologies
   - `APP_FUNCTIONAL_SIZING_MEASURES`: Function point analysis
   - `APP_TECHNO_SCORES`: Technology-specific quality indicators
2. **Module Level Tables** (MOD_*)

   - Module-specific breakdowns of all application metrics
   - Enables drill-down from application to module level
3. **Source Level Tables** (SRC_*)

   - `SRC_OBJECTS`: Individual source code objects and their properties
   - `SRC_VIOLATIONS`: Detailed violation instances
   - `SRC_HEALTH_IMPACTS`: Risk propagation analysis
4. **Dimensional Tables** (DIM_*)

   - `DIM_APPLICATIONS`: Application metadata and business context
   - `DIM_SNAPSHOTS`: Time-series snapshot information
   - `DIM_RULES`: Quality rule definitions and weights
5. **Evolution Tables** (*_EVOLUTION)

   - Track changes over time between snapshots
   - Critical for trend analysis and ROI calculations

## Dashboard Hierarchy Implementation

### 1. Executive View (C-Level)

**Purpose**: High-level portfolio overview for strategic decision making

**Key Metrics**:

- Portfolio Health Score (average across all applications)
- Total Technical Debt (financial impact)
- Risk Distribution (applications by health grade)
- Trend Analysis (health evolution over time)
- Business Impact Summary

**Visualizations**:

```typescript
// Executive KPIs
interface ExecutiveMetrics {
  portfolioHealthScore: number;        // Average score across apps
  totalTechnicalDebt: number;          // Sum of technical_debt_total
  totalApplications: number;           // Count from DIM_APPLICATIONS
  criticalRiskApps: number;           // Apps with score < 2.0
  improvementTrend: number;           // Month-over-month change
}

// Data Sources:
// - APP_HEALTH_SCORES (latest snapshots)
// - APP_SIZING_MEASURES (technical_debt_total)
// - DIM_APPLICATIONS (portfolio metadata)
```

**Components to Create**:

- `ExecutiveDashboard.tsx`
- `PortfolioHealthWidget.tsx`
- `TechnicalDebtSummary.tsx`
- `RiskDistributionChart.tsx`

### 2. CTO View (Technology Strategy)

**Purpose**: Technology portfolio management and strategic technology decisions

**Key Metrics**:

- Technology Health by Stack (.NET, Java, etc.)
- Security Vulnerability Trends
- Architecture Quality Indicators
- Technology Modernization Priorities
- Cloud Readiness Assessment

**Visualizations**:

```typescript
interface CTOMetrics {
  technologyHealthScores: TechStackHealth[];
  securityVulnerabilities: SecurityMetrics;
  architecturalDebt: ArchitecturalMetrics;
  modernizationPriority: ModernizationScore[];
}

// Data Sources:
// - APP_TECHNO_SCORES (technology-specific scores)
// - APP_VIOLATIONS_MEASURES filtered by security rules
// - DIM_RULES filtered by architectural patterns
```

**Components to Create**:

- `CTODashboard.tsx`
- `TechnologyStackHealth.tsx`
- `SecurityVulnerabilityTrends.tsx`
- `ArchitecturalQualityMetrics.tsx`

### 3. Architect Manager View (Technical Management)

**Purpose**: Detailed technical analysis and development team guidance

**Key Metrics**:

- Code Quality Metrics by Application
- Complexity Distribution
- Rule Violation Trends
- Module-Level Analysis
- Technical Action Plans

**Visualizations**:

```typescript
interface ArchitectMetrics {
  complexityDistribution: ComplexityBreakdown[];
  qualityRuleViolations: ViolationMetrics[];
  moduleHealthScores: ModuleHealth[];
  actionPlanProgress: ActionPlanStatus[];
}

// Data Sources:
// - MOD_HEALTH_SCORES (module-level analysis)
// - APP_VIOLATIONS_MEASURES (detailed rule violations)
// - USR_ACTION_PLAN (remediation tracking)
```

**Components to Create**:

- `ArchitectDashboard.tsx`
- `CodeQualityMetrics.tsx`
- `ComplexityAnalysis.tsx`
- `ViolationTrendAnalysis.tsx`

### 4. Application Owner View (Application Management)

**Purpose**: Application-specific insights for development teams

**Key Metrics**:

- Application Health Scorecard
- Violation Details by Technology
- Source Object Risk Analysis
- Development Productivity Metrics

**Visualizations**:

```typescript
interface ApplicationMetrics {
  healthScorecard: HealthScorecard;
  violationsByTechnology: TechViolations[];
  riskPropagation: RiskAnalysis[];
  enhancementPoints: EnhancementMetrics;
  productivityTrends: ProductivityMetrics[];
}

// Data Sources:
// - SRC_HEALTH_IMPACTS (object-level risk analysis)
// - SRC_VIOLATIONS (detailed violation instances)
// - APP_FUNCTIONAL_SIZING_EVOLUTION (enhancement tracking)
```

**Components to Create**:

- `ApplicationDashboard.tsx`
- `HealthScorecard.tsx`
- `ViolationDetails.tsx`
- `RiskPropagationAnalysis.tsx`

## Implementation Phases

### Phase 1: Database Integration

1. **Environment Setup**

   ```typescript
   // .env file
   VITE_DB_HOST=localhost
   VITE_DB_PORT=2284
   VITE_DB_NAME=cast_datamart
   VITE_DB_USER=your_username
   VITE_DB_PASSWORD=your_password
   ```
2. **Database Service Layer**

   ```typescript
   // services/database.ts
   interface CASTDatabase {
     getPortfolioMetrics(): Promise<PortfolioMetrics>;
     getApplicationHealth(appName?: string): Promise<ApplicationHealth[]>;
     getTechnologyMetrics(): Promise<TechnologyMetrics[]>;
     getViolationTrends(timeframe: string): Promise<ViolationTrend[]>;
   }
   ```
3. **Data Models**

   ```typescript
   // types/cast-metrics.ts
   interface ApplicationHealth {
     application_name: string;
     snapshot_id: string;
     business_criterion_name: string;
     score: number;
     nb_critical_violations: number;
     technical_debt_total: number;
   }
   ```

### Phase 2: Navigation Structure

1. **Role-Based Navigation**

   ```typescript
   const dashboardRoutes = [
     { path: '/executive', component: ExecutiveDashboard, role: 'executive' },
     { path: '/cto', component: CTODashboard, role: 'cto' },
     { path: '/architect', component: ArchitectDashboard, role: 'architect' },
     { path: '/application', component: ApplicationDashboard, role: 'app-owner' }
   ];
   ```
2. **Breadcrumb Navigation**

   - Enable drill-down from portfolio → application → module → object
   - Maintain context across navigation levels

### Phase 3: Executive Dashboard

1. **Portfolio Overview Cards**

   ```sql
   -- Portfolio Health Query
   SELECT 
     COUNT(DISTINCT app.application_name) as total_applications,
     AVG(health.score) as avg_health_score,
     SUM(size.technical_debt_total) as total_technical_debt,
     COUNT(CASE WHEN health.score < 2.0 THEN 1 END) as critical_apps
   FROM APP_HEALTH_SCORES health
   JOIN APP_SIZING_MEASURES size ON health.snapshot_id = size.snapshot_id
   JOIN DIM_SNAPSHOTS snap ON health.snapshot_id = snap.snapshot_id
   WHERE snap.is_latest = true
     AND health.business_criterion_name = 'Total Quality Index';
   ```
2. **Risk Distribution Chart**

   - Pie chart showing applications by health grade (A, B, C, D, F)
   - Color-coded by risk level
3. **Trend Analysis**

   - Time-series chart showing portfolio health evolution
   - Technical debt accumulation over time

### Phase 4: CTO Dashboard

1. **Technology Stack Analysis**

   ```sql
   -- Technology Health by Stack
   SELECT 
     techno.technology,
     AVG(techno.score) as avg_score,
     COUNT(DISTINCT snap.application_name) as app_count,
     SUM(size.nb_critical_violations) as total_critical_violations
   FROM APP_TECHNO_SCORES techno
   JOIN DIM_SNAPSHOTS snap ON techno.snapshot_id = snap.snapshot_id
   JOIN APP_TECHNO_SIZING_MEASURES size ON techno.snapshot_id = size.snapshot_id 
     AND techno.technology = size.technology
   WHERE snap.is_latest = true
     AND techno.metric_name = 'Total Quality Index'
   GROUP BY techno.technology;
   ```
2. **Security Dashboard**

   - OWASP/CWE violation trends
   - Security score distribution
   - Critical security findings

### Phase 5: Architect Manager Dashboard

1. **Module Analysis**

   ```sql
   -- Module Health Analysis
   SELECT 
     mod.module_name,
     mod.business_criterion_name,
     mod.score,
     mod.nb_violations,
     size.nb_code_lines,
     size.technical_debt_total
   FROM MOD_HEALTH_SCORES mod
   JOIN MOD_SIZING_MEASURES size ON mod.snapshot_id = size.snapshot_id 
     AND mod.module_name = size.module_name
   WHERE mod.snapshot_id = :selected_snapshot;
   ```
2. **Code Quality Metrics**

   - Complexity distribution charts
   - Rule violation heatmaps
   - Quality rule compliance trends

### Phase 6: Application Owner Dashboard

1. **Source Object Analysis**

   ```sql
   -- High-Risk Objects
   SELECT 
     obj.object_name,
     obj.object_full_name,
     obj.technology,
     health.propagated_risk_index,
     health.nb_violations
   FROM SRC_OBJECTS obj
   JOIN SRC_HEALTH_IMPACTS health ON obj.object_id = health.object_id
   WHERE obj.application_name = :app_name
     AND health.propagated_risk_index > :risk_threshold
   ORDER BY health.propagated_risk_index DESC;
   ```
2. **Violation Details**

   - Detailed violation listings
   - Source code context
   - Remediation recommendations

## Database Connection Strategy

### Option 1: Direct PostgreSQL Connection (Recommended)

```typescript
// Use pg or postgres library for direct connection
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.VITE_DB_HOST,
  port: parseInt(process.env.VITE_DB_PORT || '5432'),
  database: process.env.VITE_DB_NAME,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
});
```

### Option 2: API Layer (Production)

- Create Express.js backend API
- Implement authentication and authorization
- Add rate limiting and caching
- Deploy as microservice

## UI/UX Enhancements

### Charts and Visualizations

1. **Recharts Components**

   - Portfolio health trends (LineChart)
   - Risk distribution (PieChart)
   - Technology comparison (BarChart)
   - Violation heatmaps (custom component)
2. **Interactive Features**

   - Drill-down navigation
   - Time range selection
   - Application filtering
   - Export capabilities

### Design System

1. **Color Coding**

   - Green: Healthy (score > 3.0)
   - Yellow: Warning (score 2.0-3.0)
   - Red: Critical (score < 2.0)
2. **Responsive Design**

   - Mobile-friendly layouts
   - Progressive disclosure
   - Context-aware navigation

## Testing Strategy

### Unit Tests

- Component rendering
- Data transformation logic
- Chart data processing

### Integration Tests

- Database connectivity
- API endpoint validation
- Cross-component communication

### E2E Tests

- Dashboard navigation flows
- Data filtering and drill-down
- Export functionality

## Deployment Considerations

### Environment Variables

```bash
# Development
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=cast_datamart
VITE_DB_USER=cast_user
VITE_DB_PASSWORD=your_password

# Production
VITE_API_URL=https://api.your-domain.com
VITE_AUTH_ENABLED=true
```

### Performance Optimization

1. **Data Caching**

   - React Query for server state
   - Local storage for user preferences
   - Memoization for expensive calculations
2. **Lazy Loading**

   - Route-based code splitting
   - Component lazy loading
   - Progressive data loading

## Security Considerations

### Authentication

- Implement role-based access control
- Integrate with corporate SSO
- Session management

### Data Protection

- Encrypt sensitive data
- Implement audit logging
- Follow OWASP guidelines

## Next Steps

1. **Immediate**: Set up PostgreSQL connection and environment variables
2. **Phase 1**: Implement Executive Dashboard with basic portfolio metrics
3. **Phase 2**: Add CTO Dashboard with technology analysis
4. **Phase 3**: Build Architect Manager Dashboard with detailed metrics
5. **Phase 4**: Create Application Owner Dashboard with object-level analysis
6. **Phase 5**: Add advanced features (filtering, export, real-time updates)

## Success Metrics

### Executive Value

- Reduced time to identify portfolio risks
- Improved technical debt visibility
- Data-driven technology investment decisions

### Technical Value

- Faster quality issue identification
- Improved code review efficiency
- Better resource allocation for remediation

### Business Value

- Reduced software maintenance costs
- Lower security vulnerability exposure
- Improved application reliability
