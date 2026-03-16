import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

// Lazy-init to ensure dotenv has loaded before accessing env vars
export const getSupabase = (): SupabaseClient => {
    if (!_supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
        }

        _supabase = createClient(supabaseUrl, supabaseServiceKey);
    }
    return _supabase;
};

// Backward-compatible export (getter property)
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getSupabase() as any)[prop];
    }
});

export const checkConnection = async (): Promise<boolean> => {
    try {
        const client = getSupabase();
        const { data, error } = await client.from('users').select('count').limit(0);
        if (error && error.code !== 'PGRST116') {
            console.error('❌ Supabase connection check failed:', error.message);
            return false;
        }
        console.log('✅ Supabase Connected Successfully');
        return true;
    } catch (err: any) {
        console.error('❌ Supabase connection failed:', err.message);
        return false;
    }
};
