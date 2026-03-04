import { FC, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui'
import Breadcrumb from '@/components/ui/breadcrumbs'

type BreadcrumbProps = {
  onClick?: () => void
  href?: string
  children: string | React.ReactNode
}

type PageHeaderProps = PropsWithChildren<{
  className?: string
  breadcrumbs?: BreadcrumbProps[]
  separator?: boolean
}>

const PageHeader: FC<PageHeaderProps> = ({
  children,
  className,
  breadcrumbs,
  separator = true,
}) => {
  return (
    <header
      className={cn(
        'relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      >
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      </div>
      <Container className="relative z-10 py-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="[&_.text-text-link]:text-white [&_.text-text-primary]:text-white/80">
            <Breadcrumb>
              {breadcrumbs.map((breadcrumb, index) => (
                <Breadcrumb.Item
                  key={index}
                  href={breadcrumb.href}
                  onClick={breadcrumb.onClick}
                >
                  {breadcrumb.children}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
        )}
        {children}
      </Container>
      {separator && (
        <div
          className="relative z-10 h-8 bg-gradient-to-b from-white/15 to-transparent"
          aria-hidden="true"
        />
      )}
    </header>
  )
}

export { PageHeader }
