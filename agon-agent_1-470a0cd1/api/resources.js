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
      let query = supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(60);
      if (req.query.type && req.query.type !== 'all') query = query.eq('rtype', req.query.type);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { title, rtype, blurb } = req.body || {};
      if (!title || !rtype) return res.status(400).json({ error: 'Missing title or type' });
      if (!['template', 'playbook', 'guide'].includes(rtype)) return res.status(400).json({ error: 'Invalid type' });
      const { data, error } = await supabase
        .from('resources')
        .insert({ title, rtype, blurb: blurb || '', downloads: 0 })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
