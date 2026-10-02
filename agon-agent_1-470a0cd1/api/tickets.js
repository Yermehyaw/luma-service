import supabase from './db-client.js';

const CODES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genCode = () => 'LM-' + Array.from({ length: 4 }, () => CODES[Math.floor(Math.random() * CODES.length)]).join('');

async function requireUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { code, branch_id, visit_date } = req.query;
      if (code) {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('code', String(code).toUpperCase())
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'No ticket with that code. Check and try again.' });
        return res.status(200).json(data);
      }
      if (branch_id) {
        let query = supabase
          .from('tickets')
          .select('*')
          .eq('branch_id', Number(branch_id))
          .order('visit_date', { ascending: false })
          .order('position', { ascending: true })
          .limit(60);
        if (visit_date) query = query.eq('visit_date', visit_date);
        const { data, error } = await query;
        if (error) throw error;
        return res.status(200).json(data);
      }
      return res.status(400).json({ error: 'Provide a code or a branch_id' });
    }

    if (req.method === 'POST') {
      const { institution_id, branch_id, service_id, name, phone, email, visit_date, window_start, window_end } = req.body || {};
      if (!institution_id || !branch_id || !service_id || !name || !phone || !visit_date || !window_start) {
        return res.status(400).json({ error: 'Missing required booking fields' });
      }

      const [{ data: inst }, { data: br }, { data: svc }] = await Promise.all([
        supabase.from('institutions').select('id,name').eq('id', institution_id).single(),
        supabase.from('branches').select('id,name').eq('id', branch_id).single(),
        supabase.from('services').select('id,name,minutes').eq('id', service_id).single(),
      ]);
      if (!inst || !br || !svc) return res.status(400).json({ error: 'Unknown institution, branch or service' });

      const { count, error: cErr } = await supabase
        .from('tickets')
        .select('id', { count: 'exact', head: true })
        .eq('branch_id', branch_id)
        .eq('visit_date', visit_date)
        .in('status', ['waiting', 'called', 'serving']);
      if (cErr) throw cErr;
      if ((count ?? 0) >= 96) return res.status(409).json({ error: 'That window is fully booked. Try another slot.' });

      const position = (count ?? 0) + 1;
      const eta = Math.min(90, position * (svc.minutes || 8));

      let inserted = null;
      for (let attempt = 0; attempt < 3 && !inserted; attempt++) {
        const { data, error } = await supabase
          .from('tickets')
          .insert({
            code: genCode(),
            institution_id,
            institution_name: inst.name,
            branch_id,
            branch_name: br.name,
            service_id,
            service_name: svc.name,
            user_name: name,
            phone,
            email: email || null,
            visit_date,
            window_start,
            window_end,
            position,
            eta_min: eta,
            status: 'waiting',
          })
          .select()
          .single();
        if (!error) inserted = data;
      }
      if (!inserted) return res.status(500).json({ error: 'Could not create your ticket. Please try again.' });
      return res.status(201).json(inserted);
    }

    if (req.method === 'PUT') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { id, action } = req.body || {};
      if (!id || !action) return res.status(400).json({ error: 'Missing id or action' });
      const MAP = {
        call: { status: 'serving', counter: 1 + Math.floor(Math.random() * 6) },
        serve: { status: 'serving' },
        recall: { status: 'serving' },
        complete: { status: 'completed' },
        noshow: { status: 'noshow' },
        cancel: { status: 'cancelled' },
      };
      const patch = MAP[action];
      if (!patch) return res.status(400).json({ error: 'Unknown action' });
      const { data, error } = await supabase.from('tickets').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const user = await requireUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.body || {};
      const { error } = await supabase.from('tickets').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
