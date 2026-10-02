import type React from 'react'

type Eigenschaften = { farbe: string; groesse?: number }

const Rahmen: React.FC<Eigenschaften & { children: React.ReactNode }> = ({ farbe, groesse = 56, children }) => (
  <svg
    width={groesse}
    height={groesse}
    viewBox="0 0 24 24"
    fill="none"
    stroke={farbe}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

export const Schluessel: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M10.7 12.3 20 3M16 7l3 3M14 9l2 2" />
  </Rahmen>
)

export const Fingerabdruck: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <path d="M12 11c0 3.5-.8 6.5-2.5 9" />
    <path d="M8.5 9.5A4 4 0 0 1 16 11c0 2.4-.3 4.6-1 6.5" />
    <path d="M5.5 8a7.5 7.5 0 0 1 13.4 2.5c.2 2.2 0 4.2-.4 6" />
    <path d="M6.5 13c.2 2-.3 4-1.3 5.5" />
    <path d="M18 20c.3-.6.5-1.3.7-2" />
    <path d="M12.5 21c.6-1 1-2.2 1.3-3.5" />
  </Rahmen>
)

export const Schloss: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    <circle cx="12" cy="15.5" r="1.2" />
  </Rahmen>
)

export const Laptop: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <rect x="4" y="5" width="16" height="11" rx="1.5" />
    <path d="M2 19h20" />
  </Rahmen>
)

export const Server: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <rect x="3" y="3.5" width="18" height="7" rx="1.5" />
    <rect x="3" y="13.5" width="18" height="7" rx="1.5" />
    <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
  </Rahmen>
)

export const Handy: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M11 18.5h2" />
  </Rahmen>
)

export const Haken: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Rahmen>
)

export const Kreuz: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Rahmen>
)

export const Wolke: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <path d="M7 18.5h10.5a4 4 0 0 0 .4-8A6 6 0 0 0 6.3 9.6 4.5 4.5 0 0 0 7 18.5Z" />
  </Rahmen>
)

/** Drohne: Sechseck wie eine Wabe, Anspielung auf die Zerg */
export const Drohne: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <path d="M12 2.5 20.5 7.3v9.4L12 21.5l-8.5-4.8V7.3Z" />
    <path d="M8.5 11.5h7M8.5 14.5h4.5" />
  </Rahmen>
)

export const Zweig: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="8" r="2" />
    <path d="M6 7v10M18 10c0 4-6 3-11.2 7.4" />
  </Rahmen>
)

export const Steckdose: React.FC<Eigenschaften> = (p) => (
  <Rahmen {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.5 9.5v3M14.5 9.5v3M10 16h4" />
  </Rahmen>
)
