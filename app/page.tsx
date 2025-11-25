import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
// import { ProblemValidation } from '@/components/landing/problem-validation'
import { SolutionPreview } from '@/components/landing/solution-preview'
// import { InteractiveDemo } from '@/components/landing/interactive-demo'
// import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      {/* <ProblemValidation /> */}
      <SolutionPreview />
      {/* <InteractiveDemo /> */}
      {/* <Features /> */}
      <Pricing />
      <Footer />
    </div>
  )
}
