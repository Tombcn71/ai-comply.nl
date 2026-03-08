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

export { pool };
