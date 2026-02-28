import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ywcwxjcqmobtqfmvixvu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y3d4amNxbW9idHFmbXZpeHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDc2OTQsImV4cCI6MjA4NzU4MzY5NH0.kbZxTbHa8iIeiWqq1g_f2DxyNnDXkzKW610xoei6F3I";  // safe for frontend

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

