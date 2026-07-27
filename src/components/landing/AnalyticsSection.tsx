import AnimationPlaceholder from './AnimationPlaceholder'

export default function AnalyticsSection() {
  return (
    <AnimationPlaceholder name="AnalyticsReveal">
      <section className="landing-section bg-white">
        <div className="landing-container">
          {/* Centered Intro */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
              See Your Habits
            </p>

            <h2 className="section-title mb-6">
              See where your money goes.
            </h2>

            <p className="section-subtitle">
              Simple charts show you what you buy the most. It is easy to see how you are doing and find ways to save more.
            </p>
          </div>

          {/* Chart Placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pie Chart */}
            <AnimationPlaceholder name="PieChartAnimation">
              <div className="visual-placeholder min-h-[280px] flex flex-col items-center justify-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                </div>
                <span className="text-gray-400 text-sm">What We Buy</span>
              </div>
            </AnimationPlaceholder>

            {/* Bar Chart */}
            <AnimationPlaceholder name="BarChartAnimation">
              <div className="visual-placeholder min-h-[280px] flex flex-col items-center justify-center gap-4">
                <div className="flex items-end gap-2 h-20">
                  <div className="w-5 bg-primary/15 rounded-t-md" style={{ height: '40%' }} />
                  <div className="w-5 bg-primary/25 rounded-t-md" style={{ height: '65%' }} />
                  <div className="w-5 bg-primary/35 rounded-t-md" style={{ height: '85%' }} />
                  <div className="w-5 bg-primary/20 rounded-t-md" style={{ height: '55%' }} />
                  <div className="w-5 bg-primary/30 rounded-t-md" style={{ height: '70%' }} />
                </div>
                <span className="text-gray-400 text-sm">Month to Month</span>
              </div>
            </AnimationPlaceholder>

            {/* Statistics Counter */}
            <AnimationPlaceholder name="CounterAnimation">
              <div className="visual-placeholder min-h-[280px] flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary/30 block mb-1">R 0</span>
                  <span className="text-gray-400 text-sm">Money Saved This Month</span>
                </div>
              </div>
            </AnimationPlaceholder>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
