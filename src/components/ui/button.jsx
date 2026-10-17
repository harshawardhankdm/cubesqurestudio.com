'use client'
import * as React from 'react'
import Key from '@/components/ui/Key'

export { Key }

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    // Map legacy button variants & sizes to Key
    const keyVariant =
      variant === 'primary'
        ? 'accent'
        : variant === 'secondary' || variant === 'pill'
        ? 'light'
        : variant === 'outline' || variant === 'ghost'
        ? 'graphite'
        : variant

    const keySize =
      size === 'lg' || size === 'default'
        ? 'lg'
        : size === 'md'
        ? 'md'
        : size === 'sm'
        ? 'sm'
        : size === 'icon'
        ? 'icon'
        : 'md'

    return (
      <Key
        ref={ref}
        variant={keyVariant}
        size={keySize}
        className={className}
        {...props}
      >
        {children}
      </Key>
    )
  }
)
Button.displayName = 'Button'
