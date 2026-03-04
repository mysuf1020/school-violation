'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

const buttonVariants = cva(
  'inline-flex hover:cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:text-neutral-400 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-brand-500 text-primary-foreground hover:shadow-sm button-primary-hover disabled:bg-neutral-50 disabled:border disabled:border-neutral-200',
        destructive:
          'bg-red-500 text-destructive-foreground hover:shadow-sm hover:bg-destructive/90 disabled:opacity-50 text-white disabled:text-white',
        outline:
          'border-[1.5px] border-main-500 text-main-500 bg-background hover:bg-accent hover:shadow-sm hover:text-main-600 disabled:text-neutral-400 disabled:bg-neutral-100 disabled:border-neutral-200',
        secondary:
          'bg-white text-brand-600 border border-brand-500 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200',
        ghost:
          'hover:bg-accent hover:text-accent-foreground disabled:opacity-50',
        link: 'text-blue-500 hover:text-main-600 !px-0 disabled:opacity-50 underline',
        linkWarning:
          'text-orange-700 hover:text-orange-700 !px-0 disabled:opacity-50 underline px-2',
        icon: 'h-9 w-10 hover:bg-accent hover:text-accent-foreground disabled:opacity-50',
        filter: 'bg-brand-50 text-main-700',
        success:
          'bg-green-500 hover:bg-green-400 disabled:bg-neutral-100 text-white disabled:text-neutral-400 disabled:border disabled:border-neutral-200',
        primaryFlat: 'bg-neutral-200 text-neutral-900',
        secondaryFlat:
          'bg-white text-primary border border-[#DEDEDE] disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200',
      },
      size: {
        xs: 'px-1 rounded-md py-1',
        default: 'h-9 px-3 rounded-md py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  pill?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      type = 'button',
      pill,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          className,
          isLoading && 'pointer-events-none',
          pill && 'rounded-full',
        )}
        ref={ref}
        type={type}
        {...props}
      >
        {isLoading && <Spinner />}
        {props.children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
