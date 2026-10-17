'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef(({ className, rows = 5, ...props }, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        'form-field-base flex min-h-[160px] w-full rounded-[16px] px-5 py-4 text-[16px] text-[#1D1D1F] placeholder:text-[#6E6E73] resize-y',
        className
      )}
      style={{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '16px',
        paddingBottom: '16px',
        boxSizing: 'border-box',
      }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'
