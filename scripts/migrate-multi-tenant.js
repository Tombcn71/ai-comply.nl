import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const migrations = [
  // Drop old tables if they exist
  'DROP TABLE IF EXISTS employees CASCADE',
  'DROP TABLE IF EXISTS ai_tools CASCADE',
  'DROP TABLE IF EXISTS users CASCADE',
  'DROP TABLE IF EXISTS organizations CASCADE',

  // Create organizations table
  `CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create users table
  `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create ai_tools table with organization_id
  `CREATE TABLE ai_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    risk VARCHAR(50) NOT NULL,
    purpose TEXT NOT NULL,
    is_compliant BOOLEAN DEFAULT FALSE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    date_added TIMESTAMP DEFAULT NOW()
  )`,

  // Create employees table with organization_id
  `CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    certificate_url VARCHAR(500),
    certified_date TIMESTAMP,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create indexes
  'CREATE INDEX idx_users_organization_id ON users(organization_id)',
  'CREATE INDEX idx_ai_tools_organization_id ON ai_tools(organization_id)',
  'CREATE INDEX idx_ai_tools_is_compliant ON ai_tools(is_compliant)',
  'CREATE INDEX idx_employees_organization_id ON employees(organization_id)',
  'CREATE INDEX idx_employees_status ON employees(status)',
];

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('[Migration] Starting multi-tenant schema migration...');
    
    for (const migration of migrations) {
      try {
        console.log(`[Migration] Executing: ${migration.substring(0, 50)}...`);
        await client.query(migration);
      } catch (err) {
        console.error('[Migration] Error executing migration:', err.message);
        throw err;
      }
    }

    console.log('[Migration] Multi-tenant schema migration completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('[Migration] Fatal error:', err);
  process.exit(1);
});
