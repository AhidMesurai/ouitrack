-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT CHECK (role IN ('admin', 'client')) NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create ga4_connections table
CREATE TABLE IF NOT EXISTS ga4_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP,
  connected_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create report_templates table
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create generated_reports table
CREATE TABLE IF NOT EXISTS generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id UUID REFERENCES report_templates NOT NULL,
  property_id TEXT NOT NULL,
  report_data JSONB NOT NULL,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ga4_connections_user_id ON ga4_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_ga4_connections_is_active ON ga4_connections(is_active);
CREATE INDEX IF NOT EXISTS idx_report_templates_created_by ON report_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_report_templates_is_active ON report_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_generated_reports_user_id ON generated_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_reports_template_id ON generated_reports(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_reports_expires_at ON generated_reports(expires_at);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ga4_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for ga4_connections
CREATE POLICY "Users can view own connections" ON ga4_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections" ON ga4_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections" ON ga4_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections" ON ga4_connections
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for report_templates
CREATE POLICY "Template visibility" ON report_templates
  FOR SELECT USING (
    is_active = TRUE OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage templates" ON report_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for generated_reports
CREATE POLICY "Users can view own reports" ON generated_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON generated_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON generated_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at BEFORE UPDATE ON report_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

