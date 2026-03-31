import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabaseAdmin, createUserClient } from './supabase.js';
import { authMiddleware, AuthenticatedRequest } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, phone } = req.body;
  
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true,
      phone_confirm: true
    });

    if (error) return res.status(400).json({ error: error.message });
    
    // Create initial profile
    if (data.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({ id: data.user.id, nickname: email?.split('@')[0] || '新用户' });
      
      if (profileError) console.error('Error creating profile:', profileError);
    }

    res.status(201).json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(401).json({ error: error.message });
    res.json({ session: data.session, user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Protected Routes ---
app.use(authMiddleware as any);

// Profile
app.get('/api/profile', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user!.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/api/profile', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(req.body)
    .eq('id', req.user!.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Plans
app.get('/api/plans', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('plans')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/plans', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('plans')
    .insert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/api/plans/:id', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('plans')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/plans/:id', async (req: AuthenticatedRequest, res) => {
  const { error } = await supabaseAdmin
    .from('plans')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Water Logs
app.get('/api/water-logs', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('water_logs')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/water-logs', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('water_logs')
    .insert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/water-logs/:id', async (req: AuthenticatedRequest, res) => {
  const { error } = await supabaseAdmin
    .from('water_logs')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Water Slots
app.get('/api/water-slots', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('water_slots')
    .select('*')
    .eq('user_id', req.user!.id)
    .eq('date', new Date().toISOString().split('T')[0]);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/api/water-slots/:id', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('water_slots')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Food Logs
app.get('/api/food-logs', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('food_logs')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/food-logs', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('food_logs')
    .insert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/food-logs/:id', async (req: AuthenticatedRequest, res) => {
  const { error } = await supabaseAdmin
    .from('food_logs')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Custom Trackers
app.get('/api/custom-trackers', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('custom_trackers')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/custom-trackers', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('custom_trackers')
    .insert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/api/custom-trackers/:id', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('custom_trackers')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/custom-trackers/:id', async (req: AuthenticatedRequest, res) => {
  const { error } = await supabaseAdmin
    .from('custom_trackers')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Weight Logs
app.get('/api/weight-logs', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('weight_logs')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('date', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/weight-logs', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('weight_logs')
    .insert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/weight-logs/:id', async (req: AuthenticatedRequest, res) => {
  const { error } = await supabaseAdmin
    .from('weight_logs')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user!.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Goals
app.get('/api/goals', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('goals')
    .select('*')
    .eq('user_id', req.user!.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/api/goals', async (req: AuthenticatedRequest, res) => {
  const { data, error } = await supabaseAdmin
    .from('goals')
    .upsert({ ...req.body, user_id: req.user!.id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
