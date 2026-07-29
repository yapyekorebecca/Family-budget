import AnimationPlaceholder from './AnimationPlaceholder'

export default function BudgetPlanning() {
  return (
    <AnimationPlaceholder name="BudgetPlanningReveal">
      <section className="landing-section">
        <div className="landing-container">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left — Visual Placeholder (alternated layout) */}
            <div className="flex-1 w-full flex justify-center lg:justify-start">
              <img
                src="/planning.svg"
                alt="Budget Planning"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>

            {/* Right — Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="section-title mb-6">
                Stay within your budget.
              </h2>

              <div className="space-y-5 text-gray-600 text-lg leading-relaxed max-w-lg">
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
