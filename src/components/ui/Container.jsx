import { cn } from '@/lib/utils'

export function Container({ className, children, as: Component = 'div', ...props }) {
  return (
    <Component
      data-container
      className={cn('container-site w-full max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 box-border', className)}
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
      {...props}
    >
      {children}
    </Component>
  )
}
