-- Supabase Database Schema for SMM Panel
-- Run this SQL in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  wallet_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Table (SMM Services)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  platform TEXT NOT NULL,
  rate_per_1000 NUMERIC NOT NULL,
  min_quantity INTEGER DEFAULT 10,
  max_quantity INTEGER DEFAULT 1000000,
  avg_time TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  service_id TEXT REFERENCES services(service_id),
  service_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'partial', 'failed', 'admin_review')),
  start_count INTEGER,
  remains INTEGER,
  panel_order_id TEXT,
  panel_status TEXT,
  panel_response TEXT,
  panel_submitted_at TIMESTAMPTZ,
  panel_error TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Wallet Transactions Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('deposit', 'deduction', 'refund')),
  amount NUMERIC NOT NULL,
  method TEXT CHECK (method IN ('jazzcash', 'easypaisa', 'bank_transfer', 'system')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reference TEXT,
  notes TEXT,
  balance_after NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users table
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id OR auth.jwt()->>'role' = 'admin');
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can do everything" ON users FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- RLS Policies for Services table
CREATE POLICY "Anyone can read services" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- RLS Policies for Orders table
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- RLS Policies for Wallet Transactions table
CREATE POLICY "Users can read own transactions" ON wallet_transactions FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');
CREATE POLICY "Users can create transactions" ON wallet_transactions FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can manage transactions" ON wallet_transactions FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- RLS Policies for App Settings table
CREATE POLICY "Anyone can read settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON app_settings FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_services_platform ON services(platform);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Insert default admin user (change email/password as needed)
-- This is a one-time setup, then use Supabase Auth
INSERT INTO users (email, name, role, wallet_balance)
VALUES ('admin@dmspanel.com', 'Admin', 'admin', 0)
ON CONFLICT (email) DO NOTHING;

-- Insert sample SMM services
INSERT INTO services (service_id, name, category, platform, rate_per_1000, min_quantity, max_quantity, avg_time, description) VALUES
('tiktok-followers-1', 'TikTok Followers', 'Followers', 'tiktok', 150, 100, 50000, '1-3 days', 'Get real TikTok followers'),
('tiktok-likes-1', 'TikTok Likes', 'Likes', 'tiktok', 80, 100, 100000, '1-2 days', 'Get real TikTok likes'),
('instagram-followers-1', 'Instagram Followers', 'Followers', 'instagram', 200, 100, 100000, '1-3 days', 'Get real Instagram followers'),
('instagram-likes-1', 'Instagram Likes', 'Likes', 'instagram', 100, 100, 100000, '1-2 days', 'Get real Instagram likes'),
('youtube-views-1', 'YouTube Views', 'Views', 'youtube', 250, 100, 1000000, '3-7 days', 'Get high retention YouTube views'),
('facebook-followers-1', 'Facebook Page Followers', 'Followers', 'facebook', 180, 100, 50000, '2-4 days', 'Get Facebook page followers');


-- Insert sample app settings
INSERT INTO app_settings (key, value) VALUES
('site_name', 'DM Social Panel'),
('site_description', 'Pakistan Best & Cheapest SMM Panel'),
('contact_email', 'support@dmspanel.com'),
('minimum_deposit', '500'),
('currency', 'PKR');

SELECT 'Database setup completed successfully!' as message;