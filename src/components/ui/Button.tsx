import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseClass = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
  
  const variantClass = {
    primary: 'bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:opacity-90',
    secondary: 'bg-secondary text-white hover:opacity-90',
    outline: 'border border-border dark:border-dark-border text-text dark:text-dark-text hover:bg-surface dark:hover:bg-dark-surface',
  }

  const sizeClass = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClass} ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
