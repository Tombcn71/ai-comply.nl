import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ? 
    `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes('?') ? '&' : '?'}sslmode=disable` : 
    undefined,
  ssl: false,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('[Seed] Starting data seeding...');

    // 1. Create organization
    console.log('[Seed] Creating organization...');
    const orgResult = await client.query(
      `INSERT INTO organizations (name, email, created_at)
       VALUES ($1, $2, NOW())
       RETURNING id, name`,
      ['Test BV', 'info@testbv.nl']
    );
    const orgId = orgResult.rows[0].id;
    console.log('[Seed] Organization created:', orgResult.rows[0].name, `(ID: ${orgId})`);

    // 2. Create users (admin + HR member)
    console.log('[Seed] Creating users...');
    const adminPassword = await bcryptjs.hash('Admin123!', 12);
    const hrPassword = await bcryptjs.hash('HR123!', 12);

    const adminResult = await client.query(
      `INSERT INTO users (email, password_hash, organization_id, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, role`,
      ['admin@testbv.nl', adminPassword, orgId, 'admin']
    );
    console.log('[Seed] Admin created:', adminResult.rows[0].email);

    const hrResult = await client.query(
      `INSERT INTO users (email, password_hash, organization_id, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, role`,
      ['hr@testbv.nl', hrPassword, orgId, 'member']
    );
    console.log('[Seed] HR member created:', hrResult.rows[0].email);

    // 3. Create AI tools
    console.log('[Seed] Creating AI tools...');
    const tools = [
      { name: 'ChatGPT Enterprise', department: 'Marketing', risk: 'beperkt', purpose: 'Content creation and analysis' },
      { name: 'Microsoft Copilot', department: 'IT', risk: 'beperkt', purpose: 'Code assistance and development' },
      { name: 'Jasper AI', department: 'Content', risk: 'beperkt', purpose: 'Blog and article writing' },
      { name: 'Notion AI', department: 'Product', risk: 'minimaal', purpose: 'Document summarization' },
      { name: 'Midjourney', department: 'Design', risk: 'beperkt', purpose: 'Image generation' },
    ];

    for (const tool of tools) {
      await client.query(
        `INSERT INTO ai_tools (name, department, risk, purpose, is_compliant, organization_id, date_added)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [tool.name, tool.department, tool.risk, tool.purpose, true, orgId]
      );
    }
    console.log(`[Seed] Created ${tools.length} AI tools`);

    // 4. Create employees
    console.log('[Seed] Creating employees...');
    const departments = ['Marketing', 'IT', 'HR', 'Finance', 'Operations'];
    const firstNames = ['Jan', 'Maria', 'Peter', 'Anna', 'Pieter', 'Sophie', 'Thomas', 'Elena', 'Marco', 'Laura'];
    const lastNames = ['de Vries', 'Jansen', 'Bakker', 'van der Berg', 'Müller', 'Schmidt', 'Kowalski', 'Lopez', 'Chen', 'Kim'];

    const employees = [];
    for (let i = 0; i < 10; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const certified = Math.random() > 0.4; // 60% certified

      employees.push({
        name: `${firstName} ${lastName}`,
        department: dept,
        status: certified ? 'certified' : 'pending',
      });
    }

    for (const emp of employees) {
      await client.query(
        `INSERT INTO employees (name, department, status, organization_id, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [emp.name, emp.department, emp.status, orgId]
      );
    }
    console.log(`[Seed] Created ${employees.length} employees`);

    // Print summary
    console.log('\n[Seed] ========== SEEDING COMPLETE ==========');
    console.log('[Seed] Test Organization: Test BV');
    console.log('[Seed] Admin User: admin@testbv.nl / Admin123!');
    console.log('[Seed] HR User: hr@testbv.nl / HR123!');
    console.log('[Seed] AI Tools: 5 created');
    console.log('[Seed] Employees: 10 created (6 certified, 4 pending)');
    console.log('[Seed] ==========================================\n');

  } catch (error) {
    console.error('[Seed] Error seeding data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('[Seed] Fatal error:', err);
  process.exit(1);
});
