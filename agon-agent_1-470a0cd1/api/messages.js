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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      let query = supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(60);
      if (req.query.kind) query = query.eq('kind', req.query.kind);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { author, email, org_type, body } = req.body || {};
      if (!author || !email || !body) return res.status(400).json({ error: 'Missing name, email or message' });
      const { data, error } = await supabase
        .from('messages')
        .insert({ kind: 'contact', author, email, org_type: org_type || null, body, status: 'new' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { id, reply, status } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const patch = {};
      if (typeof reply === 'string') patch.reply = reply;
      if (status) patch.status = status;
      const { data, error } = await supabase.from('messages').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
