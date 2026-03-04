import { FC, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

import { PageHeader } from './page-header'
import { PageTitle } from './page-title'
import { PageBody } from './page-body'
import { PageSection } from './page-section'

interface PageComponent extends FC<PropsWithChildren<{ className?: string }>> {
  Header: typeof PageHeader
  Title: typeof PageTitle
  Body: typeof PageBody
  Section: typeof PageSection
}

const Page: PageComponent = ({ children, className }) => {
  return (
    <div className={cn('flex min-h-full w-full flex-col', className)}>
      {children}
    </div>
  )
}

Page.Header = PageHeader
Page.Title = PageTitle
Page.Body = PageBody
Page.Section = PageSection

export { Page }
