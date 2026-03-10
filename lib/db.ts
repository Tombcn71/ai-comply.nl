import { Pool, QueryResult } from "pg";

// export shared types for use in actions/components
export interface AiTool {
  id: string;
  organization_id: string;
  name: string;
  department: string;
  risk: string;
  purpose: string;
  is_compliant: boolean;
  date_added: string;
}

export interface Employee {
  id: string;
  organization_id: string;
  name: string;
  department: string;
  status: string;
  certificate_url?: string | null;
  certified_date?: string | null;
  created_at: string;
}

const pool = new Pool({
  connectionString:
    process.env.POSTGRESQL_ADDON_URI || process.env.DATABASE_URL,
  // Professionele EU-configuratie: SSL aan op cloud, uit op localhost
  ssl:
    process.env.NODE_ENV === "production" ||
    process.env.POSTGRESQL_ADDON_URI?.includes("clever-cloud.com")
      ? { rejectUnauthorized: false }
      : false,
});

let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;
  try {
    const client = await pool.connect();
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
      await client.query(`
        CREATE TABLE IF NOT EXISTS ai_tools (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id TEXT NOT NULL,
          name TEXT NOT NULL,
          department TEXT NOT NULL,
          risk TEXT NOT NULL,
          purpose TEXT NOT NULL,
          is_compliant BOOLEAN DEFAULT FALSE,
          date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS employees (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id TEXT NOT NULL,
          name TEXT NOT NULL,
          department TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          certificate_url TEXT,
          certified_date TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      isInitialized = true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[Database] Init Error:", error);
  }
}

// Helper voor alle queries om organisatie-veiligheid af te dwingen
export async function getAllTools(organizationId: string): Promise<any[]> {
  await initializeDatabase();
  const res = await pool.query(
    "SELECT * FROM ai_tools WHERE organization_id = $1 ORDER BY date_added DESC",
    [organizationId],
  );
  return res.rows;
}

export async function createTool(organizationId: string, data: any) {
  await initializeDatabase();
  const res = await pool.query(
    "INSERT INTO ai_tools (organization_id, name, department, risk, purpose, is_compliant) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      organizationId,
      data.name,
      data.department,
      data.risk,
      data.purpose,
      data.is_compliant,
    ],
  );
  return res.rows[0];
}

export async function getAllEmployees(organizationId: string) {
  await initializeDatabase();
  const res = await pool.query(
    "SELECT * FROM employees WHERE organization_id = $1 ORDER BY created_at DESC",
    [organizationId],
  );
  return res.rows;
}

export async function getToolById(id: string) {
  await initializeDatabase();
  const res = await pool.query("SELECT * FROM ai_tools WHERE id = $1", [id]);
  return res.rows[0] || null;
}

export async function updateTool(
  id: string,
  name?: string,
  department?: string,
  risk?: string,
  purpose?: string,
  is_compliant?: boolean,
) {
  await initializeDatabase();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  if (name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(name);
  }
  if (department !== undefined) {
    fields.push(`department = $${idx++}`);
    values.push(department);
  }
  if (risk !== undefined) {
    fields.push(`risk = $${idx++}`);
    values.push(risk);
  }
  if (purpose !== undefined) {
    fields.push(`purpose = $${idx++}`);
    values.push(purpose);
  }
  if (is_compliant !== undefined) {
    fields.push(`is_compliant = $${idx++}`);
    values.push(is_compliant);
  }
  if (fields.length === 0) return null;
  const query = `UPDATE ai_tools SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
  values.push(id);
  const res = await pool.query(query, values);
  return res.rows[0] || null;
}

export async function deleteTool(id: string) {
  await initializeDatabase();
  const res = await pool.query("DELETE FROM ai_tools WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function toggleCompliance(id: string) {
  await initializeDatabase();
  const res = await pool.query(
    "UPDATE ai_tools SET is_compliant = NOT is_compliant WHERE id = $1 RETURNING *",
    [id],
  );
  return res.rows[0] || null;
}

export async function getEmployeeById(id: string) {
  await initializeDatabase();
  const res = await pool.query("SELECT * FROM employees WHERE id = $1", [id]);
  return res.rows[0] || null;
}

export async function createEmployee(
  organizationId: string,
  data: { name: string; department: string; status?: string },
) {
  await initializeDatabase();
  const res = await pool.query(
    "INSERT INTO employees (organization_id, name, department, status) VALUES ($1, $2, $3, $4) RETURNING *",
    [organizationId, data.name, data.department, data.status || "pending"],
  );
  return res.rows[0];
}

export async function updateEmployeeCertification(
  id: string,
  certificateUrl: string,
) {
  await initializeDatabase();
  const res = await pool.query(
    "UPDATE employees SET certificate_url = $1, status = 'certified', certified_date = NOW() WHERE id = $2 RETURNING *",
    [certificateUrl, id],
  );
  return res.rows[0] || null;
}

export async function getCertificationStats(organizationId: string) {
  await initializeDatabase();
  const res = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM employees WHERE organization_id = $1) AS total,
      (SELECT COUNT(*) FROM employees WHERE organization_id = $1 AND status = 'certified') AS certified
    `,
    [organizationId],
  );
  const { total, certified } = res.rows[0] || { total: 0, certified: 0 };
  const totalNum = Number(total);
  const certifiedNum = Number(certified);
  const percentage = totalNum > 0 ? Math.round((certifiedNum / totalNum) * 100) : 0;
  return { total: totalNum, certified: certifiedNum, percentage };
}

export { pool };
