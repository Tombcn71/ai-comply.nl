-- Multi-Tenant Database Migration
-- Creates organizations and users tables, adds organization_id to existing tables

-- 1. Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  organization_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 3. Add organization_id to ai_tools if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_tools' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE ai_tools ADD COLUMN organization_id UUID;
    ALTER TABLE ai_tools ADD CONSTRAINT fk_ai_tools_organization 
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Add organization_id to employees if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE employees ADD COLUMN organization_id UUID;
    ALTER TABLE employees ADD CONSTRAINT fk_employees_organization 
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Create indexes for organization_id
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_ai_tools_organization_id ON ai_tools(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_organization_id ON employees(organization_id);

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_is_compliant_org ON ai_tools(is_compliant, organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_status_org ON employees(status, organization_id);
