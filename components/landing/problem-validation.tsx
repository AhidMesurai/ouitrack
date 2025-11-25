'use client'

import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { BarChart3, Eye, FileText, Target } from 'lucide-react'
import TextType from '@/components/ui/text-type'

export function ProblemValidation() {
  const { t } = useLanguage()

  const painPoints = [
    {
      icon: BarChart3,
      title: t.problemValidation.point1.title,
      description: t.problemValidation.point1.description,
    },
    {
      icon: Eye,
      title: t.problemValidation.point2.title,
      description: t.problemValidation.point2.description,
    },
    {
      icon: FileText,
      title: t.problemValidation.point3.title,
      description: t.problemValidation.point3.description,
    },
    {
      icon: Target,
      title: t.problemValidation.point4.title,
      description: t.problemValidation.point4.description,
    },
  ]

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <TextType
                        text={[point.title]}
                        typingSpeed={50}
                        pauseDuration={3000}
                        showCursor={false}
                        startOnVisible={true}
                        loop={false}
                        className="text-base font-semibold text-white"
                        as="span"
                      />
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed min-h-[3rem]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <TextType
                        text={[point.description]}
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
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-purple-400 font-medium">{t.problemValidation.yesThatsMe}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

