import { cn } from '@/utils'
import noiseLight from '@/assets/noise-light.png'
import noiseDark from '@/assets/noise-dark.png'

export type NoisePatternProps = {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'dark'
}

export const NoisePattern = ({ className, children, variant = 'light' }: NoisePatternProps) => {
  return (
    <div
      className={cn('noise-pattern absolute pointer-events-none select-none', className)}
      data-noise-variant={variant}
    >
      {children}
      <div
        className="noise-pattern__texture absolute inset-0 w-full h-full bg-repeat bg-[length:480px_480px]"
        style={{
          ['--noise-light-image' as string]: `url(${noiseLight.src})`,
          ['--noise-dark-image' as string]: `url(${noiseDark.src})`,
        }}
      />
    </div>
  )
}
