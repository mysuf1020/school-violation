import { FC, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui'

type PageBodyProps = PropsWithChildren<{
  className?: string
}>

const PageBody: FC<PageBodyProps> = ({ children, className }) => {
  return (
    <section
      className={cn(
        'relative z-10 -mt-8 flex-1 bg-slate-50/95 pb-12 pt-12',
        className,
      )}
    >
      <Container className="flex flex-col gap-6">{children}</Container>
    </section>
  )
}

export { PageBody }
