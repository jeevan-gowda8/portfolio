import React, { useState } from "react";
import { FiMail, FiMapPin, FiClock, FiSend, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { sendContactMessage } from "../api";

export default function Contact({ data }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ loading: false, success: false, error: "Please fill in your name, email and message." });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    const result = await sendContactMessage(formData);
    if (result.success) {
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      setStatus({
        loading: false,
        success: false,
        error: "Something went wrong sending your message. Please email me directly at jeevangowdajeevan080@gmail.com"
      });
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ marginBottom: "3.5rem" }}>
            <div className="section-badge">
              <span>CONTACT</span>
            </div>
            <h2 className="headline-lg">
              Let's Build Something <br />
              <span className="text-gold-gradient">Remarkable Together</span>
            </h2>
            <p className="section-subtitle">
              Have a project in mind, a role to fill, or just want to say hello? Send a message and I'll get back to you within 24 hours.
            </p>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem"
          }}
          className="contact-layout-grid"
        >
          {/* Left Column: Direct Index Data with Scroll Reveal */}
          <ScrollReveal direction="up" delay={0.2}>
            <div
              className="arch-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "20px",
                height: "100%"
              }}
            >
              <div>
                <div className="label-sm" style={{ color: "var(--accent-gold)", marginBottom: "1rem" }}>
                  GET IN TOUCH
                </div>
                <h3 className="headline-md" style={{ marginBottom: "1rem" }}>
                  Direct Channels
                </h3>
                <p className="body-md" style={{ marginBottom: "2.5rem" }}>
                  Prefer email? Reach out directly — I personally read and reply to every message.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ paddingBottom: "1.25rem", borderBottom: "1px solid var(--gold-border)" }}>
                    <span className="label-sm" style={{ color: "var(--charcoal-subtle)", display: "block", marginBottom: "0.25rem" }}>
                      EMAIL
                    </span>
                    <a
                      href={`mailto:${data?.personal?.email || "jeevangowdajeevan080@gmail.com"}`}
                      className="headline-sm"
                      style={{ color: "var(--charcoal-primary)", textDecoration: "none" }}
                    >
                      {data?.personal?.email || "jeevangowdajeevan080@gmail.com"}
                    </a>
                  </div>

                  <div style={{ paddingBottom: "1.25rem", borderBottom: "1px solid var(--gold-border)" }}>
                    <span className="label-sm" style={{ color: "var(--charcoal-subtle)", display: "block", marginBottom: "0.25rem" }}>
                      LOCATION
                    </span>
                    <p className="headline-sm" style={{ margin: 0 }}>
                      Karnataka, India · Open to Remote
                    </p>
                  </div>

                  <div>
                    <span className="label-sm" style={{ color: "var(--charcoal-subtle)", display: "block", marginBottom: "0.25rem" }}>
                      RESPONSE TIME
                    </span>
                    <p className="body-md" style={{ margin: 0, color: "var(--charcoal-primary)", fontWeight: 500 }}>
                      Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div
                style={{
                  marginTop: "2.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--gold-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem"
                }}
              >
                {data?.personal?.openToWork !== false && <span className="status-bullet" />}
                <span className="label-sm" style={{ color: "var(--accent-gold)" }}>
                  {data?.personal?.openToWork !== false
                    ? "CURRENTLY ACCEPTING NEW PROJECTS"
                    : "NOT TAKING NEW PROJECTS RIGHT NOW"}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Form with curved container and inputs */}
          <ScrollReveal direction="up" delay={0.3}>
            <div
              style={{
                backgroundColor: "var(--glass-bg)",
                backdropFilter: "var(--glass-blur)",
                WebkitBackdropFilter: "var(--glass-blur)",
                boxShadow: "var(--shadow-soft)",
                border: "1px solid var(--glass-border)",
                borderRadius: "20px",
                padding: "2.5rem"
              }}
            >
              {status.success ? (
                <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
                  <div className="index-num" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    [ MESSAGE SENT ]
                  </div>
                  <h3 className="headline-md" style={{ marginBottom: "1rem" }}>
                    Thank You — Message Received
                  </h3>
                  <p className="body-md" style={{ maxWidth: "440px", margin: "0 auto 2rem auto" }}>
                    Thanks for reaching out. I'll review your message and reply to you by email shortly.
                  </p>
                  <button
                    onClick={() => setStatus({ loading: false, success: false, error: null })}
                    className="btn btn-secondary"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {status.error && (
                    <div
                      style={{
                        border: "1px solid var(--error)",
                        backgroundColor: "rgba(186, 26, 26, 0.08)",
                        color: "var(--error)",
                        borderRadius: "10px",
                        padding: "0.85rem 1rem",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <FiAlertTriangle />
                      <span className="label-sm">{status.error}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.25rem",
                      marginBottom: "1.25rem"
                    }}
                    className="contact-row"
                  >
                    <div>
                      <label className="label-sm" style={{ display: "block", marginBottom: "0.5rem", color: "var(--charcoal-primary)" }}>
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        required
                        className="arch-input"
                      />
                    </div>

                    <div>
                      <label className="label-sm" style={{ display: "block", marginBottom: "0.5rem", color: "var(--charcoal-primary)" }}>
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@organization.com"
                        required
                        className="arch-input"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label className="label-sm" style={{ display: "block", marginBottom: "0.5rem", color: "var(--charcoal-primary)" }}>
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project inquiry, job opportunity, collaboration..."
                      className="arch-input"
                    />
                  </div>

                  <div style={{ marginBottom: "1.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <label className="label-sm" style={{ color: "var(--charcoal-primary)" }}>
                        MESSAGE *
                      </label>
                      <span className="label-sm" style={{ color: "var(--charcoal-subtle)", fontFamily: "var(--font-mono)" }}>
                        {formData.message.length} / 1000
                      </span>
                    </div>
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, goals and timeline..."
                      required
                      maxLength={1000}
                      className="arch-input"
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "1rem" }}
                  >
                    {status.loading ? (
                      <span>SENDING...</span>
                    ) : (
                      <>
                        <span>SEND MESSAGE</span>
                        <FiSend />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .contact-layout-grid {
            grid-template-columns: 1fr 1.25fr !important;
          }
        }
        @media (max-width: 600px) {
          .contact-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
