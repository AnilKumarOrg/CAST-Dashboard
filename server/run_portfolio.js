require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');
const dbConfig = {
  host: process.env.VITE_DB_HOST,
  port: process.env.VITE_DB_PORT,
  database: process.env.VITE_DB_NAME,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  ssl: process.env.VITE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
(async () => {
  const pool = new Pool(dbConfig);
  try {
    const schema = process.env.VITE_DB_SCHEMA || 'datamart';
    const query = `
      SELECT 
        COUNT(DISTINCT snap.application_name) as total_applications,
        ROUND(AVG(health.score), 2) as avg_health_score,
        ROUND(SUM(size.technical_debt_total), 2) as total_technical_debt,
        SUM(size.nb_code_lines) as total_loc,
        COUNT(CASE WHEN health.score < 2.5 THEN 1 END) as critical_risk_apps,
        MAX(snap.analysis_date) as last_analysis_date
      FROM "${schema}".APP_HEALTH_SCORES health
      JOIN "${schema}".APP_SIZING_MEASURES size ON health.snapshot_id = size.snapshot_id
      JOIN "${schema}".DIM_SNAPSHOTS snap ON health.snapshot_id = snap.snapshot_id
      WHERE snap.is_latest = true
        AND health.business_criterion_name = 'Total Quality Index'
    `;
    const res = await pool.query(query);
    console.log('RAW ROW:', res.rows[0]);
  } catch (err) {
    console.error('ERR', err.message);
  } finally {
    await pool.end();
  }
})();