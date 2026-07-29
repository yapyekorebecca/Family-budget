import AnimationPlaceholder from './AnimationPlaceholder'

export default function ExpenseTracking() {
  return (
    <AnimationPlaceholder name="ExpenseTrackingReveal">
      <section className="landing-section bg-white">
        <div className="landing-container">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left — Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="section-title mb-6">
                Record your daily expenses.
              </h2>

              <div className="space-y-5 text-gray-600 text-lg leading-relaxed max-w-lg">
                <p>
                  Quickly add what you spent at the store. You can tag it as groceries, gas, or fun.
                </p>
                <p>
                  Now you'll never have to wonder where the money went at the end of the week.
                </p>
              </div>
            </div>

            {/* Right — Visual Placeholder */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <img
                src="/Monthly Expenses and Budget planning.svg"
                alt="Monthly Expenses and Budget Planning"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
