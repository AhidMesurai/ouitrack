'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import enMessages from '@/messages/en.json'
import frMessages from '@/messages/fr.json'

type Language = 'en' | 'fr'
type Messages = typeof enMessages

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Messages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage or default to 'en'
    // Only access localStorage in browser (client-side)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage === 'en' || savedLanguage === 'fr') {
        setLanguageState(savedLanguage)
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const messages = language === 'fr' ? frMessages : enMessages

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: messages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

