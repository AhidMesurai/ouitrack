'use client'

import Orb from './Orb'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-black">
      {/* Orb Background */}
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      {/* Text Content - Centered in the middle */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pointer-events-none pt-20">
        <div className="text-center max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white leading-[1.2] mb-8 pointer-events-none"
          >
            <motion.span
              className="block mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              style={{
                fontFamily: "'Rubik Glitch', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                letterSpacing: '0.05em',
                fontWeight: 400,
                textShadow: '0 2px 20px rgba(255, 255, 255, 0.1), 0 4px 40px rgba(255, 255, 255, 0.05)'
              }}
            >
              Oui Track
            </motion.span>
            <h1
              style={{ 
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                letterSpacing: '-0.01em',
                textShadow: '0 2px 20px rgba(255, 255, 255, 0.1), 0 4px 40px rgba(255, 255, 255, 0.05)'
              }}
            >
              <span className="block">{t.hero.title}</span>
              <span className="block" style={{ fontSize: '0.75em', fontWeight: 400 }}>{t.hero.subtitle}</span>
            </h1>
          </motion.div>
          
          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
          >
            <Link href="/login">
              <Button 
                className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all shadow-lg"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {t.hero.getStarted}
              </Button>
            </Link>
            <Link href="#features">
              <Button 
                variant="outline"
                className="px-6 py-3 bg-black/40 border border-white/20 text-white rounded-full font-medium hover:bg-black/60 hover:border-white/30 transition-all backdrop-blur-sm"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {t.hero.learnMore}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
