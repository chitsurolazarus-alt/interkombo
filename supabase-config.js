// Supabase Configuration
const SUPABASE_URL = 'https://fwpjckkpsciqzfpmzktt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cGpja2twc2NpcXpmcG16a3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDkxNTEsImV4cCI6MjA5MzI4NTE1MX0.w7Z66QQJ5KMVDCUR9XUFwoApL_N_nO4QGDQ8CFuNyeQ';

// Create Supabase client - MUST use window.supabase
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized:', !!supabase);