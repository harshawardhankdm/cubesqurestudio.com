'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Label = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5E5E63] dark:text-[#B0B0B6] select-none block mb-2',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
})
Label.displayName = 'Label'
