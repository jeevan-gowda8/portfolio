import React, { useState, useEffect } from "react";
import { FiArrowRight, FiGithub, FiExternalLink, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import TiltCard from "./TiltCard";

// Adds https:// when missing and drops empty or placeholder values
function normalizeUrl(raw) {
  const value = (raw || "").trim();
  if (!value || value === "#") return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

// Reads links saved by the admin panel (older github/demo keys included);
// a demo link that just repeats the GitHub link is treated as missing
export function getProjectLinks(project) {
  const github = normalizeUrl(project.githubUrl || project.github);
  let demo = normalizeUrl(project.demoUrl || project.demo);
  if (demo && demo === github) demo = "";
  return { github, demo };
}

// Category tabs match free-text categories typed in the admin panel
const CATEGORY_KEYWORDS = {
  ai: ["ai", "ml", "machine", "intelligen", "vision", "deep", "nlp"],
  mobile: ["mobile", "iot", "embedded", "flutter", "android", "hardware"],
  web: ["web", "full", "frontend", "backend", "site", "portal"]
};

function matchesCategory(project, categoryId) {
  if (categoryId === "all") return true;
  const text = `${project.category || ""} ${project.badge || ""}`.toLowerCase();
  return (CATEGORY_KEYWORDS[categoryId] || [categoryId]).some((k) =>
    new RegExp(`(^|[^a-z])${k}`).test(text)
  );
}

export default function Projects({ data }) {
  const projects = data?.projects || [];
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  // Close the detail view with Escape and stop the page scrolling behind it
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e) => e.key === "Escape" && setSelectedProject(null);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedProject]);

  const categories = [
    { id: "all", label: "ALL PROJECTS" },
    { id: "ai", label: "AI & ML SYSTEMS" },
    { id: "mobile", label: "IOT & EMBEDDED" },
    { id: "web", label: "WEB PLATFORMS" }
  ];

  const filteredProjects = projects.filter((p) => matchesCategory(p, activeCategory));
  const selectedLinks = selectedProject ? getProjectLinks(selectedProject) : {};

  return (
    <section id="projects" className="section">
      <div className="container">
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ marginBottom: "3.5rem" }}>
            <div className="section-badge">
              <span>SELECTED WORK</span>
            </div>
            <h2 className="headline-lg">
              Featured Projects & <br />
              <span className="text-gold-gradient">Real-World Systems</span>
            </h2>
            <p className="section-subtitle">
              A selection of builds spanning voice-driven AI agents, IoT telemetry platforms, computer vision and full-stack web apps.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filters with pill curves */}
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
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="label-sm"
                  style={{
                    padding: "0.55rem 1.35rem",
                    borderRadius: "9999px",
                    border: isActive ? "1px solid var(--charcoal-primary)" : "1px solid var(--gold-border)",
                    backgroundColor: isActive ? "var(--charcoal-primary)" : "transparent",
                    color: isActive ? "var(--ivory-canvas)" : "var(--charcoal-muted)",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Curved Project Presentation Frames with Scroll Reveal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {filteredProjects.map((project, idx) => {
            const indexStr = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
            const links = getProjectLinks(project);
            const badge = project.badge || project.metaLabel || project.category;
            return (
              <TiltCard
                max={3}
                key={project.id || project.title}
                role="button"
                tabIndex={0}
                aria-label={`Open details for ${project.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: (idx % 4) * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{
                  boxShadow: "0 24px 48px -16px rgba(120, 90, 26, 0.22)",
                  borderColor: "var(--accent-gold)",
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
                  gap: "1.75rem",
                  cursor: "pointer"
                }}
                onClick={() => setSelectedProject(project)}
                className="project-row-grid tilt-hover"
              >
                {/* Index & Header */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
                      {badge && <span className="chip chip-gold">{badge}</span>}
                      {project.metaYear && (
                        <span className="label-sm" style={{ color: "var(--charcoal-subtle)", marginLeft: "auto" }}>
                          {project.metaYear}
                        </span>
                      )}
                    </div>

                    <h3 className="headline-md" style={{ marginBottom: "0.5rem" }}>
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="label-sm" style={{ color: "var(--gold-text)", marginBottom: "1rem" }}>
                        {project.subtitle}
                      </p>
                    )}

                    <p className="body-md" style={{ marginBottom: "1.75rem" }}>
                      {project.description}
                    </p>
                  </div>

                  {/* Highlights Checklist */}
                  {project.highlights && project.highlights.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                      {project.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                          <span style={{ color: "var(--gold-text)", fontWeight: 700 }}>—</span>
                          <span className="body-md" style={{ fontSize: "14px", color: "var(--charcoal-primary)" }}>
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Micro Actions row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--gold-border)" }}>
                    <span className="btn btn-secondary" style={{ padding: "0.45rem 1rem", fontSize: "12px" }}>
                      <span>View Details</span>
                      <FiArrowRight style={{ fontSize: "0.9rem" }} />
                    </span>

                    {links.github && (
                      <a
                        href={links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: "var(--charcoal-muted)",
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.2s ease"
                        }}
                        title="GitHub Repository"
                        aria-label={`${project.title} on GitHub`}
                      >
                        <FiGithub />
                      </a>
                    )}
                    {links.demo && (
                      <a
                        href={links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: "var(--charcoal-muted)",
                          fontSize: "1.1rem",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.2s ease"
                        }}
                        title="Live Demo"
                        aria-label={`${project.title} live demo`}
                      >
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: Spec Architecture Frame */}
                <div
                  style={{
                    backgroundColor: "rgba(251, 248, 241, 0.7)",
                    border: "1px solid var(--gold-border)",
                    borderRadius: "16px",
                    padding: "2rem",
                    transform: "translateZ(20px)",
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
                        marginBottom: "1.5rem",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid var(--gold-border)"
                      }}
                    >
                      <span className="label-sm" style={{ color: "var(--gold-text)" }}>
                        TECH STACK
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "var(--gold-text)",
                          opacity: 0.55
                        }}
                      >
                        {indexStr}
                      </span>
                    </div>

                    {/* Tags pill cloud */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
                      {(project.tags || []).map((tag, tIdx) => (
                        <span key={tIdx} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Architectural Blueprint Indicator */}
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "var(--ivory-surface)",
                      border: "1px solid var(--gold-border)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span className="label-sm" style={{ fontSize: "11px", color: "var(--charcoal-muted)" }}>
                      CATEGORY
                    </span>
                    <span className="label-sm" style={{ fontSize: "11px", color: "var(--gold-text)", fontWeight: 600 }}>
                      {project.category?.toUpperCase() || "GENERAL"}
                    </span>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Modal Inversion Layer with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              backgroundColor: "rgba(24, 22, 19, 0.75)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)"
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: "720px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                backgroundColor: "var(--charcoal-primary)",
                color: "var(--ivory-canvas)",
                border: "1px solid var(--accent-gold)",
                borderRadius: "24px",
                padding: "3rem",
                position: "relative",
                boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  border: "1px solid var(--accent-gold)",
                  color: "var(--accent-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  transition: "all 0.2s ease"
                }}
              >
                <FiX />
              </button>

              <div className="label-sm" style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>
                PROJECT DETAILS // {selectedProject.category?.toUpperCase()}
              </div>

              <h3 className="headline-lg" style={{ color: "var(--ivory-canvas)", marginBottom: "0.5rem" }}>
                {selectedProject.title}
              </h3>
              {selectedProject.subtitle && (
                <p className="label-md" style={{ color: "var(--accent-gold)", marginBottom: "1.5rem" }}>
                  {selectedProject.subtitle}
                </p>
              )}

              <p className="body-lg" style={{ color: "#dcdad3", marginBottom: "2rem" }}>
                {selectedProject.description}
              </p>

              {/* Highlights */}
              {selectedProject.highlights?.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    className="label-sm"
                    style={{
                      color: "var(--accent-gold)",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid #31312c",
                      marginBottom: "1rem"
                    }}
                  >
                    KEY HIGHLIGHTS
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {selectedProject.highlights.map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                        <span style={{ color: "var(--accent-gold)" }}>—</span>
                        <span className="body-md" style={{ color: "var(--ivory-canvas)" }}>
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div style={{ marginBottom: "2.5rem" }}>
                <div className="label-sm" style={{ color: "var(--accent-gold)", marginBottom: "0.75rem" }}>
                  TECHNOLOGIES USED
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {(selectedProject.tags || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="label-sm"
                      style={{
                        padding: "0.35rem 0.85rem",
                        borderRadius: "9999px",
                        border: "1px solid var(--accent-gold)",
                        color: "var(--accent-gold)"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions with rounded pills */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {selectedLinks.github && (
                  <a
                    href={selectedLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: "var(--accent-gold)",
                      color: "var(--charcoal-primary)",
                      border: "1px solid var(--accent-gold)"
                    }}
                  >
                    <FiGithub />
                    <span>View Source Code</span>
                  </a>
                )}
                {selectedLinks.demo && (
                  <a
                    href={selectedLinks.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--ivory-canvas)",
                      border: "1px solid var(--ivory-canvas)"
                    }}
                  >
                    <FiExternalLink />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 960px) {
          .project-row-grid {
            grid-template-columns: 1fr 1.25fr !important;
          }
        }
      `}</style>
    </section>
  );
}
