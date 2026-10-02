import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { embed } = req.query;
      let query = supabase.from('institutions').select('*').order('name', { ascending: true });
      const { data: institutions, error } = await query;
      if (error) throw error;

      if (embed === '1') {
        const { data: branches, error: bError } = await supabase.from('branches').select('*');
        if (bError) throw bError;

        const result = institutions.map(inst => {
          return {
            ...inst,
            branches: branches.filter(b => b.institution_id === inst.id)
          };
        });
        return res.status(200).json(result);
      }

      return res.status(200).json(institutions);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
