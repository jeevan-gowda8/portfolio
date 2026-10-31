import React from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

export default function Education({ data }) {
  const educationList = data?.education || [];

  return (
    <section id="education" className="section section-band">
      <div className="container">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ marginBottom: "3.5rem" }}>
            <div className="section-badge">
              <span>EDUCATION</span>
            </div>
            <h2 className="headline-lg">
              Academic Credentials & <br />
              <span className="text-gold-gradient">Engineering Foundations</span>
            </h2>
            <p className="section-subtitle">
              Formal computational training in machine learning theory, deep neural network design, and systemic mathematics.
            </p>
          </div>
        </ScrollReveal>

        {/* Chronological Arch Curved Cards with Staggered Scroll Reveal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "960px" }}>
          {educationList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                delay: idx * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{
                y: -3,
                borderColor: "var(--accent-gold)",
                boxShadow: "0 12px 28px rgba(197, 160, 89, 0.12)",
                transition: { duration: 0.2 }
              }}
              style={{
                backgroundColor: "var(--glass-bg)",
                backdropFilter: "var(--glass-blur)",
                WebkitBackdropFilter: "var(--glass-blur)",
                boxShadow: "var(--shadow-soft)",
                border: "1px solid var(--glass-border)",
                borderRadius: "20px",
                padding: "2.5rem",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem"
              }}
              className="edu-item-grid"
            >
              {/* Left Column: Date & Status */}
              <div style={{ borderRight: "none", paddingRight: 0 }} className="edu-meta-col">
                <div className="headline-sm" style={{ color: "var(--charcoal-primary)", marginBottom: "0.75rem" }}>
                  {item.dateRange}
                </div>
                <span className="chip chip-gold">
                  {item.badge?.toUpperCase()}
                </span>
              </div>

              {/* Right Column: Degree & Content */}
              <div>
                <h3 className="headline-md" style={{ marginBottom: "0.35rem" }}>
                  {item.degree || item.title}
                </h3>
                <div className="label-sm" style={{ color: "var(--gold-text)", marginBottom: "1.25rem" }}>
                  {item.institution} {item.location && `// ${item.location.toUpperCase()}`}
                </div>

                <p className="body-md" style={{ marginBottom: "1.5rem" }}>
                  {item.description}
                </p>

                {item.skills && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {item.skills.map((s, sIdx) => (
                      <span key={sIdx} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .edu-item-grid {
            grid-template-columns: 220px 1fr !important;
          }
          .edu-meta-col {
            border-right: 1px solid var(--gold-border) !important;
            padding-right: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
