import React, { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/**
 * Animates the numeric part of a stat like "12+" or "03+" when it scrolls into view,
 * preserving any prefix, suffix and leading zeros.
 */
export default function CountUp({ value, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = String(value).match(/^(\D*)(\d+)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}${"0".padStart(match[2].length, "0")}${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match) return;
    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits, 10);
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${prefix}${String(Math.round(v)).padStart(digits.length, "0")}${suffix}`)
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}
