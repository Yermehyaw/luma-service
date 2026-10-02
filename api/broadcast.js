import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { branch_id, message } = req.body;
      if (!branch_id || !message) return res.status(400).json({ error: 'Missing branch_id or message' });

      const { data, error } = await supabase
        .from('broadcasts')
        .insert({
          branch_id,
          message
        })
        .select()
        .single();

      if (error) throw error;

      // We can also trigger wait_min updates or other simulated operations
      // e.g., slightly lower the wait time of the branch when broadcast happens!
      await supabase
        .from('branches')
        .update({ wait_min: Math.max(2, Math.floor(Math.random() * 5) + 3) })
        .eq('id', branch_id);

      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
