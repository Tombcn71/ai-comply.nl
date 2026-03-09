import { Pool, QueryResult } from 'pg';

// Database connection pool met SSL-beveiliging voor GDPR-compliantie
const pool = new Pool({
  connectionString: process.env.POSTGRESQL_ADDON_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle client', err);
});

let isInitialized = false;

/**
 * Initialize database tables if they don't exist
 */
export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;

  try {
    console.log('[Database] Initializing database tables...');

    // Zorg dat gen_random_uuid() werkt
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Create ai_tools table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_tools (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        risk VARCHAR(50) NOT NULL,
        purpose TEXT NOT NULL,
        is_compliant BOOLEAN DEFAULT FALSE,
        date_added TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create employees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        certificate_url VARCHAR(500),
        certified_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_ai_tools_org ON ai_tools(organization_id)',
      'CREATE INDEX IF NOT EXISTS idx_ai_tools_date_added ON ai_tools(date_added DESC)',
      'CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(organization_id)',
      'CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status)',
    ];

    for (const indexQuery of indexes) {
      await pool.query(indexQuery);
    }

    isInitialized = true;
    console.log('[Database] Tables initialized successfully');
  } catch (error) {
    console.error('[Database] Error initializing tables:', error);
  }
}

export interface AiTool {
  id: string;
  organization_id: string;
  name: string;
  department: string;
  risk: string;
  purpose: string;
  is_compliant: boolean;
  date_added?: Date;
}

export interface Employee {
  id: string;
  organization_id: string;
  name: string;
  department: string;
  status: string;
  certificate_url?: string;
  certified_date?: Date;
}

/**
 * Get all AI tools for an organization
 */
export async function getAllTools(organizationId: string): Promise<AiTool[]> {
  try {
    await initializeDatabase();
    const result: QueryResult<AiTool> = await pool.query(
      'SELECT id, organization_id, name, department, risk, purpose, is_compliant, date_added FROM ai_tools WHERE organization_id = $1 ORDER BY date_added DESC',
      [organizationId]
    );
    return result.rows;