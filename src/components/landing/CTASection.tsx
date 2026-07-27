import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AnimationPlaceholder from './AnimationPlaceholder'

export default function CTASection() {
  return (
    <AnimationPlaceholder name="CTAReveal">
      <section className="landing-section bg-gradient-to-br from-primary/8 to-primary/3">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight mb-6 text-[#1f2937]">
            Ready to plan your family's future?
          </h2>

          <p className="text-lg lg:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join other families who are saving more and stressing less. It only takes a minute to get started.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to="/signup">
              <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/login">
              <button className="border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-10 py-4 rounded-full text-lg font-semibold transition-all">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
