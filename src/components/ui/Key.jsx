'use client'
import React, { useRef, useState, useCallback } from 'react'
import { playTick } from '@/lib/sound'

/**
 * Universal Skeuomorphic Physical Key Component
 * Matches mechanical switch construction:
 * - Brushed-metal outer bezel
 * - Black recessed gap (well)
 * - Colored base ring
 * - Domed cap with directional top-left specular & inner dome highlight
 * - Cap sinks into the well on press while bezel stays still
 */
export const Key = React.forwardRef(function Key(
  {
    children,
    variant = 'accent', // 'accent' | 'light' | 'graphite' | 'warm'
    size = 'md',        // 'lg' | 'md' | 'sm' | 'icon'
    circle = false,
    href,
    as,
    className = '',
    style = {},
    icon: Icon,
    disabled = false,
    loading = false,
    onClick,
    onMouseMove,
    type = 'button',
    ...props
  },
  forwardedRef
) {
  const localRef = useRef(null)
  const ref = forwardedRef || localRef
  const [isPressed, setIsPressed] = useState(false)

  // Track cursor within cap for dynamic specular highlight
  const handleMouseMove = useCallback((e) => {
    const el = ref.current
    if (el) {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--mx', `${x.toFixed(1)}%`)
      el.style.setProperty('--my', `${y.toFixed(1)}%`)
    }
    if (onMouseMove) onMouseMove(e)
  }, [ref, onMouseMove])

  const handleClick = useCallback((e) => {
    if (disabled || loading) {
      e.preventDefault()
      return
    }
    try {
      playTick()
    } catch {
      // Audio fallback safe
    }
    if (onClick) onClick(e)
  }, [disabled, loading, onClick])

  const Component = href ? 'a' : as || 'button'

  const sizeClass = `key--${size}`
  const variantClass = `key--${variant}`
  const circleClass = circle ? 'key--circle' : ''

  // Has base ring: lg has a 5px base ring, md/sm/icon thin it out
  const hasBaseRing = size === 'lg'

  return (
    <Component
      ref={ref}
      href={href}
      type={href ? undefined : type}
      disabled={disabled}
      aria-disabled={disabled}
      aria-busy={loading}
      data-pressed={isPressed || undefined}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className={`key ${sizeClass} ${variantClass} ${circleClass} ${className}`}
      style={{
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >
      <span className="key__well">
        {hasBaseRing ? (
          <span className="key__base">
            <span className="key__cap">
              <span className="key__label">
                {children}
                {Icon && (
                  <span className="key__icon flex-shrink-0 inline-flex items-center justify-center">
                    {typeof Icon === 'function' || typeof Icon === 'object' ? <Icon size={18} /> : Icon}
                  </span>
                )}
              </span>
            </span>
          </span>
        ) : (
          <span className="key__cap">
            <span className="key__label">
              {children}
              {Icon && (
                <span className="key__icon flex-shrink-0 inline-flex items-center justify-center">
                  {typeof Icon === 'function' || typeof Icon === 'object' ? <Icon size={18} /> : Icon}
                </span>
              )}
            </span>
          </span>
        )}
      </span>
    </Component>
  )
})

Key.displayName = 'Key'
export default Key
