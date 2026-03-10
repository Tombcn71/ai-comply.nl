import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function checkAndMigrate() {
  try {
    console.log('Checking current schema...');

    // Check ai_tools table
    const aiToolsResult = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'ai_tools' AND table_schema = 'public'
      ORDER BY column_name
    `);
    console.log('ai_tools columns:', aiToolsResult.rows.map(r => r.column_name));

    // Check employees table
    const employeesResult = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'employees' AND table_schema = 'public'
      ORDER BY column_name
    `);
    console.log('employees columns:', employeesResult.rows.map(r => r.column_name));

    // Check users table
    try {
      const usersResult = await pool.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY column_name
      `);
      console.log('users columns:', usersResult.rows.map(r => r.column_name));
    } catch (error) {
      console.log('users table does not exist');
    }

    // Add organization_id columns if missing
    console.log('Adding missing organization_id columns...');

    await pool.query(`
      ALTER TABLE ai_tools ADD COLUMN IF NOT EXISTS organization_id TEXT;
    `);
    console.log('Added organization_id to ai_tools');

    await pool.query(`
      ALTER TABLE employees ADD COLUMN IF NOT EXISTS organization_id TEXT;
    `);
    console.log('Added organization_id to employees');

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        organization_id TEXT,
        role TEXT DEFAULT 'member',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created users table if it didn\'t exist');

    // Set default organization_id for existing records
    const defaultOrgId = 'nMW0aMNUcwECvTl3gvWSPg0MGsf8hpgy'; // From the session log

    const aiToolsCount = await pool.query(`
      UPDATE ai_tools SET organization_id = $1 WHERE organization_id IS NULL
    `, [defaultOrgId]);
    console.log(`Set default organization_id for ${aiToolsCount.rowCount} ai_tools records`);

    const employeesCount = await pool.query(`
      UPDATE employees SET organization_id = $1 WHERE organization_id IS NULL
    `, [defaultOrgId]);
    console.log(`Set default organization_id for ${employeesCount.rowCount} employees records`);

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

checkAndMigrate();