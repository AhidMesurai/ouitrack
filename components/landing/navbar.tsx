'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Logo } from './logo'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from './language-switcher'
import { User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Determine active section based on scroll position
      const sections = ['top', 'how-it-works', 'features', 'pricing']
      const scrollPosition = window.scrollY + 100 // Offset for navbar
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i])
            break
          }
        }
      }
      
      // If at top, set active to 'top'
      if (window.scrollY < 100) {
        setActiveSection('top')
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#', label: t.nav.home, sectionId: 'top' },
    { href: '#how-it-works', label: t.nav.features, sectionId: 'how-it-works' },
    { href: '#pricing', label: t.nav.pricing, sectionId: 'pricing' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-all duration-300 relative ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-sm py-4' 
          : 'py-4'
      }`}>
        {/* Logo - Left (Absolute positioned) */}
        <div className="absolute left-4 sm:left-6 lg:left-8 pointer-events-auto">
          <Logo />
        </div>

        {/* Desktop Navigation Links - Center */}
        <div className="hidden md:flex items-center gap-6 pointer-events-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.sectionId
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.href === '#') {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  } else if (item.href.startsWith('#')) {
                    e.preventDefault()
                    const element = document.querySelector(item.href)
                    if (element) {
                      const offset = 80 // Account for fixed navbar
                      const elementPosition = element.getBoundingClientRect().top
                      const offsetPosition = elementPosition + window.pageYOffset - offset
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    }
                  }
                }}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
                style={{ 
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  letterSpacing: 'normal'
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Login Icon and Language Switcher - Right (Absolute positioned) */}
        <div className="hidden md:flex items-center gap-3 absolute right-4 sm:right-6 lg:right-8 pointer-events-auto">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition-colors duration-200"
            aria-label={t.nav.login}
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3 pointer-events-auto absolute right-4 sm:right-6 lg:right-8">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition-colors duration-200"
            aria-label={t.nav.login}
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            {navItems.map((item) => {
              const isActive = activeSection === item.sectionId
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    if (item.href === '#') {
                      e.preventDefault()
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    } else if (item.href.startsWith('#')) {
                      e.preventDefault()
                      const element = document.querySelector(item.href)
                      if (element) {
                        const offset = 80
                        const elementPosition = element.getBoundingClientRect().top
                        const offsetPosition = elementPosition + window.pageYOffset - offset
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        })
                      }
                    }
                  }}
                  className={`block transition-colors duration-200 py-2 ${
                    isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                  style={{ 
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    letterSpacing: 'normal'
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
