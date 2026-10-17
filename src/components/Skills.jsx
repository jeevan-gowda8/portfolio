import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

export default function Skills({ data }) {
  const skillCategories = data?.skills || [];
  const [activeTab, setActiveTab] = useState(0);

  const currentCategory = skillCategories[activeTab] || skillCategories[0];

  return (
    <section id="skills" className="section section-band">
      <div className="container">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ marginBottom: "3.5rem" }}>
            <div className="section-badge">
              <span>SKILLS & EXPERTISE</span>
            </div>
            <h2 className="headline-lg">
              Engineering Arsenal & <br />
              <span className="text-gold-gradient">System Proficiencies</span>
            </h2>
            <p className="section-subtitle">
              The languages, frameworks and tools I use to design, build and ship reliable software.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs with rounded pill shapes */}
        <ScrollReveal direction="up" delay={0.2}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
              marginBottom: "3rem",
              borderBottom: "1px solid var(--gold-border)",
              paddingBottom: "1.25rem"
            }}
          >
            {skillCategories.map((cat, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className="label-md"
                  style={{
                    padding: "0.65rem 1.4rem",
                    borderRadius: "9999px",
                    border: isActive ? "1px solid var(--charcoal-primary)" : "1px solid var(--gold-border)",
                    backgroundColor: isActive ? "var(--charcoal-primary)" : "var(--glass-bg)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    color: isActive ? "var(--ivory-canvas)" : "var(--charcoal-muted)",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                >
                  <span>{cat.category}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active Category Display with AnimatePresence */}
        {currentCategory && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategory.category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "2rem"
                }}
              >
                <div className="label-sm" style={{ color: "var(--accent-gold)" }}>
                  CATEGORY : {currentCategory.id?.toUpperCase() || "CORE"}
                </div>
                <p className="body-md" style={{ margin: 0, color: "var(--charcoal-muted)" }}>
                  {currentCategory.description}
                </p>
              </div>

              {/* Grid of Skill Cards with curved borders & scroll reveal */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem"
                }}
              >
                {currentCategory.items.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    whileHover={{
                      y: -4,
                      borderColor: "var(--accent-gold)",
                      boxShadow: "0 24px 48px -16px rgba(120, 90, 26, 0.22)",
                      transition: { duration: 0.2 }
                    }}
                    style={{
                      backgroundColor: "var(--glass-bg)",
                      backdropFilter: "var(--glass-blur)",
                      WebkitBackdropFilter: "var(--glass-blur)",
                      boxShadow: "var(--shadow-soft)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "16px",
                      padding: "1.75rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "0.85rem"
                        }}
                      >
                        <h4 className="headline-sm" style={{ margin: 0 }}>
                          {skill.name}
                        </h4>
                      </div>

                      <p className="body-md" style={{ fontSize: "14px", lineHeight: "22px", margin: 0 }}>
                        {skill.note}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
