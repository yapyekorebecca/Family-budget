import AnimationPlaceholder from './AnimationPlaceholder'

export default function DashboardShowcase() {
  return (
    <AnimationPlaceholder name="DashboardReveal">
      <section className="landing-section">
        <div className="max-w-6xl mx-auto px-8">
          {/* Centered Intro */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
              Your Home Screen
            </p>

            <h2 className="section-title mb-6">
              A clear picture of your money.
            </h2>

            <p className="section-subtitle">
              Open the app and instantly see how much you have left this month. 
              Everyone in the family can check the budget anytime.
            </p>
          </div>

          {/* Dashboard Screenshot Placeholder */}
          <div className="max-w-5xl mx-auto flex items-center justify-center">
            <img
              src="/Budget Management animation for lottie.svg"
              alt="Budget Management Dashboard"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
