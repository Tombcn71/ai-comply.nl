import { Pool, QueryResult } from 'pg';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export interface AiTool {
  id: string;
  name: string;
  department: string;
  risk: string;
  purpose: string;
  is_compliant: boolean;
  date_added: Date;
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
 * Get all AI tools from database
 */
export async function getAllTools(): Promise<AiTool[]> {
  try {
    const result: QueryResult<AiTool> = await pool.query(
      'SELECT id, name, department, risk, purpose, is_compliant, date_added FROM ai_tools ORDER BY date_added DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching tools:', error);
    throw new Error('Failed to fetch AI tools');
  }
}

/**
 * Get a single AI tool by ID
 */
export async function getToolById(id: string): Promise<AiTool | null> {
  try {
    const result: QueryResult<AiTool> = await pool.query(
      'SELECT id, name, department, risk, purpose, is_compliant, date_added FROM ai_tools WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching tool:', error);
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
    const id = crypto.randomUUID();
    const result: QueryResult<AiTool> = await pool.query(
      `INSERT INTO ai_tools (id, name, department, risk, purpose, is_compliant, date_added)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, name, department, risk, purpose, is_compliant, date_added`,
      [id, name, department, risk, purpose, false]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating tool:', error);
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
    console.error('Error updating tool:', error);
    throw new Error('Failed to update AI tool');
  }
}

/**
 * Delete an AI tool
 */
export async function deleteTool(id: string): Promise<boolean> {
  try {
    const result = await pool.query(
      'DELETE FROM ai_tools WHERE id = $1',
      [id]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error('Error deleting tool:', error);
    throw new Error('Failed to delete AI tool');
  }
}

/**
 * Toggle compliance status
 */
export async function toggleCompliance(id: string): Promise<AiTool | null> {
  try {
    const tool = await getToolById(id);
    if (!tool) return null;
    
    return updateTool(id, undefined, undefined, undefined, undefined, !tool.is_compliant);
  } catch (error) {
    console.error('Error toggling compliance:', error);
    throw new Error('Failed to toggle compliance status');
  }
}

/**
 * Get all employees
 */
export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const result: QueryResult<Employee> = await pool.query(
      'SELECT id, name, department, status, certificate_url, certified_date FROM employees ORDER BY name ASC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
}

/**
 * Get employee by ID
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    const result: QueryResult<Employee> = await pool.query(
      'SELECT id, name, department, status, certificate_url, certified_date FROM employees WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching employee:', error);
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
    const id = crypto.randomUUID();
    const result: QueryResult<Employee> = await pool.query(
      `INSERT INTO employees (id, name, department, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, department, status, certificate_url, certified_date`,
      [id, name, department, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating employee:', error);
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
    const result: QueryResult<Employee> = await pool.query(
      `UPDATE employees 
       SET status = $1, certificate_url = $2, certified_date = NOW()
       WHERE id = $3
       RETURNING id, name, department, status, certificate_url, certified_date`,
      ['certified', certificateUrl, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating employee certification:', error);
    throw new Error('Failed to update employee certification');
  }
}

/**
 * Get certification statistics
 */
export async function getCertificationStats(): Promise<{
  total: number;
  certified: number;
  percentage: number;
}> {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = $1 THEN 1 ELSE 0 END) as certified FROM employees',
      ['certified']
    );
    const row = result.rows[0];
    const total = parseInt(row.total) || 0;
    const certified = parseInt(row.certified) || 0;
    const percentage = total > 0 ? Math.round((certified / total) * 100) : 0;
    
    return { total, certified, percentage };
  } catch (error) {
    console.error('Error fetching certification stats:', error);
    throw new Error('Failed to fetch certification stats');
  }
}

export { pool };
