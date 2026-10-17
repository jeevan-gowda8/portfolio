import React from "react";

export default function TechMarquee({ data }) {
  const fromSkills = (data?.skills || []).flatMap((c) => c.items.map((i) => i.name));
  const items = fromSkills.length
    ? fromSkills
    : ["Python", "React", "PyTorch", "Flutter", "Firebase", "OpenCV", "Node.js", "IoT"];
  const loop = [...items, ...items];

  return (
    <div
      className="marquee"
      aria-label="Technologies I work with"
      style={{ position: "relative", zIndex: 1, padding: "1.6rem 0" }}
    >
      <div className="marquee-track">
        {loop.map((name, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="label-md"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "3rem",
              whiteSpace: "nowrap",
              color: "var(--charcoal-muted)",
              fontSize: "14px",
              letterSpacing: "0.12em"
            }}
          >
            {name}
            <span style={{ color: "var(--accent-gold)", fontSize: "10px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
