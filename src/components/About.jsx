import React from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

export default function About({ data }) {
  const pillars = [
    {
      index: "01",
      title: "Artificial Intelligence & Inference",
      desc: "Architecting custom neural networks, computer vision models, and natural language processing pipelines optimized for real-time edge and server environments."
    },
    {
      index: "02",
      title: "Full-Stack Web Engineering",
      desc: "Building deterministic, accessible, and high-performance client experiences powered by modern reactive component systems and clean REST/GraphQL APIs."
    },
    {
      index: "03",
      title: "Physical Computing & IoT",
      desc: "Bridging embedded microcontroller firmware (ESP32, Arduino) with secure cloud telemetry, distributed message queues, and responsive monitoring dashboards."
    },
    {
      index: "04",
      title: "Architectural Precision & Clean Code",
      desc: "Refactoring monolithic codebases into modular, testable, and maintainable services with hardened cloud security rules and zero structural debt."
    }
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ marginBottom: "3.5rem" }}>
            <div className="section-badge">
              <span>ABOUT ME</span>
            </div>
            <h2 className="headline-lg">
              Engineering Systems of <br />
              <span className="text-gold-gradient">Calculated Precision</span>
            </h2>
            <p className="section-subtitle">
              A developer driven by algorithmic curiosity, uniting scientific machine learning with austere, functional software engineering.
            </p>
          </div>
        </ScrollReveal>

        {/* Narrative & Pillars Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            marginBottom: "3rem"
          }}
          className="about-split"
        >
          {/* Main Narrative Card with curved corners & Scroll Reveal */}
          <ScrollReveal direction="up" delay={0.15}>
            <div
              className="arch-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: "22px",
                height: "100%"
              }}
            >
              <div>
                <div className="label-sm" style={{ color: "var(--gold-text)", marginBottom: "1rem" }}>
                  WHO I AM
                </div>
                <h3 className="headline-md" style={{ marginBottom: "1.5rem" }}>
                  Jeevan Gowda A V
                </h3>
                <p className="body-md" style={{ marginBottom: "1.25rem", color: "var(--charcoal-primary)" }}>
                  I am a full-stack engineer and applied AI researcher currently pursuing my diploma in Artificial Intelligence & Machine Learning at GTTC, Karnataka.
                </p>
                <p className="body-md" style={{ marginBottom: "1.5rem" }}>
                  My engineering ethos rejects superficial visual noise in favor of deep structural integrity: disciplined state management, optimized computational complexity, and tactile, purposeful interfaces that respect user agency and performance.
                </p>
                <p className="body-md" style={{ marginBottom: "2rem" }}>
                  Whether training edge detection models with PyTorch or deploying cloud-hosted reactive applications, I prioritize maintainability, security, and uncompromising typography.
                </p>

                {/* Core Tenets Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {[
                    "Deterministic, modular codebase architecture with zero orphan files",
                    "Applied deep learning with PyTorch, OpenCV, and voice interface hooks",
                    "Hardware telemetry pipelines spanning microcontrollers to cloud storage",
                    "Hardened database security protocols and client-server validation"
                  ].map((tenet, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
                    >
                      <span style={{ color: "var(--gold-text)", fontWeight: 700, marginTop: "2px" }}>
                        —
                      </span>
                      <span className="body-md" style={{ color: "var(--charcoal-primary)" }}>
                        {tenet}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Curatorial Footnote */}
              <div
                style={{
                  marginTop: "2.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--gold-border)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "1.5rem"
                }}
              >
                <div>
                  <span className="label-sm" style={{ color: "var(--charcoal-subtle)", display: "block" }}>
                    LOCATION
                  </span>
                  <span className="label-md" style={{ color: "var(--charcoal-primary)" }}>
                    KARNATAKA, INDIA
                  </span>
                </div>
                <div>
                  <span className="label-sm" style={{ color: "var(--charcoal-subtle)", display: "block" }}>
                    DISCIPLINE
                  </span>
                  <span className="label-md" style={{ color: "var(--charcoal-primary)" }}>
                    AI / ML & FULL STACK
                  </span>
                </div>
                <div>
                  <span className="label-sm" style={{ color: "var(--charcoal-subtle)", display: "block" }}>
                    STATUS
                  </span>
                  <span className="label-md" style={{ color: "var(--gold-text)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    {data?.personal?.openToWork !== false ? (
                      <>
                        <span className="status-bullet" />
                        OPEN TO WORK
                      </>
                    ) : (
                      "NOT AVAILABLE"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Four Architectural Pillars with Staggered Scroll Entrance */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem"
            }}
          >
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + idx * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{
                  y: -4,
                  borderColor: "var(--accent-gold)",
                  boxShadow: "0 10px 24px rgba(197, 160, 89, 0.12)",
                  transition: { duration: 0.2 }
                }}
                className="arch-card-flat"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "20px"
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.25rem"
                    }}
                  >
                    <span className="label-sm" style={{ color: "var(--gold-text)" }}>
                      FOCUS {pillar.index}
                    </span>
                    <span className="label-sm" style={{ color: "var(--charcoal-subtle)" }}>
                      SPECIALIZATION
                    </span>
                  </div>
                  <h3 className="headline-sm" style={{ marginBottom: "0.85rem" }}>
                    {pillar.title}
                  </h3>
                  <p className="body-md" style={{ margin: 0 }}>
                    {pillar.desc}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: "1.5rem",
                    marginTop: "1.5rem",
                    borderTop: "1px solid var(--gold-border)"
                  }}
                >
                  <span className="label-sm" style={{ color: "var(--gold-text)" }}>
                    CORE STRENGTH
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .about-split {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
