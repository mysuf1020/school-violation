import { FC, PropsWithChildren } from 'react'

const PageTitle: FC<PropsWithChildren> = ({ children }) => {
  return (
    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
      {children}
    </h1>
  )
}

export { PageTitle }
