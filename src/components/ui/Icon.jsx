/**
 * Tiny inline icon set (stroke icons, 24×24). Inline SVG keeps the bundle small —
 * no icon font or icon library download on slow mobile connections.
 */
const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`

const PATHS = {
  home: ['M3 11l9-7 9 7', 'M5 9.5V20h5v-6h4v6h5V9.5'],
  resume: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6', 'M10 17h6'],
  portfolio: ['M4 8h16v11H4z', 'M9 8V5h6v3', 'M4 13h16'],
  chart: ['M4 4v16h16', 'M8 16v-5', 'M12 16V8', 'M16 16v-3'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  phone: [
    'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  ],
  message: ['M4 5h16v11H9l-5 4z'],
  pin: ['M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z', circle(12, 9, 2.5)],
  download: ['M12 4v11', 'M7 10l5 5 5-5', 'M5 20h14'],
  upload: ['M12 16V5', 'M7 10l5-5 5 5', 'M5 20h14'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  search: [circle(11, 11, 7), 'M20 20l-4-4'],
  chevronUp: ['M8 14l4-4 4 4'],
  chevronDown: ['M8 10l4 4 4-4'],
  chevronLeft: ['M15 6l-6 6 6 6'],
  chevronRight: ['M9 6l6 6-6 6'],
  sort: ['M8 9l4-4 4 4', 'M8 15l4 4 4-4'],
  globe: [circle(12, 12, 9), 'M3 12h18', 'M12 3c3 3.5 3 14.5 0 18c-3-3.5-3-14.5 0-18'],
  external: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  link: ['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
  sheet: ['M5 3h14v18H5z', 'M5 9h14', 'M5 15h14', 'M11 3v18'],
  cap: ['M2 9l10-5 10 5-10 5z', 'M6 11v5c3 2 9 2 12 0v-5', 'M22 9v5'],
  award: [circle(12, 9, 5), 'M9 13.5L7.5 21l4.5-2.5 4.5 2.5L15 13.5'],
  target: [circle(12, 12, 9), circle(12, 12, 5), circle(12, 12, 1)],
  check: ['M5 12l5 5 9-10'],
  alert: ['M12 3l10 18H2z', 'M12 10v5', 'M12 18h.01'],
  info: [circle(12, 12, 9), 'M12 11v6', 'M12 7.5h.01'],
  printer: ['M7 9V3h10v6', 'M5 9h14v7H5z', 'M7 14h10v7H7z'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13'],
  calendar: ['M4 5h16v16H4z', 'M4 10h16', 'M9 3v4', 'M15 3v4'],
  table: ['M4 5h16v14H4z', 'M4 10h16', 'M4 15h16', 'M10 5v14'],
  arrowRight: ['M5 12h14', 'M13 6l6 6-6 6'],
  sparkle: ['M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z'],
  book: ['M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z', 'M4 19V5', 'M8 7h7'],
  user: [circle(12, 8, 4), 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6'],
}

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8, title }) {
  const paths = PATHS[name]
  if (!paths) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
