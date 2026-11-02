import React, { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { isSectionVisible } from "../siteSettings";

export default function Navbar({ data }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // A section becomes active when it crosses a band just below the header
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-180px 0px -55% 0px" }
    );
    ["hero", "about", "services", "skills", "projects", "education", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [data?.settings?.sections]);

  const navLinks = [
    { label: "HOME", href: "#hero", id: "hero" },
    { label: "ABOUT", href: "#about", id: "about" },
    { label: "SERVICES", href: "#services", id: "services" },
    { label: "SKILLS", href: "#skills", id: "skills" },
    { label: "PROJECTS", href: "#projects", id: "projects" },
    { label: "EDUCATION", href: "#education", id: "education" },
    { label: "CONTACT", href: "#contact", id: "contact" }
  ].filter((link) => isSectionVisible(data, link.id));

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? "rgba(251, 248, 241, 0.94)" : "rgba(251, 248, 241, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--gold-border)",
        boxShadow: isScrolled ? "0 4px 20px rgba(24, 22, 19, 0.05)" : "none",
        transition: "all 0.3s ease"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "76px"
        }}
      >
        {/* Brand Index */}
        <a
          href="#hero"
          className="nav-brand"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            textDecoration: "none"
          }}
        >
          <Logo size={42} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              className="nav-name"
              style={{
                whiteSpace: "nowrap",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "-0.02em",
                color: "var(--charcoal-primary)"
              }}
            >
              JEEVAN GOWDA A V
            </span>
            <span
              className="label-sm"
              style={{ color: "var(--gold-text)" }}
            >
              AI & FULL-STACK
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "1.9rem"
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className="label-md"
                style={{
                  color: isActive ? "var(--charcoal-primary)" : "var(--charcoal-muted)",
                  position: "relative",
                  padding: "0.5rem 0",
                  textDecoration: "none",
                  fontWeight: isActive ? 700 : 500,
                  transition: "color 0.2s ease"
                }}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2.5px",
                      borderRadius: "9999px",
                      backgroundColor: "var(--accent-gold)",
                      boxShadow: "0 1px 6px rgba(197, 160, 89, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="/assets/documents/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ display: "none", padding: "0.6rem 1.35rem" }}
            id="navResume"
          >
            Resume
          </a>

          <a
            href="#contact"
            className="btn btn-primary nav-hire"
            style={{ padding: "0.6rem 1.4rem", whiteSpace: "nowrap" }}
          >
            Hire Me
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid var(--gold-border)",
              borderRadius: "8px",
              color: "var(--charcoal-primary)",
              fontSize: "1.4rem",
              padding: "0.45rem",
              cursor: "pointer"
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              backgroundColor: "var(--ivory-surface)",
              borderBottom: "1px solid var(--gold-border)",
              borderRadius: "0 0 16px 16px",
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              overflow: "hidden"
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="label-md"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--gold-border)",
                  color: activeSection === link.id ? "var(--charcoal-primary)" : "var(--charcoal-muted)",
                  textDecoration: "none"
                }}
              >
                <span>{link.label}</span>
                {activeSection === link.id && (
                  <span style={{ color: "var(--gold-text)", fontWeight: 700 }}>•</span>
                )}
              </a>
            ))}
            <a
              href="/assets/documents/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 1140px) {
          .desktop-nav { display: flex !important; }
          #navResume { display: inline-flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 480px) {
          .nav-brand { gap: 0.6rem !important; }
          .nav-name { font-size: 0.92rem !important; }
          .nav-actions { gap: 0.5rem !important; }
          .nav-hire { padding: 0.5rem 0.9rem !important; font-size: 12px; }
        }
        @media (max-width: 359px) {
          .nav-hire { display: none; }
        }
      `}</style>
    </header>
  );
}
