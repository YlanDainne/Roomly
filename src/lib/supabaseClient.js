import { createClient } from '@supabase/supabase-js';

const runtimeConfig = typeof window !== 'undefined' ? window.__ROOMLY_RUNTIME_CONFIG__ || {} : {};

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || runtimeConfig.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || runtimeConfig.REACT_APP_SUPABASE_ANON_KEY;

if (typeof window !== 'undefined') {
  window.__ROOMLY_RUNTIME_CONFIG__ = {
    ...runtimeConfig,
    REACT_APP_SUPABASE_URL: supabaseUrl || '',
    REACT_APP_SUPABASE_ANON_KEY: supabaseAnonKey || ''
  };
}

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
