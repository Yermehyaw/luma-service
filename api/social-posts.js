import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { content, status, scheduled_for, platform } = req.body;
      if (!content) return res.status(400).json({ error: 'Missing content' });

      // Mock AI analysis for Social Studio
      const sentiments = ['positive', 'neutral', 'negative'];
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      
      const intents = ['billing query', 'complaint', 'feature request', 'account opening help', 'support'];
      const intent = intents[Math.floor(Math.random() * intents.length)];

      const suggested_reply = `Hello! Thank you for reaching out. We have queued your request regarding ${intent}. You can book a priority slot on Luma or verify documents from home to resolve this in minutes!`;

      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          content,
          status: status || 'draft',
          scheduled_for: scheduled_for || null,
          platform: platform || 'X · Instagram',
          sentiment,
          intent,
          suggested_reply
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
