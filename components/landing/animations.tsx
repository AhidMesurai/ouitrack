'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface FadeContentProps {
  children: ReactNode
  delay?: number
  blur?: boolean
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function FadeContent({ children, delay = 0, blur = false, direction = 'up' }: FadeContentProps) {
  const directionMap = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  }

  const initial = directionMap[direction]

  return (
    <motion.div
      initial={{ ...initial, opacity: blur ? 0 : 0.5, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      animate={{ x: 0, y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollFadeContent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50])

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  )
}

interface GlowCardProps {
  children: ReactNode
  intensity?: number
  className?: string
  glowColor?: string
}

export function GlowCard({ children, intensity = 0.3, className = '', glowColor = '37, 99, 235' }: GlowCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, rgba(${glowColor}, ${intensity}), transparent 70%)`,
          filter: 'blur(30px)',
          zIndex: -1,
        }}
        animate={{
          opacity: [0, intensity, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {children}
    </motion.div>
  )
}

interface BounceProps {
  children: ReactNode
  delay?: number
}

export function Bounce({ children, delay = 0 }: BounceProps) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

interface FloatingElementsProps {
  children: ReactNode
}

export function FloatingElements({ children }: FloatingElementsProps) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

