import AnimationPlaceholder from './AnimationPlaceholder'

export default function ProblemSection() {
  return (
    <AnimationPlaceholder name="ProblemReveal">
      <section className="landing-section bg-white">
        <div className="landing-container">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left — Content */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
                Why FamBudget?
              </p>

              <h2 className="section-title mb-6">
                Money shouldn't cause family stress.
              </h2>

              <div className="space-y-5 text-gray-500 text-lg leading-relaxed max-w-lg">
                <p>
                  It's hard to keep track of receipts and surprise bills. When you don't know 
                  what you're spending, it's easy to spend too much.
                </p>
                <p>
                  This makes it hard to save for the future and can cause tension at home.
                </p>
                <p>
                  FamBudget helps you fix this, together.
                </p>
              </div>
            </div>

            {/* Right — Visual Placeholder */}
            <div className="flex-1 w-full">
              <div className="visual-placeholder min-h-[400px] flex items-center justify-center">
                <span className="text-gray-400 text-sm">Illustration / Animation</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
