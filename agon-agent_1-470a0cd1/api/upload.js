import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { fileName, fileBase64, contentType } = req.body || {};
      if (!fileName || !fileBase64) return res.status(400).json({ error: 'Missing file' });

      const safe = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80);
      const path = `verify/${Date.now()}-${safe}`;
      const buffer = Buffer.from(fileBase64, 'base64');

      const { error } = await supabase.storage
        .from('luma-docs')
        .upload(path, buffer, { contentType: contentType || 'application/octet-stream', upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('luma-docs').getPublicUrl(path);
      return res.status(200).json({ url: urlData.publicUrl });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
