import { createClient } from '@supabase/supabase-js'

// Try environment variables first, fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bbqbwegzthtagbiftdse.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicWJ3ZWd6dGh0YWdiaWZ0ZHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NTkyMTgsImV4cCI6MjA3MzEzNTIxOH0.wcAhd7grvp9oXWh8iAgxOpUxFOL5ZX7V9UFfXQdwyuk'

console.log('Using environment variables:', !!import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 