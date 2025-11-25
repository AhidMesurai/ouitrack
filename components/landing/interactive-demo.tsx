'use client'

import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'

export function InteractiveDemo() {
  const { t } = useLanguage()

  const demoStats = [
    { icon: Users, label: 'Active Users', value: '12.5K', change: '+23%' },
    { icon: TrendingUp, label: 'Sessions', value: '45.2K', change: '+18%' },
    { icon: DollarSign, label: 'Revenue', value: '$89.4K', change: '+31%' },
    { icon: BarChart3, label: 'Conversion', value: '3.2%', change: '+5%' },
  ]

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-white text-left mb-16"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {t.interactiveDemo?.title || 'See It In Action'}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Dashboard Preview */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-800 p-8 shadow-2xl">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {demoStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                  >
                    <Icon className="w-5 h-5 text-purple-400 mb-2" />
                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-green-400 font-semibold">{stat.change}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Chart Preview */}
            <div className="h-64 bg-white/5 rounded-xl border border-white/10 p-4 flex items-end justify-between gap-2">
              {[40, 65, 45, 80, 60, 95, 70, 55, 75, 85, 60, 90].map((height, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/30"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {t.interactiveDemo?.cta || 'Try It Free'}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

