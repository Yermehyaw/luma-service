import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { author, email, org_type, body } = req.body;
      if (!author || !email || !body) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          author,
          email,
          org_type: org_type || 'Other',
          body,
          reply: null,
          status: 'pending',
          kind: 'contact'
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, reply, status } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      const updates = {};
      if (reply !== undefined) updates.reply = reply;
      if (status !== undefined) updates.status = status;

      const { data, error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
