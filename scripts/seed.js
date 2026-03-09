import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// SSL-beveiligde verbinding voor GDPR-compliantie
const connectionString = process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('[Seed] Starting database seeding...');

    // Create organization
    const orgId = randomUUID();
    await client.query(
      'INSERT INTO organizations (id, name, email, created_at) VALUES ($1, $2, $3, NOW())',
      [orgId, 'Test BV', 'info@testbv.nl']
    );
    console.log('[Seed] Created organization: Test BV');

    // Create admin user
    const adminId = randomUUID();
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    await client.query(
      'INSERT INTO users (id, organization_id, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [adminId, orgId, 'admin@testbv.nl', adminPassword, 'admin']
    );
    console.log('[Seed] Created admin user: admin@testbv.nl');

    // Create HR user
    const hrId = randomUUID();
    const hrPassword = await bcrypt.hash('HR123!', 10);
    await client.query(
      'INSERT INTO users (id, organization_id, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [hrId, orgId, 'hr@testbv.nl', hrPassword, 'member']
    );
    console.log('[Seed] Created HR user: hr@testbv.nl');

    // Create AI tools
    const toolNames = ['ChatGPT Enterprise', 'Microsoft Copilot', 'Jasper AI', 'Notion AI', 'Midjourney'];
    const departments = ['Marketing', 'IT', 'Content', 'Product', 'Design'];
    const risks = ['beperkt', 'beperkt', 'minimaal', 'minimaal', 'beperkt'];

    for (let i = 0; i < toolNames.length; i++) {
      const toolId = randomUUID();
      await client.query(
        'INSERT INTO ai_tools (id, organization_id, name, department, risk, purpose, is_compliant, date_added) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
        [
          toolId,
          orgId,
          toolNames[i],
          departments[i],
          risks[i],
          `Purpose for ${toolNames[i]}`,
          Math.random() > 0.3, // 70% compliant
        ]
      );
    }
    console.log('[Seed] Created 5 AI tools');

    // Create employees
    const firstNames = ['Jan', 'Maria', 'Pieter', 'Annette', 'Robert', 'Lisa', 'Marc', 'Sofie', 'Kevin', 'Emma'];
    const lastNames = ['de Vries', 'Jansen', 'Bakker', 'Koster', 'van den Berg', 'Hermans', 'Smits', 'de Smedt', 'Verstegen', 'Paulussen'];

    for (let i = 0; i < 10; i++) {
      const empId = randomUUID();
      const status = Math.random() > 0.5 ? 'certified' : 'pending';
      const certDate = status === 'certified' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null;

      await client.query(
        'INSERT INTO employees (id, organization_id, name, department, status, certified_date) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          empId,
          orgId,
          `${firstNames[i]} ${lastNames[i]}`,
          departments[i % departments.length],
          status,
          certDate,
        ]
      );
    }
    console.log('[Seed] Created 10 employees');

    console.log('[Seed] Seeding completed successfully!');
    console.log('[Seed] Test credentials:');
    console.log('  Admin: admin@testbv.nl / Admin123!');
    console.log('  HR: hr@testbv.nl / HR123!');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
