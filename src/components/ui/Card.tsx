import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'subtle' | 'glass'
}

export default function Card({ children, variant = 'default', className = '', ...props }: CardProps) {
  const variantClass = {
    default: 'bg-surface dark:bg-dark-surface border border-border dark:border-dark-border shadow-sm',
    subtle: 'bg-surface-alt dark:bg-dark-surface-alt border border-border dark:border-dark-border',
    glass: 'bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl',
  }

  return (
    <div className={`rounded-2xl p-6 ${variantClass[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
