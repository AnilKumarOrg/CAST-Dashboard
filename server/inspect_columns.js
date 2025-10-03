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

const pool = new Pool(dbConfig);

async function listColumns(schema, table) {
  const q = `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position`;
  const res = await pool.query(q, [schema, table]);
  console.log(`\nColumns for ${schema}.${table}:`);
  res.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));
}

(async () => {
  try {
    const schema = process.env.VITE_DB_SCHEMA || 'datamart';
    await listColumns(schema, 'app_sizing_measures');
    await listColumns(schema, 'app_violations_measures');
    await listColumns(schema, 'app_technologies');
    await listColumns(schema, 'app_health_scores');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();