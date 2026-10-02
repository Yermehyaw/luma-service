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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('social_posts').select('*').order('created_at', { ascending: false }).limit(40);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { content, status, scheduled_for, platform } = req.body || {};
      if (!content || !status) return res.status(400).json({ error: 'Missing content or status' });
      if (!['draft', 'scheduled', 'published'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
      const { data, error } = await supabase
        .from('social_posts')
        .insert({ content, status, scheduled_for: scheduled_for || null, platform: platform || 'Instagram · X' })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.body || {};
      const { error } = await supabase.from('social_posts').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
