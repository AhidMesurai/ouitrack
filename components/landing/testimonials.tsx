'use client'

import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    image: '👩‍💼',
    content: 'OuiTrack has transformed how we present analytics to our clients. The reports are professional, easy to understand, and save us hours every week.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Agency Owner',
    company: 'Digital Growth Co.',
    image: '👨‍💻',
    content: 'Finally, a tool that makes analytics reporting actually enjoyable. Our clients love the beautiful reports, and we love how easy it is to create them.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Analytics Manager',
    company: 'E-commerce Solutions',
    image: '👩‍💼',
    content: 'The setup was incredibly fast, and the reports look amazing. It\'s exactly what we needed to streamline our reporting process.',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-4">
            <Star className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span className="text-sm font-semibold text-pink-400">Testimonials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Loved by Teams
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what our customers are saying about OuiTrack
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative h-full p-8 bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6">
                  <Quote className="w-12 h-12 text-blue-500/20 group-hover:text-blue-500/30 transition-colors" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm font-medium text-blue-400">{testimonial.company}</div>
                  </div>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
