'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function Pricing() {
  const { t } = useLanguage()

  const tiers = [
    {
      name: t.pricing.starter.name,
      price: t.pricing.starter.price,
      period: t.pricing.starter.period,
      description: t.pricing.starter.description,
      features: t.pricing.starter.features,
      popular: false,
    },
    {
      name: t.pricing.professional.name,
      price: t.pricing.professional.price,
      period: t.pricing.professional.period,
      description: t.pricing.professional.description,
      features: t.pricing.professional.features,
      popular: true,
    },
    {
      name: t.pricing.agency.name,
      price: t.pricing.agency.price,
      period: t.pricing.agency.period,
      description: t.pricing.agency.description,
      features: t.pricing.agency.features,
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative ${tier.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <div className={`relative h-full p-8 rounded-3xl border-2 transition-all duration-300 ${
                tier.popular
                  ? 'bg-gradient-to-br from-gray-900 to-black border-purple-500/50 shadow-2xl shadow-purple-500/30'
                  : 'bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-gray-700 hover:shadow-xl'
              }`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold shadow-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t.pricing.mostPopular}
                    </span>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="font-bold text-white mb-2" style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                    fontWeight: 700
                  }}>
                    {tier.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {tier.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {tier.price}
                    </span>
                    <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {tier.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <Check className={`w-4 h-4 flex-shrink-0 ${
                        tier.popular ? 'text-purple-400' : 'text-green-400'
                      }`} />
                      <span className="text-xs text-gray-300 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href="/login" className="block">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className={`w-full py-4 text-xs font-semibold rounded-xl transition-all ${
                        tier.popular
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                          : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {t.pricing.cta}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
