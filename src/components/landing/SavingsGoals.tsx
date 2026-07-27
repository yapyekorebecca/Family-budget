import AnimationPlaceholder from './AnimationPlaceholder'

export default function SavingsGoals() {
  return (
    <AnimationPlaceholder name="SavingsGoalReveal">
      <section className="landing-section">
        <div className="landing-container">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
                Look Forward
              </p>
              <h2 className="section-title mb-6">
                Save for what matters.
              </h2>
              <div className="space-y-5 text-gray-500 text-lg leading-relaxed max-w-lg">
                <p>
                  Plan for a family trip, school fees, or a rainy day fund.
                </p>
                <p>
                  Watch your savings grow together. It feels great to reach your goals as a family.
                </p>
              </div>
            </div>
            <div className="flex-1 w-full flex justify-center">
              <div className="visual-placeholder w-72 h-72 lg:w-80 lg:h-80 rounded-full flex flex-col items-center justify-center gap-3">
                <svg className="w-20 h-20 text-primary/20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#14b8a6" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="264" strokeDashoffset="92"
                    transform="rotate(-90 50 50)" opacity={0.4} />
                </svg>
                <span className="text-gray-400 text-sm">Progress Indicator</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
