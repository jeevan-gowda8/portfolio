import React from "react";
import { motion } from "framer-motion";
import { FiCpu, FiCode, FiSmartphone, FiZap, FiArrowUpRight } from "react-icons/fi";
import { ScrollReveal } from "./ScrollReveal";
import TiltCard from "./TiltCard";

const ICONS = {
  brain: FiCpu,
  code: FiCode,
  mobile: FiSmartphone,
  bolt: FiZap
};

const PROCESS = [
  { step: "01", title: "Discover", desc: "We clarify goals, users and constraints in a short call." },
  { step: "02", title: "Design", desc: "I propose the architecture, stack and a clear timeline." },
  { step: "03", title: "Build", desc: "Iterative delivery with regular demos and transparent progress." },
  { step: "04", title: "Launch", desc: "Deployment, documentation and post-launch support." }
];

export default function Services({ data }) {
  const services = data?.services || [];
  if (!services.length) return null;

  return (
    <section id="services" className="section">
      <div className="container">
        <ScrollReveal direction="up" delay={0.1}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginBottom: "3.5rem"
            }}
          >
            <div>
              <div className="section-badge">
                <span>SERVICES</span>
              </div>
              <h2 className="headline-lg">
                How I Can Help <br />
                <span className="text-gold-gradient">Your Next Project</span>
              </h2>
              <p className="section-subtitle">
                From intelligent models to polished products — end-to-end engineering that turns ideas into dependable software.
              </p>
            </div>
            <a href="#contact" className="btn btn-primary">
              <span>Start a Project</span>
              <FiArrowUpRight />
            </a>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "4rem"
          }}
        >
          {services.map((svc, idx) => {
            const Icon = ICONS[svc.icon] || FiCode;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard
                  className="arch-card tilt-hover service-card"
                  style={{ height: "100%", borderRadius: "22px", display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.35rem",
                      color: "var(--ivory-canvas)",
                      background: "linear-gradient(135deg, #2a2620 0%, #181613 100%)",
                      boxShadow: "0 10px 24px -10px rgba(24, 22, 19, 0.5), inset 0 0 0 1px rgba(197, 160, 89, 0.4)",
                      marginBottom: "1.75rem",
                      transform: "translateZ(30px)"
                    }}
                  >
                    <Icon style={{ color: "var(--accent-gold)" }} />
                  </div>
                  <span className="label-sm" style={{ color: "var(--accent-gold)", marginBottom: "0.6rem" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="headline-sm" style={{ marginBottom: "0.75rem" }}>
                    {svc.title}
                  </h3>
                  <p className="body-md" style={{ margin: 0 }}>
                    {svc.desc}
                  </p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Engagement process */}
        <ScrollReveal direction="up" delay={0.1}>
          <div
            className="arch-card"
            style={{
              borderRadius: "22px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem"
            }}
          >
            {PROCESS.map((p, i) => (
              <div key={p.step} style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "var(--accent-gold)",
                      border: "1px solid var(--accent-gold)",
                      borderRadius: 9999,
                      padding: "0.15rem 0.55rem"
                    }}
                  >
                    {p.step}
                  </span>
                  <span className="headline-sm">{p.title}</span>
                  {i < PROCESS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="process-line"
                      style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--accent-gold), transparent)" }}
                    />
                  )}
                </div>
                <p className="body-md" style={{ margin: 0, fontSize: "14px" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        .service-card:hover { border-color: var(--accent-gold); box-shadow: var(--shadow-lift); }
        @media (max-width: 700px) { .process-line { display: none; } }
      `}</style>
    </section>
  );
}
