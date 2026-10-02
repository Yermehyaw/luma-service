import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { type } = req.query;
      let query = supabase.from('resources').select('*');
      if (type && type !== 'all') {
        query = query.eq('rtype', type);
      }
      const { data, error } = await query.order('downloads', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { title, rtype, blurb } = req.body;
      if (!title || !rtype) return res.status(400).json({ error: 'Missing title or type' });

      const { data, error } = await supabase
        .from('resources')
        .insert({
          title,
          rtype,
          blurb: blurb || '',
          downloads: 0
        })
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
