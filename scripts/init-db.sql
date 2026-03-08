-- Create AI Tools table
CREATE TABLE IF NOT EXISTS ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  risk VARCHAR(50) NOT NULL,
  purpose TEXT NOT NULL,
  is_compliant BOOLEAN DEFAULT FALSE,
  date_added TIMESTAMP DEFAULT NOW()
);

-- Create Employees table for AI Training & Certifications
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  certificate_url VARCHAR(500),
  certified_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_tools_date_added ON ai_tools(date_added DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_department ON ai_tools(department);
CREATE INDEX IF NOT EXISTS idx_ai_tools_risk ON ai_tools(risk);
CREATE INDEX IF NOT EXISTS idx_ai_tools_is_compliant ON ai_tools(is_compliant);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
