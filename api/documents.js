import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { ticket_code } = req.query;
      let query = supabase.from('documents').select('*');
      if (ticket_code) {
        query = query.eq('ticket_code', ticket_code.toUpperCase());
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { person, doc_type, file_name, file_url, ticket_code } = req.body;
      if (!person || !doc_type || !file_url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate random AI confidence score
      const confidence = Math.floor(Math.random() * 15) + 85; // 85% to 99%

      const { data, error } = await supabase
        .from('documents')
        .insert({
          person,
          doc_type,
          file_name,
          file_url,
          ticket_code: ticket_code ? ticket_code.toUpperCase() : null,
          status: 'pending',
          confidence
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'Missing ID or status' });

      const { data, error } = await supabase
        .from('documents')
        .update({ status })
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
