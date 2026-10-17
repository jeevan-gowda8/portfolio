import React from "react";

export default function Logo({ size = 42, className = "" }) {
  return (
    <div
      className={`jg-brand-logo ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "12px",
        backgroundColor: "var(--charcoal-primary)",
        border: "1.5px solid var(--accent-gold)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(24, 22, 19, 0.15)",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
        e.currentTarget.style.borderColor = "var(--accent-gold-light)";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(197, 160, 89, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.borderColor = "var(--accent-gold)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(24, 22, 19, 0.15)";
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Subtle inner gold accent hairline frame */}
        <rect
          x="3"
          y="3"
          width="38"
          height="38"
          rx="9"
          stroke="#C5A059"
          strokeWidth="0.75"
          strokeOpacity="0.35"
        />

        {/* Clear, Bold, Architectural Monogram 'JG' matching Plus Jakarta Sans */}
        <text
          x="22"
          y="28"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="-0.04em"
        >
          <tspan fill="#FBF8F1">J</tspan>
          <tspan fill="#C5A059">G</tspan>
        </text>

        {/* Bottom micro accent pill in champagne gold */}
        <rect
          x="18"
          y="33"
          width="8"
          height="1.5"
          rx="0.75"
          fill="#C5A059"
        />
      </svg>
    </div>
  );
}
