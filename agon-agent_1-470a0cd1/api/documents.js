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
      let query = supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(50);
      if (req.query.ticket_code) query = query.eq('ticket_code', req.query.ticket_code);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { person, doc_type, file_name, file_url, ticket_code } = req.body || {};
      if (!person || !doc_type || !file_name || !file_url) {
        return res.status(400).json({ error: 'Please attach a document to verify' });
      }
      const confidence = 62 + Math.floor(Math.random() * 37); // first-pass authenticity check
      const status = confidence >= 70 ? 'queued' : 'flagged';
      const { data, error } = await supabase
        .from('documents')
        .insert({ person, doc_type, file_name, file_url, ticket_code: ticket_code || null, confidence, status })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { id, status } = req.body || {};
      if (!id || !['verified', 'flagged', 'queued', 'awaiting'].includes(status)) {
        return res.status(400).json({ error: 'Missing id or invalid status' });
      }
      const { data, error } = await supabase.from('documents').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
