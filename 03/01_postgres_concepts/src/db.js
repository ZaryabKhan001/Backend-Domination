import { Pool } from 'pg';

// Create a new pool to manage database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);

    const duration = Date.now() - start;

    console.log(`Executed query: ${{ text, duration, rows: result.rowCount }}`);
  } catch (error) {
    console.log('Error in query function', error);
    throw error;
  }
};
