import { cn } from '@/utils'
import noiseLight from '@/assets/noise-light.png'
import noiseDark from '@/assets/noise-dark.png'

export type NoisePatternProps = {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'dark'
}

export const NoisePattern = ({ className, children, variant = 'light' }: NoisePatternProps) => {
  const noiseClassName = cn(
    'absolute inset-0 w-full h-full bg-repeat bg-[length:480px_480px]',
    variant === 'light' ? 'mix-blend-soft-light bg-blend-soft-light' : 'opacity-40',
  )

  return (
    <div className={cn('absolute pointer-events-none select-none', className)}>
      {children}
      <div
        className={noiseClassName}
        style={{
          backgroundImage: `url(${variant === 'light' ? noiseLight.src : noiseDark.src})`,
        }}
      />
    </div>
  )
}
