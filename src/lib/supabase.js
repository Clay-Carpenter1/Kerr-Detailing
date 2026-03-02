import { createClient } from '@supabase/supabase-js'

// Try environment variables first, fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bvmlbkdkgqdsrukchblo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bWxia2RrZ3Fkc3J1a2NoYmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODYyMDcsImV4cCI6MjA4ODA2MjIwN30.ujZsV3bfpBsSm_gb1trS_fGliZdrwxk7w_YSNS8x1-o'

console.log('Using environment variables:', !!import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 