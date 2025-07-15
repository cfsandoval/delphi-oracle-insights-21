import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://xyeblzjuejqreiejnhgv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZWJsemp1ZWpxcmVpZWpuaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzkwOTksImV4cCI6MjA2ODExNTA5OX0.1e2Z9lfRIp2Zbda0tCHYmapeK0Z65FLGLuYr05d-j1E';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);