import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRESQL_ADDON_URI || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrate() {
  try {
    console.log('Starting migration...');

    // Add organization_id to ai_tools
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'ai_tools' AND column_name = 'organization_id'
        ) THEN
          ALTER TABLE ai_tools ADD COLUMN organization_id TEXT;
        END IF;
      END $$;
    `);

    // Add organization_id to employees
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'employees' AND column_name = 'organization_id'
        ) THEN
          ALTER TABLE employees ADD COLUMN organization_id TEXT;
        END IF;
      END $$;
    `);

    // Add organization_id to users
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'organization_id'
        ) THEN
          ALTER TABLE users ADD COLUMN organization_id TEXT;
        END IF;
      END $$;
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();