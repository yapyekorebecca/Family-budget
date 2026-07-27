import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import DashboardShowcase from '../components/landing/DashboardShowcase'
import ExpenseTracking from '../components/landing/ExpenseTracking'
import BudgetPlanning from '../components/landing/BudgetPlanning'
import AnalyticsSection from '../components/landing/AnalyticsSection'
import SavingsGoals from '../components/landing/SavingsGoals'
import HowItWorks from '../components/landing/HowItWorks'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fef7f0] text-[#1f2937]">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <DashboardShowcase />
        <ExpenseTracking />
        <BudgetPlanning />
        <AnalyticsSection />
        <SavingsGoals />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
