/**
 * Determine and normalize the Backend API URL:
 * - Trims whitespace and trailing slashes.
 * - Appends /api if not already included.
 * - Defaults to Vite dev proxy (/api) if VITE_API_URL is omitted.
 */
export function getApiBase() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl.trim() === '') {
    return '/api';
  }
  let clean = envUrl.trim().replace(/\/+$/, '');
  if (!clean.endsWith('/api')) {
    clean = `${clean}/api`;
  }
  return clean;
}

export const API_BASE = getApiBase();

/**
 * Background warm-up ping:
 * Render free web services go to sleep after 15 mins of inactivity.
 * Pinging /api/health immediately when the frontend loads wakes up the container early.
 */
let warmUpPromise = null;
export function warmUpBackend() {
  if (!warmUpPromise && typeof window !== 'undefined') {
    warmUpPromise = fetch(`${API_BASE}/health`, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .catch((err) => {
        console.debug('Render backend warm-up in progress...', err.message);
        return null;
      });
  }
  return warmUpPromise;
}

// Initiate non-blocking warm-up ping on page load
if (typeof window !== 'undefined') {
  warmUpBackend();
}

/**
 * Fetch dynamic portfolio data from backend / Supabase
 */
export async function fetchLivePortfolio() {
  try {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend server connecting or offline, utilizing default architectural bundle:', err.message);
  }
  return null;
}

/**
 * Send contact form transmission to backend / Supabase
 */
export async function sendContactMessage({ name, email, subject, message }) {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        subject: subject ? subject.trim() : 'General Inquiry',
        message: message.trim()
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, id: data.id };
    }
    return { success: false, error: data.error || 'Failed to transmit message' };
  } catch (error) {
    console.error('Contact transmission failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Admin Authentication
 */
export async function loginAdmin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, token: data.token, user: data.user };
    }
    return { success: false, error: data.error || 'Invalid credentials' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Save Portfolio data to backend / Supabase
 */
export async function savePortfolioData(portfolioData, token) {
  try {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(portfolioData)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message };
    }
    return { success: false, error: data.error || 'Failed to save portfolio data' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch inbound contact messages for admin
 */
export async function fetchInboundMessages(token) {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, messages: data.messages || [] };
    }
    return { success: false, messages: [], error: 'Failed to fetch messages' };
  } catch (err) {
    return { success: false, messages: [], error: err.message };
  }
}

/**
 * Update message read/unread status
 */
export async function updateMessageStatus(id, status, token) {
  try {
    const res = await fetch(`${API_BASE}/messages/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Delete contact message
 */
export async function deleteMessage(id, token) {
  try {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Check backend and Supabase connectivity
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline
  }
  return { status: 'offline', database: 'Offline', supabaseConfigured: false };
}

