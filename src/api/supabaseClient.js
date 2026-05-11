import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Table names
export const TABLES = {
  USERS: 'users',
  SERVICES: 'services',
  ORDERS: 'orders',
  WALLET_TRANSACTIONS: 'wallet_transactions',
  APP_SETTINGS: 'app_settings'
};