import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase, isSupabaseConfigured } from './supabase.js';
import { defaultPortfolioData } from './defaultData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow dev and production origins
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory fallback store (used before Supabase credentials are added or when offline)
let localPortfolioData = JSON.parse(JSON.stringify(defaultPortfolioData));
let localMessages = [
  {
    id: "sample-msg-1",
    name: "Architectural Commission Lead",
    email: "client@studio.com",
    subject: "Full-Stack AI Project Partnership",
    message: "Hello Jeevan, we reviewed your machine learning systems and would like to discuss an intelligent system deployment.",
    status: "unread",
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

// Helper: Verify Admin Token/Password
function verifyAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const expectedKey = process.env.JWT_SECRET || 'super_secret_architectural_jwt_key_change_in_production';

  if (!adminKey || ((!expectedPassword || adminKey !== expectedPassword) && adminKey !== expectedKey && (process.env.JWT_SECRET || adminKey !== 'admin-authenticated-token'))) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid admin credentials required.'
    });
  }
  next();
}

/* ═════════════════════════════════════════════════════════════════════
   1. HEALTH & SYSTEM DIAGNOSTICS
   ═════════════════════════════════════════════════════════════════════ */
// Also runs a tiny query so uptime pings keep the free Supabase project from pausing
app.get('/api/health', async (req, res) => {
  let databaseReachable = null;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('portfolio').select('id').limit(1);
      databaseReachable = !error;
    } catch {
      databaseReachable = false;
    }
  }

  res.json({
    status: 'ok',
    service: 'JG Portfolio Architectural Backend',
    database: isSupabaseConfigured ? 'Supabase Connected' : 'Local Memory Mode (Awaiting Supabase keys in backend/.env)',
    supabaseConfigured: isSupabaseConfigured,
    databaseReachable,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/* ═════════════════════════════════════════════════════════════════════
   2. ADMIN AUTHENTICATION
   ═════════════════════════════════════════════════════════════════════ */
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const configuredEmail = (process.env.ADMIN_EMAIL || 'jeevangowdajeevan080@gmail.com').toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.'
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanPassword = password.trim();

  // 1. Try Supabase admin_users table if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (adminUser && adminUser.password_hash === cleanPassword) {
        return res.json({
          success: true,
          message: 'Authentication successful (via Supabase database)',
          token: process.env.JWT_SECRET || 'admin-authenticated-token',
          user: {
            email: adminUser.email,
            role: adminUser.role || 'super_admin'
          }
        });
      }
    } catch (err) {
      console.warn('Supabase admin check fallback:', err.message);
    }
  }

  // 2. Check environment credentials
  if (configuredPassword && cleanEmail === configuredEmail && cleanPassword === configuredPassword) {
    return res.json({
      success: true,
      message: 'Authentication successful',
      token: process.env.JWT_SECRET || 'admin-authenticated-token',
      user: {
        email: configuredEmail,
        role: 'super_admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials. Access denied.'
  });
});

/* ═════════════════════════════════════════════════════════════════════
   3. PORTFOLIO DATA ENDPOINTS
   ═════════════════════════════════════════════════════════════════════ */

// GET /api/portfolio -> Public: retrieves current portfolio data
app.get('/api/portfolio', async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('data, updated_at')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        console.warn('Supabase fetch error, using local fallback:', error.message);
        return res.json(localPortfolioData);
      }

      if (data && data.data) {
        localPortfolioData = data.data; // Keep sync
        return res.json(data.data);
      }

      // If table exists but no row exists yet, seed it with default data
      console.log('🌱 Seeding initial portfolio data into Supabase...');
      const { error: seedError } = await supabase
        .from('portfolio')
        .upsert({ id: 'main', data: defaultPortfolioData, updated_at: new Date().toISOString() });

      if (!seedError) {
        return res.json(defaultPortfolioData);
      }
    } catch (err) {
      console.error('Portfolio read exception:', err.message);
    }
  }

  // Fallback to local memory / default
  return res.json(localPortfolioData);
});

// POST or PUT /api/portfolio -> Protected: updates portfolio data
app.all(['/api/portfolio'], verifyAdmin, async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid portfolio data payload' });
  }

  payload.lastUpdated = new Date().toISOString();
  localPortfolioData = payload;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('portfolio')
        .upsert({
          id: 'main',
          data: payload,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase write error:', error.message);
        return res.status(500).json({
          success: false,
          error: 'Supabase write failed: ' + error.message,
          localSaved: true
        });
      }

      return res.json({
        success: true,
        message: 'Portfolio data successfully published to Supabase',
        lastUpdated: payload.lastUpdated
      });
    } catch (err) {
      console.error('Supabase upsert exception:', err.message);
      return res.status(500).json({ success: false, error: err.message, localSaved: true });
    }
  }

  return res.json({
    success: true,
    message: 'Portfolio saved in local memory mode (configure Supabase in backend/.env to persist permanently in database)',
    lastUpdated: payload.lastUpdated
  });
});

/* ═════════════════════════════════════════════════════════════════════
   4. CONTACTS / INQUIRIES ENDPOINTS
   ═════════════════════════════════════════════════════════════════════ */

// POST /api/contact -> Public: visitor submits contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and message are required fields.'
    });
  }

  if (message.length > 2500) {
    return res.status(400).json({
      success: false,
      error: 'Message exceeds character limit of 2500 characters.'
    });
  }

  const newContact = {
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : 'General Inquiry',
    message: message.trim(),
    status: 'unread',
    created_at: new Date().toISOString(),
    user_agent: req.headers['user-agent'] || null,
    ip_address: req.ip || req.connection?.remoteAddress || null
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([newContact])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert contact error:', error.message);
        // Fallback to local
        const fallbackId = 'msg-' + Date.now();
        localMessages.unshift({ id: fallbackId, ...newContact });
        return res.json({ success: true, id: fallbackId, message: 'Message received' });
      }

      localMessages.unshift(data);
      return res.json({ success: true, id: data.id, message: 'Message received successfully' });
    } catch (err) {
      console.error('Contact submit exception:', err.message);
    }
  }

  // Local fallback
  const id = 'msg-' + Date.now();
  localMessages.unshift({ id, ...newContact });
  return res.json({
    success: true,
    id,
    message: 'Message delivered to studio channel'
  });
});

// GET /api/messages -> Protected: admin reviews inbound inquiries
app.get('/api/messages', verifyAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.json({ success: true, messages: data });
      }
      console.warn('Supabase fetch messages error, using local fallback:', error?.message);
    } catch (err) {
      console.error('Messages fetch exception:', err.message);
    }
  }

  return res.json({ success: true, messages: localMessages });
});

// PATCH /api/messages/:id/status -> Protected: toggle read/unread status
app.patch('/api/messages/:id/status', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'read' && status !== 'unread') {
    return res.status(400).json({ success: false, error: 'Status must be "read" or "unread"' });
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Supabase update status error:', error.message);
      }
    } catch (err) {
      console.error('Update status exception:', err.message);
    }
  }

  // Update in local store
  const msg = localMessages.find(m => String(m.id) === String(id));
  if (msg) msg.status = status;

  return res.json({ success: true, message: `Status updated to ${status}` });
});

// DELETE /api/messages/:id -> Protected: delete message
app.delete('/api/messages/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error.message);
      }
    } catch (err) {
      console.error('Delete message exception:', err.message);
    }
  }

  localMessages = localMessages.filter(m => String(m.id) !== String(id));
  return res.json({ success: true, message: 'Message deleted' });
});

// POST /api/messages/mark-all-read -> Protected: mark all read
app.post('/api/messages/mark-all-read', verifyAdmin, async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('contacts')
        .update({ status: 'read', updated_at: new Date().toISOString() })
        .eq('status', 'unread');
    } catch (err) {
      console.error('Batch read error:', err.message);
    }
  }

  localMessages.forEach(m => { m.status = 'read'; });
  return res.json({ success: true, message: 'All messages marked as read' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`🚀 JG Portfolio Architectural Backend running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${isSupabaseConfigured ? 'Supabase (' + process.env.SUPABASE_URL + ')' : 'Local Memory Mode (Awaiting Supabase keys)'}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);
});
