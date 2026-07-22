import { Link } from 'react-router-dom'
import { Menu, Mail, MessageCircle, Send, ChevronDown } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fef7f0] text-[#1f2937]">
      {/* Header */}
      <header className="flex items-center justify-start px-8 py-4">
        <div>
          {/* FamBudget Logo in Florida Vibes Font */}
          <span className="text-5xl font-bold" style={{ fontFamily: 'Florida Vibes, sans-serif' }}>
            <span className="text-primary">Fam</span>
            <span className="text-gray-500">Budget</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row items-center justify-between px-8 py-6 gap-6">
        {/* Left Illustration */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <div className="relative">
            {/* Your SVG Animation Only */}
            <img 
              src="/Expo Logic Event Budget Contactless Solutions Hero Animation v2.svg" 
              alt="Budget Animation" 
              className="w-64 h-64 lg:w-[400px] lg:h-[400px] object-contain" 
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-2xl lg:text-4xl font-bold leading-tight mb-3">
            Take control of your family budget
          </h1>
          <p className="text-base text-gray-500 mb-5">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-xl font-semibold transition-all">
                Login
              </button>
            </Link>
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-8 py-3 rounded-full text-xl font-semibold transition-all">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 pb-6 px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between text-xs text-gray-500">
          <div>Press kit</div>
          <div className="flex flex-col items-center">
            <ChevronDown className="w-5 h-5 mb-1" />
            <span>Scroll to learn more</span>
          </div>
          <div className="flex gap-3 mt-3 lg:mt-0">
            <button className="p-1.5 rounded-full bg-gray-800 text-white">
              <Mail className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-full bg-gray-800 text-white">
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-full bg-gray-800 text-white">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
