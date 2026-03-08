-- Create AI Tools table
CREATE TABLE IF NOT EXISTS ai_tools (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  risk VARCHAR(50) NOT NULL,
  purpose TEXT NOT NULL,
  is_compliant BOOLEAN DEFAULT FALSE,
  date_added TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_tools_date_added ON ai_tools(date_added DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_department ON ai_tools(department);
CREATE INDEX IF NOT EXISTS idx_ai_tools_risk ON ai_tools(risk);
