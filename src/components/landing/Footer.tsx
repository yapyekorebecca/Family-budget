import { Link } from 'react-router-dom'
import { Mail, MessageCircle, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="px-8 py-16 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-3xl font-bold" style={{ fontFamily: 'Florida Vibes, sans-serif' }}>
              <span className="text-primary">Fam</span>
              <span className="text-gray-400">Budget</span>
            </span>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Modern family expense and budget management for modern households.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-primary transition-colors">Features</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">About</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FamBudget. All rights reserved.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
