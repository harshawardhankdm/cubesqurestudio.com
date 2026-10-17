'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'form-field-base flex h-[56px] w-full rounded-[16px] px-5 py-3 text-[16px] text-[#1D1D1F] placeholder:text-[#6E6E73]',
        className
      )}
      style={{
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
      }}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'
