import type { ReactNode } from 'react'

interface AnimationPlaceholderProps {
  name: string
  children: ReactNode
  className?: string
}

/**
 * Generic animation wrapper component.
 * Each section is wrapped in this to make adding Framer Motion or GSAP trivial later.
 * 
 * To animate: replace the <div> with <motion.div> and add your animation variants.
 * The `data-animation` attribute identifies which animation to apply.
 */
export default function AnimationPlaceholder({ name, children, className = '' }: AnimationPlaceholderProps) {
  return (
    <div data-animation={name} className={className}>
      {children}
    </div>
  )
}
