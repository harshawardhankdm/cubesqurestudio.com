import { cn } from '@/lib/utils'

const gapMap = {
  4: 'gap-1',
  8: 'gap-2',
  12: 'gap-3',
  16: 'gap-4',
  20: 'gap-5',
  24: 'gap-6',
  32: 'gap-8',
  48: 'gap-12',
  64: 'gap-16',
}

export function Stack({
  as: Component = 'div',
  direction = 'col',
  gap = 16,
  align,
  justify,
  className,
  children,
  ...props
}) {
  const isRow = direction === 'row'
  return (
    <Component
      className={cn(
        'flex',
        isRow ? 'flex-row' : 'flex-col',
        gapMap[gap] || 'gap-4',
        align && `items-${align}`,
        justify && `justify-${justify}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
