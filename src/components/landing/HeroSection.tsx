import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Shield, Heart } from 'lucide-react'
import AnimationPlaceholder from './AnimationPlaceholder'

export default function HeroSection() {
  return (
    <AnimationPlaceholder name="HeroReveal">
      <section className="landing-section pt-0">
        <div className="landing-container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* Left — Illustration */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <div className="relative">
                <img
                  src="/Expo Logic Event Budget Contactless Solutions Hero Animation v2.svg"
                  alt="FamBudget — family finance management illustration"
                  className="w-80 h-80 lg:w-[480px] lg:h-[480px] object-contain"
                />
              </div>
            </div>

            {/* Right — Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight mb-6 text-[#1f2937]">
                Keep all your family <span className="text-primary">expenses in one place</span>.
              </h1>

              <p className="text-lg lg:text-xl text-gray-500 mb-10 max-w-xl leading-relaxed">
                See where your money goes and save for what matters. FamBudget makes it easy to track your spending together.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
                <Link to="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-8 py-3.5 rounded-full text-lg font-semibold transition-all">
                    Log In
                  </button>
                </Link>
              </div>

              {/* Trust Statement */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>No complicated setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Built for modern families</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
