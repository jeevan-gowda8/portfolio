import React, { useState, useEffect } from "react";
import "./admin.css";
import Logo from "../components/Logo";
import { portfolioData as initialPortfolioData } from "../data/portfolioData";
import {
  fetchLivePortfolio,
  savePortfolioData,
  loginAdmin,
  fetchInboundMessages,
  updateMessageStatus,
  deleteMessage,
  checkBackendHealth
} from "../api";
import { TOGGLEABLE_SECTIONS } from "../siteSettings";
import {
  FaTachometerAlt,
  FaUserTie,
  FaLayerGroup,
  FaProjectDiagram,
  FaGraduationCap,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaSave,
  FaPlus,
  FaTrashAlt,
  FaExternalLinkAlt,
  FaTerminal,
  FaTags,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaEnvelopeOpen,
  FaEye
} from "react-icons/fa";

export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("jg_admin_token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jg_admin_user") || "null");
    } catch {
      return null;
    }
  });

  // Login form state (pre-filled with seeded admin credentials)
  const [loginEmail, setLoginEmail] = useState("jeevangowdajeevan080@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App workspace state
  const [activeTab, setActiveTab] = useState("overview");
  const [portfolio, setPortfolio] = useState(initialPortfolioData);
  const [messages, setMessages] = useState([]);
  const [health, setHealth] = useState({ status: "checking", database: "Checking...", supabaseConfigured: false });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Trigger Toast Notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load portfolio & health on mount
  useEffect(() => {
    async function loadInitial() {
      const live = await fetchLivePortfolio();
      if (live) {
        setPortfolio(prev => ({ ...prev, ...live }));
      }
      const h = await checkBackendHealth();
      setHealth(h);
    }
    loadInitial();
  }, []);

  // Load messages when authenticated
  useEffect(() => {
    if (token) {
      async function loadMsgs() {
        const res = await fetchInboundMessages(token);
        if (res.success) {
          setMessages(res.messages);
        }
      }
      loadMsgs();
    }
  }, [token]);

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const res = await loginAdmin(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("jg_admin_token", res.token);
      localStorage.setItem("jg_admin_user", JSON.stringify(res.user));
      showToast("Welcome back, Jeevan! Console authorized.");
    } else {
      setLoginError(res.error || "Authentication failed. Check your password.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("jg_admin_token");
    localStorage.removeItem("jg_admin_user");
    showToast("Signed out of administrative console", "info");
  };

  // Handle Save & Publish to Supabase
  const handleSave = async () => {
    setIsSaving(true);
    const res = await savePortfolioData(portfolio, token);
    setIsSaving(false);

    if (res.success) {
      showToast("Portfolio changes successfully published to database!");
    } else {
      showToast(res.error || "Failed to save portfolio changes", "danger");
    }
  };

  // Message Operations
  const handleToggleMessageRead = async (id, currentStatus) => {
    const nextStatus = currentStatus === "read" ? "unread" : "read";
    const ok = await updateMessageStatus(id, nextStatus, token);
    if (ok) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
      showToast(`Marked message as ${nextStatus}`);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Permanently delete this inquiry?")) return;
    const ok = await deleteMessage(id, token);
    if (ok) {
      setMessages(prev => prev.filter(m => m.id !== id));
      showToast("Inquiry removed from studio records");
    }
  };

  // Skills Matrix Mutation Handlers
  const handleAddSkillCategory = () => {
    const newCat = {
      category: "Specialized Engineering",
      id: "cat-" + Date.now(),
      description: "Advanced technological domain and architectures",
      items: [
        { name: "New Technology", level: 85, note: "Production proficiency & architecture" }
      ]
    };
    setPortfolio(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newCat]
    }));
    showToast("New skill category domain added");
  };

  const handleRemoveSkillCategory = (catIdx) => {
    if (!window.confirm("Delete this entire skill domain category?")) return;
    setPortfolio(prev => {
      const updated = [...(prev.skills || [])];
      updated.splice(catIdx, 1);
      return { ...prev, skills: updated };
    });
  };

  const handleUpdateCategoryMeta = (catIdx, field, value) => {
    setPortfolio(prev => {
      const updated = [...(prev.skills || [])];
      updated[catIdx] = { ...updated[catIdx], [field]: value };
      return { ...prev, skills: updated };
    });
  };

  const handleAddSkillItem = (catIdx) => {
    setPortfolio(prev => {
      const updated = [...(prev.skills || [])];
      const items = [...(updated[catIdx].items || [])];
      items.push({ name: "Tool / Framework", level: 80, note: "Key libraries and competencies" });
      updated[catIdx] = { ...updated[catIdx], items };
      return { ...prev, skills: updated };
    });
  };

  const handleRemoveSkillItem = (catIdx, itemIdx) => {
    setPortfolio(prev => {
      const updated = [...(prev.skills || [])];
      const items = [...(updated[catIdx].items || [])];
      items.splice(itemIdx, 1);
      updated[catIdx] = { ...updated[catIdx], items };
      return { ...prev, skills: updated };
    });
  };

  const handleUpdateSkillItem = (catIdx, itemIdx, field, value) => {
    setPortfolio(prev => {
      const updated = [...(prev.skills || [])];
      const items = [...(updated[catIdx].items || [])];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      updated[catIdx] = { ...updated[catIdx], items };
      return { ...prev, skills: updated };
    });
  };

  // Settings helpers
  const updatePersonal = (field, value) => setPortfolio(p => ({
    ...p,
    personal: { ...p.personal, [field]: value }
  }));

  const updateSocial = (key, value) => setPortfolio(p => ({
    ...p,
    personal: { ...p.personal, socials: { ...(p.personal?.socials || {}), [key]: value } }
  }));

  const updateSettings = (field, value) => setPortfolio(p => ({
    ...p,
    settings: { ...(p.settings || {}), [field]: value }
  }));

  const updateSectionVisibility = (id, visible) => setPortfolio(p => ({
    ...p,
    settings: {
      ...(p.settings || {}),
      sections: { ...(p.settings?.sections || {}), [id]: visible }
    }
  }));

  const handleDownloadBackup = () => {
    const blob = new Blob([JSON.stringify(portfolio, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup downloaded");
  };

  // Projects Mutation Handlers
  const handleAddProject = () => {
    const newProj = {
      id: `project-${Date.now()}`,
      title: "New Project",
      subtitle: "",
      category: "Web Development",
      badge: "",
      metaYear: String(new Date().getFullYear()),
      description: "",
      highlights: [],
      tags: [],
      githubUrl: "",
      demoUrl: "",
      featured: true
    };
    setPortfolio(prev => ({
      ...prev,
      projects: [newProj, ...(prev.projects || [])]
    }));
    showToast("New project blueprint added");
  };

  const handleRemoveProject = (index) => {
    if (!window.confirm("Remove this project from your portfolio?")) return;
    setPortfolio(prev => {
      const updated = [...(prev.projects || [])];
      updated.splice(index, 1);
      return { ...prev, projects: updated };
    });
  };

  const handleUpdateProject = (index, field, value) => {
    setPortfolio(prev => {
      const updated = [...(prev.projects || [])];
      const next = { ...updated[index], [field]: value };
      // Drop the old github/demo keys once the standard githubUrl/demoUrl are edited
      if (field === "githubUrl") delete next.github;
      if (field === "demoUrl") delete next.demo;
      updated[index] = next;
      return { ...prev, projects: updated };
    });
  };

  // Education Mutation Handlers
  const handleAddEducation = () => {
    const newEdu = {
      degree: "Credential / Degree Program",
      institution: "Academic Institution",
      dateRange: "2024 — 2028",
      badge: "In Progress",
      location: "Bengaluru, India",
      description: "Rigorous theoretical and applied immersion in computational science.",
      skills: ["Mathematics", "Algorithms", "Systems"]
    };
    setPortfolio(prev => ({
      ...prev,
      education: [newEdu, ...(prev.education || [])]
    }));
    showToast("Educational credential added");
  };

  const handleRemoveEducation = (index) => {
    if (!window.confirm("Remove this education entry?")) return;
    setPortfolio(prev => {
      const updated = [...(prev.education || [])];
      updated.splice(index, 1);
      return { ...prev, education: updated };
    });
  };

  const handleUpdateEducation = (index, field, value) => {
    setPortfolio(prev => {
      const updated = [...(prev.education || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Total Counts
  const totalSkillsCount = (portfolio.skills || []).reduce(
    (acc, cat) => acc + (cat.items || []).length, 0
  );
  const unreadMessagesCount = messages.filter(m => m.status === "unread").length;

  /* ═══════════════════════════════════════════════════════════
     VIEW 1: ADMIN LOGIN PORTAL
     ═══════════════════════════════════════════════════════════ */
  if (!token) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-logo-container">
            <Logo size={72} />
          </div>

          <h2 className="admin-login-title">Architectural Console</h2>
          <p className="admin-login-subtitle">
            Authenticated administrative access for Jeevan Gowda A V
          </p>

          {loginError && (
            <div style={{
              background: "#FFF5F5",
              color: "#DC2626",
              border: "1px solid #FED7D7",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              marginBottom: "16px",
              textAlign: "left"
            }}>
              <FaExclamationTriangle style={{ marginRight: "6px" }} /> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label className="admin-label">Admin Email</label>
              <input
                type="email"
                required
                className="admin-input"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@jeevangowda.dev"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Access Key / Password</label>
              <input
                type="password"
                required
                className="admin-input"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-gold"
              style={{ justifyContent: "center", marginTop: "10px", width: "100%", padding: "12px" }}
            >
              <FaLock /> {isLoggingIn ? "Verifying Access..." : "Enter Command Center"}
            </button>
          </form>
        </div>

        {toast && (
          <div className="admin-toast">
            <FaCheckCircle style={{ color: "var(--admin-gold)" }} />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     VIEW 2: FULL REACT ADMIN CONSOLE
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="admin-layout">
      {/* Top Architectural Header */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <div className="admin-brand-logo">
            <Logo size={40} />
          </div>
          <div className="admin-brand-info">
            <h1>Jeevan Gowda A V</h1>
            <span>Studio Admin Control</span>
          </div>
        </div>

        <div className="admin-header-actions">
          {/* Database Connectivity Indicator */}
          <div className="admin-db-status-pill">
            <span className={`status-dot ${health.supabaseConfigured ? 'active' : 'fallback'}`} />
            <span>{health.supabaseConfigured ? "Supabase Connected" : "Local Mode"}</span>
          </div>

          {/* View Live Portfolio Link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            <FaExternalLinkAlt /> View Live Site
          </a>

          {/* Save & Publish Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-gold"
          >
            <FaSave /> {isSaving ? "Publishing..." : "Save & Publish"}
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="btn-secondary"
            title="Sign Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Active Tab Content */}
      <div className="admin-main-container">
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar">
          <button
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaTachometerAlt /> Overview
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FaUserTie /> Hero & Identity
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <FaLayerGroup /> Skills Matrix ({totalSkillsCount})
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FaProjectDiagram /> Projects ({(portfolio.projects || []).length})
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <FaGraduationCap /> Education ({(portfolio.education || []).length})
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <FaEnvelope /> Inquiries {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
        </aside>

        {/* Content Workspace */}
        <main className="admin-content-area">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Portfolio Overview & Metrics</h2>
                <p className="admin-section-desc">
                  Live state of your architectural portfolio presentation and incoming commissions.
                </p>
              </div>

              <div className="metrics-row">
                <div className="metric-box">
                  <div className="metric-title">Published Projects</div>
                  <div className="metric-num">{(portfolio.projects || []).length}</div>
                </div>

                <div className="metric-box">
                  <div className="metric-title">Technical Capabilities</div>
                  <div className="metric-num">{totalSkillsCount}</div>
                </div>

                <div className="metric-box">
                  <div className="metric-title">Inbound Inquiries</div>
                  <div className="metric-num">{messages.length}</div>
                </div>

                <div className="metric-box">
                  <div className="metric-title">Database Mode</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--admin-gold-dark)", marginTop: "8px" }}>
                    {health.supabaseConfigured ? "Supabase PostgreSQL" : "Local Seed Mode"}
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
                  Quick Commands
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--admin-text-subtle)", marginBottom: "16px" }}>
                  Select a section from the left sidebar to update project showcases, fine-tune skill competencies, or review transmission logs from visitors.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button className="btn-secondary" onClick={() => setActiveTab('skills')}>
                    <FaLayerGroup /> Edit Skills Matrix
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveTab('projects')}>
                    <FaProjectDiagram /> Manage Projects
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveTab('messages')}>
                    <FaEnvelope /> View Inquiries ({unreadMessagesCount} unread)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL & HERO */}
          {activeTab === 'personal' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Hero & Personal Information</h2>
                <p className="admin-section-desc">
                  Configure your primary introduction, bio summary, resume links, and coordinates.
                </p>
              </div>

              <div className="admin-card">
                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Full Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={portfolio.personal?.name || ""}
                      onChange={(e) => setPortfolio(p => ({
                        ...p,
                        personal: { ...p.personal, name: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Professional Role Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={portfolio.personal?.title || ""}
                      onChange={(e) => setPortfolio(p => ({
                        ...p,
                        personal: { ...p.personal, title: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Hero Tagline / Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={portfolio.personal?.tagline || ""}
                    onChange={(e) => setPortfolio(p => ({
                      ...p,
                      personal: { ...p.personal, tagline: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Architectural Bio Summary</label>
                  <textarea
                    rows={4}
                    className="admin-textarea"
                    value={portfolio.personal?.bio || ""}
                    onChange={(e) => setPortfolio(p => ({
                      ...p,
                      personal: { ...p.personal, bio: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-grid-3">
                  <div className="admin-form-group">
                    <label className="admin-label">Contact Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={portfolio.personal?.email || ""}
                      onChange={(e) => setPortfolio(p => ({
                        ...p,
                        personal: { ...p.personal, email: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Geographic Location</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={portfolio.personal?.location || ""}
                      onChange={(e) => setPortfolio(p => ({
                        ...p,
                        personal: { ...p.personal, location: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Resume Document URL</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={portfolio.personal?.resumeUrl || ""}
                      onChange={(e) => setPortfolio(p => ({
                        ...p,
                        personal: { ...p.personal, resumeUrl: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS MATRIX (LUXURY ARCHITECTURAL REDESIGN) */}
          {activeTab === 'skills' && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 className="admin-section-title">Technical Capabilities & Skill Matrix</h2>
                  <p className="admin-section-desc">
                    Manage technology domains, proficiency levels, and competency taglines.
                  </p>
                </div>
                <button className="btn-gold" onClick={handleAddSkillCategory}>
                  <FaPlus /> Add Domain Category
                </button>
              </div>

              {(portfolio.skills || []).map((cat, catIdx) => (
                <div key={cat.id || catIdx} className="admin-card">
                  {/* Category Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--admin-gold-dark)",
                      background: "var(--admin-canvas)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--admin-border)"
                    }}>
                      Domain #{catIdx + 1}
                    </span>
                    <button
                      className="btn-danger"
                      onClick={() => handleRemoveSkillCategory(catIdx)}
                    >
                      <FaTrashAlt /> Delete Category
                    </button>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Category Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={cat.category || ""}
                        onChange={(e) => handleUpdateCategoryMeta(catIdx, "category", e.target.value)}
                        placeholder="e.g. Artificial Intelligence & ML"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Slug ID</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={cat.id || ""}
                        onChange={(e) => handleUpdateCategoryMeta(catIdx, "id", e.target.value)}
                        placeholder="e.g. ai"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Domain Scope Description</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={cat.description || ""}
                      onChange={(e) => handleUpdateCategoryMeta(catIdx, "description", e.target.value)}
                      placeholder="Brief overview of capabilities..."
                    />
                  </div>

                  {/* Competency Items in this Category */}
                  <div style={{ marginTop: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <label className="admin-label" style={{ margin: 0 }}>
                        Competency Items ({(cat.items || []).length})
                      </label>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                        onClick={() => handleAddSkillItem(catIdx)}
                      >
                        <FaPlus /> Add Skill Item
                      </button>
                    </div>

                    {(cat.items || []).map((item, itemIdx) => (
                      <div key={itemIdx} className="react-skill-card">
                        {/* Column 1: Skill Title and Notes */}
                        <div className="react-skill-inputs">
                          <div className="react-input-wrap">
                            <i><FaTerminal /></i>
                            <input
                              type="text"
                              className="admin-input"
                              style={{ fontWeight: 600 }}
                              value={item.name || ""}
                              onChange={(e) => handleUpdateSkillItem(catIdx, itemIdx, "name", e.target.value)}
                              placeholder="Technology Name (e.g. Deep Learning)"
                            />
                          </div>

                          <div className="react-input-wrap">
                            <i><FaTags /></i>
                            <input
                              type="text"
                              className="admin-input"
                              style={{ fontSize: "0.82rem", color: "var(--admin-text-subtle)" }}
                              value={item.note || ""}
                              onChange={(e) => handleUpdateSkillItem(catIdx, itemIdx, "note", e.target.value)}
                              placeholder="Toolsets, frameworks, notes (e.g. PyTorch, YOLO)"
                            />
                          </div>
                        </div>

                        {/* Column 2: Proficiency Slider & Badge */}
                        <div className="react-skill-proficiency">
                          <div className="react-proficiency-header">
                            <span className="react-proficiency-label">Proficiency Level</span>
                            <span className="react-slider-badge">{item.level || 80}%</span>
                          </div>
                          <div className="react-slider-track">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={item.level || 80}
                              className="react-slider-input"
                              onChange={(e) => handleUpdateSkillItem(catIdx, itemIdx, "level", parseInt(e.target.value, 10))}
                            />
                          </div>
                        </div>

                        {/* Column 3: Delete Action */}
                        <button
                          className="react-delete-btn"
                          onClick={() => handleRemoveSkillItem(catIdx, itemIdx)}
                          title="Delete Skill"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 className="admin-section-title">Projects Showcase</h2>
                  <p className="admin-section-desc">
                    Manage featured architecture systems, repositories, and demonstration URLs.
                  </p>
                </div>
                <button className="btn-gold" onClick={handleAddProject}>
                  <FaPlus /> Add Project
                </button>
              </div>

              {(portfolio.projects || []).map((proj, pIdx) => (
                <div key={pIdx} className="admin-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                      #{pIdx + 1} — {proj.title || "Untitled Project"}
                    </span>
                    <button className="btn-danger" onClick={() => handleRemoveProject(pIdx)}>
                      <FaTrashAlt /> Delete Project
                    </button>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Project Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={proj.title || ""}
                        onChange={(e) => handleUpdateProject(pIdx, "title", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Category</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={proj.category || ""}
                        onChange={(e) => handleUpdateProject(pIdx, "category", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Subtitle (optional)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Official Government Web Portal"
                        value={proj.subtitle || ""}
                        onChange={(e) => handleUpdateProject(pIdx, "subtitle", e.target.value)}
                      />
                    </div>

                    <div className="admin-grid-2" style={{ gap: "12px" }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Badge (optional)</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="e.g. Client Project"
                          value={proj.badge || ""}
                          onChange={(e) => handleUpdateProject(pIdx, "badge", e.target.value)}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Year</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="2025"
                          value={proj.metaYear || ""}
                          onChange={(e) => handleUpdateProject(pIdx, "metaYear", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Description</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={proj.description || ""}
                      onChange={(e) => handleUpdateProject(pIdx, "description", e.target.value)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Key Highlights (one per line, optional)</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      placeholder={"Built responsive pages for 10+ schemes\nAdmin panel for publishing reports"}
                      value={(proj.highlights || []).join("\n")}
                      onChange={(e) => handleUpdateProject(
                        pIdx,
                        "highlights",
                        e.target.value.split("\n").map(h => h.trimStart())
                      )}
                      onBlur={(e) => handleUpdateProject(
                        pIdx,
                        "highlights",
                        e.target.value.split("\n").map(h => h.trim()).filter(Boolean)
                      )}
                    />
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">GitHub Repository Link (leave empty to hide)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="https://github.com/jeevan-gowda8/your-repo"
                        value={proj.githubUrl ?? proj.github ?? ""}
                        onChange={(e) => handleUpdateProject(pIdx, "githubUrl", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Live Demo URL (leave empty to hide)</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="https://your-project.netlify.app"
                        value={proj.demoUrl ?? proj.demo ?? ""}
                        onChange={(e) => handleUpdateProject(pIdx, "demoUrl", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={(proj.tags || []).join(", ")}
                      onChange={(e) => handleUpdateProject(
                        pIdx,
                        "tags",
                        e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: EDUCATION */}
          {activeTab === 'education' && (
            <div>
              <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 className="admin-section-title">Education & Credentials</h2>
                  <p className="admin-section-desc">
                    Manage academic qualifications, degrees, and core competencies.
                  </p>
                </div>
                <button className="btn-gold" onClick={handleAddEducation}>
                  <FaPlus /> Add Credential
                </button>
              </div>

              {(portfolio.education || []).map((edu, eIdx) => (
                <div key={eIdx} className="admin-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                      #{eIdx + 1} — {edu.degree || "Degree"}
                    </span>
                    <button className="btn-danger" onClick={() => handleRemoveEducation(eIdx)}>
                      <FaTrashAlt /> Delete
                    </button>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Degree / Program Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={edu.degree || ""}
                        onChange={(e) => handleUpdateEducation(eIdx, "degree", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Institution</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={edu.institution || ""}
                        onChange={(e) => handleUpdateEducation(eIdx, "institution", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-grid-3">
                    <div className="admin-form-group">
                      <label className="admin-label">Date Range</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={edu.dateRange || ""}
                        onChange={(e) => handleUpdateEducation(eIdx, "dateRange", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Status Badge</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={edu.badge || ""}
                        onChange={(e) => handleUpdateEducation(eIdx, "badge", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Location</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={edu.location || ""}
                        onChange={(e) => handleUpdateEducation(eIdx, "location", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Pedagogical Description</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={edu.description || ""}
                      onChange={(e) => handleUpdateEducation(eIdx, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: INQUIRIES & MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Visitor Transmissions & Inquiries</h2>
                <p className="admin-section-desc">
                  Messages received via the portfolio contact form, stored in Supabase PostgreSQL.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="admin-card" style={{ textAlign: "center", padding: "40px", color: "var(--admin-text-subtle)" }}>
                  <FaEnvelopeOpen style={{ fontSize: "2.5rem", color: "var(--admin-gold)", marginBottom: "12px" }} />
                  <div>No inquiries received yet. Visitors can contact you through the portfolio contact form.</div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`inquiry-card ${msg.status === 'unread' ? 'unread' : ''}`}>
                    <div className="inquiry-header">
                      <div>
                        <span className="inquiry-sender">{msg.name}</span>
                        <span className="inquiry-email">&lt;{msg.email}&gt;</span>
                      </div>
                      <span className="inquiry-time">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--admin-gold-dark)", marginBottom: "6px" }}>
                      Subject: {msg.subject || "General Inquiry"}
                    </div>

                    <div className="inquiry-body">
                      {msg.message}
                    </div>

                    <div className="inquiry-actions">
                      <button
                        className="btn-secondary"
                        style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                        onClick={() => handleToggleMessageRead(msg.id, msg.status)}
                      >
                        {msg.status === 'read' ? "Mark Unread" : "Mark as Read"}
                      </button>

                      <button
                        className="btn-danger"
                        style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">Settings</h2>
                <p className="admin-section-desc">
                  Availability, social profiles, visible sections and search appearance. Click <strong>Save &amp; Publish</strong> to apply.
                </p>
              </div>

              {/* Availability */}
              <div className="admin-card">
                <h3 className="admin-settings-title">Availability</h3>
                <label className="admin-toggle-row">
                  <span>
                    <strong>Open to work</strong>
                    <small>Shows the green "available" badge on the home, about and contact sections.</small>
                  </span>
                  <input
                    type="checkbox"
                    className="admin-switch"
                    checked={portfolio.personal?.openToWork !== false}
                    onChange={(e) => updatePersonal("openToWork", e.target.checked)}
                  />
                </label>
                <div className="admin-form-group" style={{ marginTop: "16px", marginBottom: 0 }}>
                  <label className="admin-label">Availability Message</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Available for Projects & Full-time Roles"
                    value={portfolio.personal?.availability || ""}
                    onChange={(e) => updatePersonal("availability", e.target.value)}
                  />
                </div>
              </div>

              {/* Social profiles */}
              <div className="admin-card">
                <h3 className="admin-settings-title">Social Profiles</h3>
                <div className="admin-grid-2">
                  {[
                    ["github", "GitHub", "https://github.com/jeevan-gowda8"],
                    ["linkedin", "LinkedIn", "https://www.linkedin.com/in/your-profile"],
                    ["instagram", "Instagram", "https://www.instagram.com/your-handle"],
                    ["email", "Email Link", "mailto:you@example.com"]
                  ].map(([key, label, placeholder]) => (
                    <div className="admin-form-group" key={key}>
                      <label className="admin-label">{label}</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder={placeholder}
                        value={portfolio.personal?.socials?.[key] || ""}
                        onChange={(e) => updateSocial(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section visibility */}
              <div className="admin-card">
                <h3 className="admin-settings-title">Visible Sections</h3>
                <p className="admin-settings-hint">Hidden sections disappear from the page, navigation and footer.</p>
                <div className="admin-toggle-grid">
                  {TOGGLEABLE_SECTIONS.map((section) => (
                    <label className="admin-toggle-row" key={section.id}>
                      <span><strong>{section.label}</strong></span>
                      <input
                        type="checkbox"
                        className="admin-switch"
                        checked={portfolio.settings?.sections?.[section.id] !== false}
                        onChange={(e) => updateSectionVisibility(section.id, e.target.checked)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="admin-card">
                <h3 className="admin-settings-title">Search &amp; Sharing</h3>
                <div className="admin-form-group">
                  <label className="admin-label">Browser Tab Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Jeevan Gowda A V — AI & Full-Stack Developer"
                    value={portfolio.settings?.siteTitle || ""}
                    onChange={(e) => updateSettings("siteTitle", e.target.value)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Search Description</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    placeholder="Portfolio of Jeevan Gowda A V — Building intelligent systems with AI, Machine Learning & IoT"
                    value={portfolio.settings?.metaDescription || ""}
                    onChange={(e) => updateSettings("metaDescription", e.target.value)}
                  />
                </div>
              </div>

              {/* Backup & account */}
              <div className="admin-card">
                <h3 className="admin-settings-title">Backup &amp; Account</h3>
                <div className="admin-toggle-row">
                  <span>
                    <strong>Download backup</strong>
                    <small>Saves all portfolio content as a JSON file.</small>
                  </span>
                  <button className="btn-secondary" onClick={handleDownloadBackup}>
                    Download
                  </button>
                </div>
                <div className="admin-toggle-row">
                  <span>
                    <strong>Signed in as</strong>
                    <small>{user?.email || "Administrator"}</small>
                  </span>
                  <button className="btn-danger" onClick={handleLogout}>
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Feedback Toast */}
      {toast && (
        <div className="admin-toast">
          <FaCheckCircle style={{ color: "var(--admin-gold)" }} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
