import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-gray-400">
          <span>Solution crafted with care by</span>
          <Link 
            href="https://mesurai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-purple-400 transition-colors font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Mesurai.com
          </Link>
        </div>
      </div>
    </footer>
  )
}
