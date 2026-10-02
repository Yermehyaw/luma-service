import supabase from './db-client.js';

async function requireUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      let query = supabase.from('broadcasts').select('*').order('created_at', { ascending: false }).limit(20);
      if (req.query.branch_id) query = query.eq('branch_id', Number(req.query.branch_id));
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { branch_id, message } = req.body || {};
      if (!branch_id || !message) return res.status(400).json({ error: 'Missing branch or message' });
      const { data, error } = await supabase
        .from('broadcasts')
        .insert({ branch_id, message })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ ok: true, broadcast: data });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
