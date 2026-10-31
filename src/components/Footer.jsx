import React from "react";
import { FiArrowUp, FiGithub, FiLinkedin, FiInstagram, FiMail } from "react-icons/fi";
import Logo from "./Logo";
import { isSectionVisible } from "../siteSettings";
import { ScrollReveal } from "./ScrollReveal";

export default function Footer({ data }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        backgroundColor: "var(--glass-bg-strong)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        padding: "4.5rem 0 3rem 0"
      }}
    >
      <div className="container">
        {/* Main Footer Row with Scroll Reveal */}
        <ScrollReveal direction="up" delay={0.1}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "2.5rem",
              paddingBottom: "3rem",
              borderBottom: "1px solid var(--gold-border)"
            }}
          >
            {/* Identity */}
            <div style={{ maxWidth: "420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
                <Logo size={38} />
                <span className="headline-sm">JEEVAN GOWDA A V</span>
              </div>
              <p className="body-md">
                Full-Stack Developer & AI/ML Engineer building intelligent systems, IoT solutions and production-grade web applications.
              </p>
            </div>

            {/* Directory Navigation */}
            <div>
              <div className="label-sm" style={{ color: "var(--gold-text)", marginBottom: "1rem" }}>
                NAVIGATION
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  ["hero", "HOME"],
                  ["about", "ABOUT"],
                  ["services", "SERVICES"],
                  ["skills", "SKILLS"],
                  ["projects", "PROJECTS"],
                  ["education", "EDUCATION"],
                  ["contact", "CONTACT"]
                ]
                  .filter(([id]) => isSectionVisible(data, id))
                  .map(([id, label]) => (
                    <a key={id} href={`#${id}`} className="label-sm" style={{ color: "var(--charcoal-muted)", textDecoration: "none" }}>
                      {label}
                    </a>
                  ))}
              </div>
            </div>

            {/* Connect & Scroll Up */}
            <div>
              <div className="label-sm" style={{ color: "var(--gold-text)", marginBottom: "1rem" }}>
                CONNECT
              </div>
              <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem" }}>
                {[
                  { icon: <FiGithub />, href: data?.personal?.socials?.github || "https://github.com/jeevan-gowda8", label: "GitHub" },
                  { icon: <FiLinkedin />, href: data?.personal?.socials?.linkedin || "https://www.linkedin.com/in/jeevan-gowda8", label: "LinkedIn" },
                  { icon: <FiInstagram />, href: data?.personal?.socials?.instagram || "https://www.instagram.com/ll_.jeevan._.gowda._ll", label: "Instagram" },
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
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid var(--gold-border)",
                      backgroundColor: "var(--ivory-canvas)",
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
                      e.currentTarget.style.backgroundColor = "var(--ivory-canvas)";
                      e.currentTarget.style.color = "var(--charcoal-primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              <button
                onClick={scrollToTop}
                className="btn btn-secondary"
                style={{ padding: "0.65rem 1.4rem", borderRadius: "9999px" }}
              >
                <span>BACK TO TOP</span>
                <FiArrowUp />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Colophon & Sub-bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "2rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <span className="label-sm" style={{ color: "var(--charcoal-subtle)" }}>
            © {new Date().getFullYear()} JEEVAN GOWDA A V · ALL RIGHTS RESERVED
          </span>

          <span className="label-sm" style={{ color: "var(--charcoal-subtle)" }}>
            DESIGNED & BUILT WITH LOVE
          </span>
        </div>
      </div>
    </footer>
  );
}
