'use client'

import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { 
  Plug, 
  Box, 
  MousePointerClick, 
  LayoutTemplate, 
  RefreshCw, 
  Code 
} from 'lucide-react'
import TextType from '@/components/ui/text-type'

export function Features() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Plug,
      title: t.features.feature1.title,
      description: t.features.feature1.description,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Box,
      title: t.features.feature2.title,
      description: t.features.feature2.description,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: MousePointerClick,
      title: t.features.feature3.title,
      description: t.features.feature3.description,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: LayoutTemplate,
      title: t.features.feature4.title,
      description: t.features.feature4.description,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: RefreshCw,
      title: t.features.feature5.title,
      description: t.features.feature5.description,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Code,
      title: t.features.feature6.title,
      description: t.features.feature6.description,
      gradient: 'from-indigo-500 to-purple-500',
    },
  ]

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2" style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                  fontWeight: 700
                }}>
                  <TextType
                    text={[feature.title]}
                    typingSpeed={50}
                    pauseDuration={3000}
                    showCursor={false}
                    startOnVisible={true}
                    loop={false}
                    className="font-semibold text-white"
                    as="span"
                  />
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed min-h-[3rem]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <TextType
                    text={[feature.description]}
                    typingSpeed={30}
                    pauseDuration={3000}
                    showCursor={false}
                    startOnVisible={true}
                    loop={false}
                    initialDelay={500}
                    className="text-sm text-gray-400"
                    as="span"
                  />
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
