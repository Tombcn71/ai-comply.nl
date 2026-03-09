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

    try {
      // Create ai_tools table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ai_tools (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          department VARCHAR(100) NOT NULL,
          risk VARCHAR(50) NOT NULL,
          purpose TEXT NOT NULL,
          is_compliant BOOLEAN DEFAULT FALSE,
          date_added TIMESTAMP DEFAULT NOW()
        )
      `);
    } catch (err) {
      console.warn('[Database] ai_tools table creation:', err instanceof Error ? err.message : String(err));
    }

    try {
      // Create employees table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS employees (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          department VARCHAR(100) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          certificate_url VARCHAR(500),
          certified_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    } catch (err) {
      console.warn('[Database] employees table creation:', err instanceof Error ? err.message : String(err));
    }

    // Create indexes with error handling
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_ai_tools_date_added ON ai_tools(date_added DESC)',
      'CREATE INDEX IF NOT EXISTS idx_ai_tools_department ON ai_tools(department)',
      'CREATE INDEX IF NOT EXISTS idx_ai_tools_risk ON ai_tools(risk)',
      'CREATE INDEX IF NOT EXISTS idx_ai_tools_is_compliant ON ai_tools(is_compliant)',
      'CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department)',
      'CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status)',
    ];

    for (const indexQuery of indexes) {
      try {
        await pool.query(indexQuery);
      } catch (err) {
        console.warn('[Database] Index creation:', err instanceof Error ? err.message : String(err));
      }
    }

    isInitialized = true;
    console.log('[Database] Tables initialized successfully');
  } catch (error) {
    console.error('[Database] Error initializing tables:', error);
    // Don't throw - allow app to continue with empty data during build
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

export interface Employee {
  id: string;
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
    throw new Error('Failed to fetch AI tools');
  }
}

/**
 * Get a single AI tool by ID
 */
export async function getToolById(id: string): Promise<AiTool | null> {
  try {
    await initializeDatabase();
    const result: QueryResult<AiTool> = await pool.query(
      'SELECT id, name, department, risk, purpose, is_compliant, date_added FROM ai_tools WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching tool:', error);
    throw new Error('Failed to fetch AI tool');
  }
}

/**
 * Create a new AI tool
 */
export async function createTool(
  name: string,
  department: string,
  risk: string,
  purpose: string
): Promise<AiTool> {
  try {
    await initializeDatabase();
    const id = crypto.randomUUID();
    const result: QueryResult<AiTool> = await pool.query(
      `INSERT INTO ai_tools (id, name, department, risk, purpose, is_compliant, date_added)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, name, department, risk, purpose, is_compliant, date_added`,
      [id, name, department, risk, purpose, false]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[Database] Error creating tool:', error);
    throw new Error('Failed to create AI tool');
  }
}

/**
 * Update an AI tool
 */
export async function updateTool(
  id: string,
  name?: string,
  department?: string,
  risk?: string,
  purpose?: string,
  isCompliant?: boolean
): Promise<AiTool | null> {
  try {
    await initializeDatabase();
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (department !== undefined) {
      updates.push(`department = $${paramCount++}`);
      values.push(department);
    }
    if (risk !== undefined) {
      updates.push(`risk = $${paramCount++}`);
      values.push(risk);
    }
    if (purpose !== undefined) {
      updates.push(`purpose = $${paramCount++}`);
      values.push(purpose);
    }
    if (isCompliant !== undefined) {
      updates.push(`is_compliant = $${paramCount++}`);
      values.push(isCompliant);
    }

    if (updates.length === 0) return getToolById(id);

    values.push(id);
    const query = `
      UPDATE ai_tools 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, department, risk, purpose, is_compliant, date_added
    `;

    const result: QueryResult<AiTool> = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error updating tool:', error);
    throw new Error('Failed to update AI tool');
  }
}

/**
 * Delete an AI tool
 */
export async function deleteTool(id: string): Promise<boolean> {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'DELETE FROM ai_tools WHERE id = $1',
      [id]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error('[Database] Error deleting tool:', error);
    throw new Error('Failed to delete AI tool');
  }
}

/**
 * Toggle compliance status
 */
export async function toggleCompliance(id: string): Promise<AiTool | null> {
  try {
    await initializeDatabase();
    const tool = await getToolById(id);
    if (!tool) return null;
    
    return updateTool(id, undefined, undefined, undefined, undefined, !tool.is_compliant);
  } catch (error) {
    console.error('[Database] Error toggling compliance:', error);
    throw new Error('Failed to toggle compliance status');
  }
}

/**
 * Get all employees
 */
export async function getAllEmployees(organizationId: string): Promise<Employee[]> {
  try {
    await initializeDatabase();
    const result: QueryResult<Employee> = await pool.query(
      'SELECT id, organization_id, name, department, status, certificate_url, certified_date FROM employees WHERE organization_id = $1 ORDER BY name ASC',
      [organizationId]
    );
    return result.rows;
  } catch (error) {
    console.error('[Database] Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
}

/**
 * Get employee by ID
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    await initializeDatabase();
    const result: QueryResult<Employee> = await pool.query(
      'SELECT id, name, department, status, certificate_url, certified_date FROM employees WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error fetching employee:', error);
    throw new Error('Failed to fetch employee');
  }
}

/**
 * Create a new employee
 */
export async function createEmployee(
  name: string,
  department: string,
  status: string
): Promise<Employee> {
  try {
    await initializeDatabase();
    const id = crypto.randomUUID();
    const result: QueryResult<Employee> = await pool.query(
      `INSERT INTO employees (id, name, department, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, department, status, certificate_url, certified_date`,
      [id, name, department, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error('[Database] Error creating employee:', error);
    throw new Error('Failed to create employee');
  }
}

/**
 * Update employee certification
 */
export async function updateEmployeeCertification(
  id: string,
  certificateUrl: string
): Promise<Employee | null> {
  try {
    await initializeDatabase();
    const result: QueryResult<Employee> = await pool.query(
      `UPDATE employees 
       SET status = $1, certificate_url = $2, certified_date = NOW()
       WHERE id = $3
       RETURNING id, name, department, status, certificate_url, certified_date`,
      ['certified', certificateUrl, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('[Database] Error updating employee certification:', error);
    throw new Error('Failed to update employee certification');
  }
}

/**
 * Get certification statistics
 */
export async function getCertificationStats(organizationId: string): Promise<{
  total: number;
  certified: number;
  percentage: number;
}> {
  try {
    await initializeDatabase();
    const result = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = $1 THEN 1 ELSE 0 END) as certified FROM employees WHERE organization_id = $2',
      ['certified', organizationId]
    );
    const row = result.rows[0];
    const total = parseInt(row.total) || 0;
    const certified = parseInt(row.certified) || 0;
    const percentage = total > 0 ? Math.round((certified / total) * 100) : 0;
    
    return { total, certified, percentage };
  } catch (error) {
    console.error('[Database] Error fetching certification stats:', error);
    // Return empty stats instead of throwing
    return { total: 0, certified: 0, percentage: 0 };
  }
}
}

export { pool };
