import AnimationPlaceholder from './AnimationPlaceholder'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Set up your family',
      description: 'Sign up and invite everyone to join.',
    },
    {
      number: '02',
      title: 'Add your spending',
      description: 'Quickly log what you buy each day.',
    },
    {
      number: '03',
      title: 'Watch your progress',
      description: 'See how well you are sticking to the plan.',
    },
  ]

  return (
    <AnimationPlaceholder name="TimelineReveal">
      <section className="landing-section bg-white">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">
              Getting Started
            </p>
            <h2 className="section-title">
              Three easy steps.
            </h2>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" aria-hidden="true" />

            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={step.number} className="relative flex gap-8 items-start">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-[#1f2937] mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-lg leading-relaxed">{step.description}</p>
                  </div>

                  {/* Timeline animation placeholder between steps */}
                  {index < steps.length - 1 && (
                    <div data-animation={`TimelineStep${index + 1}Animation`} className="absolute left-6 top-full w-px h-16" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimationPlaceholder>
  )
}
