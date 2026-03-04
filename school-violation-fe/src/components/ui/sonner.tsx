'use client'

import { Toaster as Sonner } from 'sonner'
import Icon from '../icons'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'light'}
      className="toaster group"
      position="top-center"
      visibleToasts={1}
      icons={{
        error: <Icon name="PlusCloseCircleFilled" size={16} />,
        success: <Icon name="CheckCircleFilled" size={16} />,
      }}
      expand={true}
      toastOptions={{
        unstyled: true,
        closeButton: true,
        classNames: {
          toast:
            'group toast group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg flex gap-1 items-center text-sm px-6 py-2.5 rounded-lg relative group-[.toaster]:w-auto',
          description: 'group-[.toast]:text-muted-foreground',
          title:
            'font-semibold group-[.toaster]:ml-2 group-[.toast]:whitespace-nowrap',
          actionButton:
            'group-[.toast]:bg-transparent group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:underline group-[.toast]:whitespace-nowrap group-[.toast]:hover:cursor-pointer group-[.toast]:ml-4',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          closeButton:
            'group-[.toast]:!bg-transparent group-[.toast]:!border-none order-last text-xl [&>svg]:w-[18px] [&>svg]:h-[18px] ml-4 hover:cursor-pointer',
          success:
            'group-[.toaster]:bg-green-600 group-[.toaster]:text-white group-[.toaster]:border-none',
          error:
            'group-[.toaster]:bg-red-600 group-[.toaster]:text-white group-[.toaster]:border-none',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
