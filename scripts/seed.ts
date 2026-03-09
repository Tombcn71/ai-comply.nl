import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';

// SSL-beveiligde verbinding voor GDPR-compliantie
const connectionString = process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seed() {
  try {
    console.log('[Seed] Starting database seeding...');

    // 1. Create organization
    console.log('[Seed] Creating organization "Test BV"...');
    const orgResult = await pool.query(
      `INSERT INTO organizations (name, email, created_at)
       VALUES ($1, $2, NOW())
       RETURNING id`,
      ['Test BV', 'contact@testbv.nl']
    );
    const organizationId = orgResult.rows[0].id;
    console.log('[Seed] Organization created:', organizationId);

    // 2. Create users (admin + hr member)
    console.log('[Seed] Creating test users...');
    const adminPassword = await bcryptjs.hash('Admin123!', 12);
    const hrPassword = await bcryptjs.hash('HR123!', 12);

    const adminResult = await pool.query(
      `INSERT INTO users (organization_id, email, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email`,
      [organizationId, 'admin@testbv.nl', adminPassword, 'admin']
    );
    console.log('[Seed] Admin user created:', adminResult.rows[0].email);

    const hrResult = await pool.query(
      `INSERT INTO users (organization_id, email, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email`,
      [organizationId, 'hr@testbv.nl', hrPassword, 'member']
    );
    console.log('[Seed] HR user created:', hrResult.rows[0].email);

    // 3. Create 5 AI tools
    console.log('[Seed] Creating AI tools...');
    const tools = [
      {
        name: 'ChatGPT Enterprise',
        department: 'Marketing',
        risk: 'beperkt',
        purpose: 'Content creation and customer support',
        is_compliant: true,
      },
      {
        name: 'Microsoft Copilot',
        department: 'IT',
        risk: 'beperkt',
        purpose: 'Code assistance and documentation',
        is_compliant: true,
      },
      {
        name: 'Claude AI',
        department: 'Product',
        risk: 'minimaal',
        purpose: 'Analysis and research',
        is_compliant: true,
      },
      {
        name: 'Jasper AI',
        department: 'Marketing',
        risk: 'beperkt',
        purpose: 'Email and ad copy generation',
        is_compliant: false,
      },
      {
        name: 'Midjourney',
        department: 'Design',
        risk: 'beperkt',
        purpose: 'Image generation for marketing materials',
        is_compliant: false,
      },
    ];

    for (const tool of tools) {
      await pool.query(
        `INSERT INTO ai_tools (organization_id, name, department, risk, purpose, is_compliant, date_added)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [organizationId, tool.name, tool.department, tool.risk, tool.purpose, tool.is_compliant]
      );
    }
    console.log('[Seed] Created 5 AI tools');

    // 4. Create 10 employees
    console.log('[Seed] Creating employees...');
    const employees = [
      { name: 'Jan de Vries', department: 'Marketing', status: 'certified' },
      { name: 'Maria Jansen', department: 'IT', status: 'certified' },
      { name: 'Pieter Bakker', department: 'HR', status: 'certified' },
      { name: 'Lisa Müller', department: 'Product', status: 'certified' },
      { name: 'Thomas König', department: 'Finance', status: 'pending' },
      { name: 'Anna Schmidt', department: 'Marketing', status: 'certified' },
      { name: 'Michel Dupont', department: 'IT', status: 'pending' },
      { name: 'Sarah Johnson', department: 'Product', status: 'certified' },
      { name: 'Carlos García', department: 'Sales', status: 'pending' },
      { name: 'Emma Wilson', department: 'HR', status: 'certified' },
    ];

    for (const emp of employees) {
      await pool.query(
        `INSERT INTO employees (organization_id, name, department, status, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [organizationId, emp.name, emp.department, emp.status]
      );
    }
    console.log('[Seed] Created 10 employees');

    console.log('\n[Seed] ✓ Database seeding completed successfully!');
    console.log('\n[Seed] Test Credentials:');
    console.log('  Admin:  admin@testbv.nl / Admin123!');
    console.log('  Member: hr@testbv.nl / HR123!');
    console.log('\n[Seed] Organization: Test BV (ID:', organizationId, ')');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    await pool.end();
    process.exit(1);
  }
}

seed().catch((err) => {
  console.error('[Seed] Fatal error:', err);
  process.exit(1);
});
