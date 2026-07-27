import AnimationPlaceholder from './AnimationPlaceholder'

export default function ProblemSection() {
  return (
    <AnimationPlaceholder name="ProblemReveal">
      <section className="landing-section bg-white pt-4 lg:pt-6">
        <div className="landing-container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left — Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="section-title mb-6">
                Money shouldn't cause family stress.
              </h2>

              <div className="space-y-5 text-gray-600 text-lg leading-relaxed max-w-lg">
                <p>
                  It's hard to keep track of receipts and surprise bills. When you don't know 
                  what you're spending, it's easy to spend too much.
                </p>
                <p>
                  This makes it hard to save for the future and can cause tension at home.
                </p>
                <p className="font-semibold text-gray-800">
                  FamBudget helps you fix this, together.
                </p>
              </div>
            </div>

            {/* Right — Visual Placeholder */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <img
                src="/Finance Balancing.svg"
                alt="Finance Balancing — family budget management illustration"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
