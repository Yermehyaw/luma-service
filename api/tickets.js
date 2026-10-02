import supabase from './db-client.js';

function generateCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 100-999
  return `LM-${letter}${num}`;
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
          .select('*, institutions(name), branches(name), services(name)')
          .eq('code', code.toUpperCase())
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Ticket not found' });

        // Format to match frontend expected flat structure
        const formatted = {
          ...data,
          institution_name: data.institutions?.name,
          branch_name: data.branches?.name,
          service_name: data.services?.name
        };
        return res.status(200).json(formatted);
      }

      let query = supabase.from('tickets').select('*, institutions(name), branches(name), services(name)');
      if (branch_id) {
        query = query.eq('branch_id', branch_id);
      }
      if (visit_date) {
        query = query.eq('visit_date', visit_date);
      }

      const { data, error } = await query.order('created_at', { ascending: true });
      if (error) throw error;

      const formatted = data.map(t => ({
        ...t,
        institution_name: t.institutions?.name,
        branch_name: t.branches?.name,
        service_name: t.services?.name
      }));

      return res.status(200).json(formatted);
    }

    if (req.method === 'POST') {
      const { institution_id, branch_id, service_id, name, phone, email, visit_date, window_start, window_end, payment_status, payment_amount } = req.body;

      if (!institution_id || !branch_id || !service_id || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const code = generateCode();

      // Count existing tickets for this branch on this day to calculate queue position
      const { data: existing, error: countError } = await supabase
        .from('tickets')
        .select('id')
        .eq('branch_id', branch_id)
        .eq('visit_date', visit_date)
        .neq('status', 'cancelled');
      if (countError) throw countError;

      const position = (existing?.length || 0) + 1;

      const { data, error } = await supabase
        .from('tickets')
        .insert({
          code,
          institution_id,
          branch_id,
          service_id,
          name,
          phone,
          email,
          visit_date,
          window_start,
          window_end,
          status: 'waiting',
          position,
          counter: null,
          payment_status: payment_status || 'pending',
          payment_amount: payment_amount || 0
        })
        .select('*, institutions(name), branches(name), services(name)')
        .single();

      if (error) throw error;

      const formatted = {
        ...data,
        institution_name: data.institutions?.name,
        branch_name: data.branches?.name,
        service_name: data.services?.name
      };

      return res.status(201).json(formatted);
    }

    if (req.method === 'PUT') {
      const { id, status, counter, position, payment_status } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing ticket ID' });

      const updates = {};
      if (status !== undefined) updates.status = status;
      if (counter !== undefined) updates.counter = counter;
      if (position !== undefined) updates.position = position;
      if (payment_status !== undefined) updates.payment_status = payment_status;

      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select('*, institutions(name), branches(name), services(name)')
        .single();

      if (error) throw error;

      const formatted = {
        ...data,
        institution_name: data.institutions?.name,
        branch_name: data.branches?.name,
        service_name: data.services?.name
      };

      return res.status(200).json(formatted);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
