import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 sticky top-0 bg-[#fef7f0]/95 backdrop-blur-sm z-50 border-b border-gray-200/50">
      <div>
        <Link to="/">
          <span className="text-4xl font-bold" style={{ fontFamily: 'Florida Vibes, sans-serif' }}>
            <span className="text-primary">Fam</span>
            <span className="text-gray-500">Budget</span>
          </span>
        </Link>
      </div>
      <nav className="flex gap-4 items-center">
        <Link to="/login">
          <button className="px-6 py-2 text-gray-700 hover:text-primary font-medium transition-colors">
            Log In
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold transition-colors shadow-md hover:shadow-lg">
            Get Started
          </button>
        </Link>
      </nav>
    </header>
  )
}
