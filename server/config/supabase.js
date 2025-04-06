// supabaseConfig.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nrlsemtbxqlsdaksocda.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybHNlbXRieHFsc2Rha3NvY2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDc0MzAsImV4cCI6MjA1OTQyMzQzMH0.zz3WukCnHu3VFqRo8QdhDZ2xNM0wJg1jK2cIBEiAePk'; // move this to .env in real apps

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = { supabase };
