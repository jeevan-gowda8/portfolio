export const TOGGLEABLE_SECTIONS = [
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" }
];

// A section is shown unless the admin switched it off in Settings
export function isSectionVisible(data, id) {
  return data?.settings?.sections?.[id] !== false;
}
