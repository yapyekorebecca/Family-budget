import AnimationPlaceholder from './AnimationPlaceholder'

export default function BudgetPlanning() {
  return (
    <AnimationPlaceholder name="BudgetPlanningReveal">
      <section className="landing-section">
        <div className="landing-container">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left — Visual Placeholder (alternated layout) */}
            <div className="flex-1 w-full">
              <div className="visual-placeholder min-h-[420px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-sm">Budget Illustration</span>
                </div>
              </div>
            </div>

            {/* Right — Content */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
                Plan Ahead
              </p>

              <h2 className="section-title mb-6">
                Stay within your budget.
              </h2>

              <div className="space-y-5 text-gray-500 text-lg leading-relaxed max-w-lg">
                <p>
                  Decide how much you want to spend on food, bills, and fun each month. We'll show you how much you have left.
                </p>
                <p>
                  You'll know if you need to slow down before the money runs out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
