import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

const supabase = createClient(url, key);

export default supabase;
