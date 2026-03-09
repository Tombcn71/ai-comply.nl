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
  } catch (error) {
    console.error('[Database] Error fetching tools:', error);
    return [];
  }
}

/**
 * Get all employees for an organization
 */
export async function getAllEmployees(organizationId: string): Promise<Employee[]> {
  try {
    await initializeDatabase();
    const result: QueryResult<Employee> = await pool.query(
      'SELECT id, organization_id, name, department, status, certificate_url, certified_date FROM employees WHERE organization_id = $1 ORDER BY created_at DESC',
      [organizationId]
    );
    return result.rows;
  } catch (error) {
    console.error('[Database] Error fetching employees:', error);
    return [];
  }
}

/**
 * Get certification statistics
 */
export async function getCertificationStats(organizationId: string) {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN certified_date IS NOT NULL THEN 1 ELSE 0 END) as certified FROM employees WHERE organization_id = $1',
      [organizationId]
    );
    const row = result.rows[0];
    const total = parseInt(row.total);
    const certified = parseInt(row.certified || '0');
    return {
      total,
      certified,
      percentage: total > 0 ? Math.round((certified / total) * 100) : 0,
    };
  } catch (error) {
    console.error('[Database] Error fetching certification stats:', error);
    return { total: 0, certified: 0, percentage: 0 };
  }
}

// Additional database functions for tools and employees
export async function createTool(organizationId: string, toolData: Omit<AiTool, 'id' | 'organization_id' | 'date_added'>): Promise<AiTool | null> {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'INSERT INTO ai_tools (organization_id, name, department, risk, purpose, is_compliant) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [organizationId, toolData.name, toolData.department, toolData.risk, toolData.purpose, toolData.is_compliant]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[Database] Error creating tool:', error);
    return null;
  }
}

export async function updateTool(toolId: string, toolData: Partial<AiTool>): Promise<AiTool | null> {
  try {
    await initializeDatabase();
    const updateFields = Object.entries(toolData)
      .filter(([key]) => key !== 'id' && key !== 'organization_id')
      .map(([key], index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [toolId, ...Object.values(toolData).filter((_, i) => i > 0)];
    
    const result = await pool.query(
      `UPDATE ai_tools SET ${updateFields} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error updating tool:', error);
    return null;
  }
}

export async function deleteTool(toolId: string): Promise<boolean> {
  try {
    await initializeDatabase();
    const result = await pool.query('DELETE FROM ai_tools WHERE id = $1', [toolId]);
    return result.rowCount !== undefined && result.rowCount > 0;
  } catch (error) {
    console.error('[Database] Error deleting tool:', error);
    return false;
  }
}

export async function toggleCompliance(toolId: string): Promise<boolean> {
  try {
    await initializeDatabase();
    await pool.query(
      'UPDATE ai_tools SET is_compliant = NOT is_compliant WHERE id = $1',
      [toolId]
    );
    return true;
  } catch (error) {
    console.error('[Database] Error toggling compliance:', error);
    return false;
  }
}

/**
 * Get a single tool by ID
 */
export async function getToolById(toolId: string): Promise<AiTool | null> {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'SELECT id, organization_id, name, department, risk, purpose, is_compliant, date_added FROM ai_tools WHERE id = $1',
      [toolId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching tool:', error);
    return null;
  }
}

/**
 * Create a new employee
 */
export async function createEmployee(organizationId: string, employeeData: Omit<Employee, 'id' | 'organization_id'>): Promise<Employee | null> {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'INSERT INTO employees (organization_id, name, department, status, certificate_url, certified_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [organizationId, employeeData.name, employeeData.department, employeeData.status || 'pending', employeeData.certificate_url, employeeData.certified_date]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[Database] Error creating employee:', error);
    return null;
  }
}

/**
 * Get a single employee by ID
 */
export async function getEmployeeById(employeeId: string): Promise<Employee | null> {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'SELECT id, organization_id, name, department, status, certificate_url, certified_date FROM employees WHERE id = $1',
      [employeeId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching employee:', error);
    return null;
  }
}

/**
 * Update employee certification status
 */
export async function updateEmployeeCertification(employeeId: string, certificateUrl: string, certifiedDate: Date): Promise<Employee | null> {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'UPDATE employees SET certificate_url = $1, certified_date = $2, status = $3 WHERE id = $4 RETURNING *',
      [certificateUrl, certifiedDate, 'certified', employeeId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error updating employee certification:', error);
    return null;
  }
}

// Export pool for external use
export { pool };
