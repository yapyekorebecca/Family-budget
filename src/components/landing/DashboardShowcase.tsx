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
          <div className="visual-placeholder aspect-video max-w-5xl mx-auto flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <span className="text-gray-400 text-sm">Dashboard Screenshot</span>
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
