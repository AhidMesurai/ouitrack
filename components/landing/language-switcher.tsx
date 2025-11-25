'use client'

import { useLanguage } from '@/contexts/language-context'

// UK Flag Icon Component
function UKFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="uk-a">
          <path fillOpacity=".7" d="M-85.3 0h682.6v512h-682.6z" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-a)" transform="translate(80) scale(.94)">
        <g strokeWidth="1pt">
          <path fill="#006" d="M-256 0H768v512H-256z" />
          <path
            fill="#fff"
            d="M-256 0v57.2l909.5 454.8H768v-57.2L-141.5 0H-256zM768 0v57.2l-909.5 454.8H-256v-57.2L653.5 0H768z"
          />
          <path
            fill="#fff"
            d="M170.7 0v512h170.6V0H170.7zM-256 170.7v170.6H768V170.7H-256z"
          />
          <path
            fill="#c00"
            d="M-256 204.8v102.4H768V204.8H-256zM204.8 0v512h102.4V0H204.8zM-256 512L85.3 341.3h76.4l-341.7 170.7zm0-512L85.3 170.7H8.9L-256 38.2V0zm606.4 170.7L691.7 0H768L426.3 170.7h-75.1zM768 512L426.3 341.3H502l341.7 170.6V512z"
          />
        </g>
      </g>
    </svg>
  )
}

// France Flag Icon Component
function FranceFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#fff" d="M0 0h640v480H0z" />
        <path fill="#00267f" d="M0 0h213.3v480H0z" />
        <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
      </g>
    </svg>
  )
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`p-1.5 rounded transition-all ${
          language === 'en'
            ? 'bg-gray-800/50 ring-2 ring-white/20'
            : 'hover:bg-gray-800/30'
        }`}
        aria-label="Switch to English"
      >
        <UKFlagIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`p-1.5 rounded transition-all ${
          language === 'fr'
            ? 'bg-gray-800/50 ring-2 ring-white/20'
            : 'hover:bg-gray-800/30'
        }`}
        aria-label="Switch to French"
      >
        <FranceFlagIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

