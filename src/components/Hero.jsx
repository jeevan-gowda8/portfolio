import React, { useState, useEffect } from "react";
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiInstagram, FiMail, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import CountUp from "./CountUp";

export default function Hero({ data }) {
  const roles = [
    "FULL-STACK DEVELOPER",
    "AI & MACHINE LEARNING ENGINEER",
    "IOT SYSTEMS ARCHITECT",
    "COMPUTATIONAL SYSTEM RESEARCHER"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(90);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer;

    if (!isDeleting && displayText === currentRole) {
      timer = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      setTypingSpeed(90);
    } else {
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentRole.substring(0, prev.length - 1)
            : currentRole.substring(0, prev.length + 1)
        );
        setTypingSpeed(isDeleting ? 35 : 75);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, typingSpeed]);

  const stats = data?.personal?.stats || [
    { label: "Engineering Practice", value: "03+" },
    { label: "Systems Deployed", value: "12+" },
    { label: "Core Technologies", value: "15+" }
  ];

  return (
    <section id="hero" className="section" style={{ paddingTop: "4.5rem", paddingBottom: "4rem" }}>
      <div className="container">
        {/* Hero Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "4rem",
            alignItems: "start"
          }}
          className="hero-layout"
        >
          {/* Main Title & Narrative with Staggered Motion */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="label-md"
              style={{
                color: "var(--accent-gold)",
                marginBottom: "1.25rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span className="status-bullet" />
              <span>{data?.personal?.availability || "Available for Projects & Full-time Roles"}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="display-xl"
              style={{ marginBottom: "1.5rem" }}
            >
              Intelligent Systems.
              <br />
              <span className="text-gold-gradient">
                Rigorous Architecture.
              </span>
            </motion.h1>

            {/* Dynamic Typewriter Role */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="label-md"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--accent-gold)",
                padding: "0.45rem 1rem",
                backgroundColor: "var(--glass-bg)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "9999px",
                marginBottom: "2rem"
              }}
            >
              <span>ROLE :</span>
              <span style={{ color: "var(--charcoal-primary)", fontWeight: 600 }}>
                {displayText}
              </span>
              <span
                style={{
                  width: "2px",
                  height: "12px",
                  backgroundColor: "var(--accent-gold)",
                  display: "inline-block",
                  animation: "blink 1s infinite"
                }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="body-lg"
              style={{ maxWidth: "680px", marginBottom: "2.75rem" }}
            >
              {data?.personal?.tagline ||
                "Specializing in Artificial Intelligence, Deep Learning, IoT automation, and modern full-stack web applications with high-polish aesthetics and rock-solid architecture."}
            </motion.p>

            {/* Actions conforming to curved buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}
            >
              <a href="#projects" className="btn btn-primary">
                <span>View My Work</span>
                <FiArrowRight style={{ fontSize: "1rem" }} />
              </a>

              <a
                href={data?.personal?.resumeUrl || "/assets/documents/resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <FiDownload />
                <span>Download Resume</span>
              </a>

              <a href="#about" className="btn btn-tertiary">
                <span>About Me</span>
                <span className="arrow"> →</span>
              </a>
            </motion.div>

            {/* Social Links Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                paddingTop: "1.75rem",
                borderTop: "1px solid var(--gold-border)"
              }}
            >
              <span className="label-sm" style={{ color: "var(--charcoal-subtle)" }}>
                FIND ME ON
              </span>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[
                  { icon: <FiGithub />, href: data?.personal?.socials?.github || "https://github.com/jeevan-gowda8", label: "GitHub" },
                  { icon: <FiLinkedin />, href: data?.personal?.socials?.linkedin || "https://linkedin.com/in/jeevan-gowda", label: "LinkedIn" },
                  { icon: <FiInstagram />, href: data?.personal?.socials?.instagram || "https://instagram.com/jeevan_gowda_8", label: "Instagram" },
                  { icon: <FiMail />, href: data?.personal?.socials?.email || "mailto:jeevangowdajeevan080@gmail.com", label: "Email" }
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    aria-label={s.label}
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      border: "1px solid var(--gold-border)",
                      backgroundColor: "var(--ivory-surface)",
                      color: "var(--charcoal-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      textDecoration: "none",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-gold)";
                      e.currentTarget.style.backgroundColor = "var(--charcoal-primary)";
                      e.currentTarget.style.color = "var(--ivory-canvas)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--gold-border)";
                      e.currentTarget.style.backgroundColor = "var(--ivory-surface)";
                      e.currentTarget.style.color = "var(--charcoal-primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Architectural Fact Sheet Frame */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
          <TiltCard
            max={5}
            className="arch-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              borderRadius: "22px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid var(--gold-border)"
              }}
            >
              <span className="label-sm" style={{ color: "var(--accent-gold)" }}>
                AT A GLANCE
              </span>
              <span className="label-sm" style={{ color: "var(--charcoal-subtle)" }}>
                KARNATAKA, IN
              </span>
            </div>

            <div>
              <h3 className="headline-sm" style={{ marginBottom: "0.5rem" }}>
                Algorithmic & Hardware Systems
              </h3>
              <p className="body-md">
                Disciplined engineering focusing on deep learning pipelines, voice-driven interfaces, and edge microcontroller telemetry.
              </p>
            </div>

            {/* Structured Specifications Table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { key: "PRIMARY FOCUS", val: "AI & Full-Stack Systems" },
                { key: "ACADEMIC BASE", val: "GTTC Diploma in AI/ML" },
                { key: "BACKEND STACK", val: "Python, FastAPI, Firebase" },
                { key: "CLIENT RUNTIME", val: "React 18, Vite, Flutter" }
              ].map((row, rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid var(--gold-border)"
                  }}
                >
                  <span className="label-sm" style={{ color: "var(--charcoal-subtle)" }}>
                    {row.key}
                  </span>
                  <span className="label-sm" style={{ color: "var(--charcoal-primary)" }}>
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Metrics Triad with curved pill boxes */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                paddingTop: "0.5rem"
              }}
            >
              {stats.slice(0, 3).map((st, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid var(--gold-border)",
                    backgroundColor: "rgba(251, 248, 241, 0.7)",
                    borderRadius: "14px",
                    padding: "1rem 0.75rem",
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.75rem",
                      fontWeight: 600,
                      color: "var(--charcoal-primary)",
                      lineHeight: 1.1,
                      marginBottom: "0.25rem"
                    }}
                  >
                    <CountUp value={st.value} />
                  </div>
                  <div className="label-sm" style={{ color: "var(--accent-gold)", fontSize: "10px" }}>
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
          </motion.div>
        </div>

        {/* Elegant Architectural Scroll Down Cue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "4rem"
          }}
        >
          <a
            href="#about"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              color: "var(--charcoal-muted)",
              transition: "color 0.2s ease"
            }}
            className="scroll-indicator-link"
          >
            <span
              className="label-sm"
              style={{
                fontSize: "10.5px",
                letterSpacing: "0.15em",
                color: "var(--accent-gold)",
                fontWeight: 600
              }}
            >
              SCROLL TO EXPLORE
            </span>
            <div
              style={{
                width: "22px",
                height: "36px",
                borderRadius: "12px",
                border: "1.5px solid var(--gold-border)",
                display: "flex",
                justifyContent: "center",
                paddingTop: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                boxShadow: "0 4px 12px rgba(24, 22, 19, 0.03)"
              }}
            >
              <motion.div
                animate={{
                  y: [0, 12, 0],
                  opacity: [1, 0.2, 1]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: "3px",
                  height: "7px",
                  borderRadius: "2px",
                  backgroundColor: "var(--accent-gold)"
                }}
              />
            </div>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiChevronDown style={{ color: "var(--accent-gold)", fontSize: "1.1rem" }} />
            </motion.div>
          </a>
        </motion.div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .scroll-indicator-link:hover {
          color: var(--charcoal-primary) !important;
          transform: translateY(2px);
        }
        @media (min-width: 1024px) {
          .hero-layout {
            grid-template-columns: 1.25fr 0.75fr !important;
          }
        }
      `}</style>
    </section>
  );
}
