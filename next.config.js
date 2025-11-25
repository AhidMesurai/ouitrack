/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static optimization for pages that use client-side context
  // This prevents build errors when pages use React Context
  output: undefined, // Let Netlify handle this
}

module.exports = nextConfig

