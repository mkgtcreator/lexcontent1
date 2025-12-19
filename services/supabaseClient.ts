import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://enqecmqczkcxsfedifyw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucWVjbXFjemtjeHNmZWRpZnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDIzNzYsImV4cCI6MjA4MTQxODM3Nn0._oZ4Uu1j7AVHT3VGI_VwcXYQMBD8dONNlV-VlcLoSHM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);