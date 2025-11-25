'use client'

import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="group">
      <span
        className="text-white font-bold leading-none"
        style={{
          fontFamily: "'Rubik Glitch', sans-serif",
          fontSize: '1.8rem',
          letterSpacing: '0.05em',
          fontWeight: 400
        }}
      >
        Oui Track
      </span>
    </Link>
  )
}

