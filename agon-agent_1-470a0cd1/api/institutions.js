import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { q, category, embed } = req.query;
      let query = supabase
        .from('institutions')
        .select(embed === '1' ? '*, branches(*)' : '*')
        .order('name', { ascending: true });
      if (category && category !== 'all') query = query.eq('category', category);
      if (q) query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,area.ilike.%${q}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
