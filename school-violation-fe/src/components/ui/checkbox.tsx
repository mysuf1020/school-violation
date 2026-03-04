'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as _ from 'lodash'
import { cn } from '@/lib/utils'
import Icon from '../icons'

export type CheckboxProps = React.ComponentPropsWithRef<
  typeof CheckboxPrimitive.Root
> & { className?: string }

interface CheckboxComponents extends React.FC<CheckboxProps> {
  Group: typeof CheckboxGroup
  Item: typeof CheckboxItem
}

type CheckboxItemProps = React.PropsWithChildren<
  Omit<CheckboxProps, 'value' | 'checked'> & {
    value: string
  }
>

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  children,
  className,
  id,
  ...props
}) => {
  return (
    <div className={cn('flex flex-row gap-x-1.5 items-center', className)}>
      <div>
        <Checkbox {...props} id={id} />
      </div>
      <div className="text-sm font-normal">
        <label htmlFor={id}>{children}</label>
      </div>
    </div>
  )
}
const Checkbox: CheckboxComponents = ({ className, ref, ...props }) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded border-2 border-neutral-500 ring-offset-background hover:border-main-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'data-[state=checked]:bg-main-500 data-[state=checked]:mt-1 data-[state=checked]:border-main-500 data-[state=checked]:hover:opacity-80 active:ring-4 active:bg-[#171a1e1c] active:ring-[#171a1e1c] disabled:bg-neutral-300 data-[state=checked]:disabled:opacity-60 transition',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <div className="h-3.5 w-3.5">
        <Icon name="CheckOutlined" className="text-white" size={14} />
      </div>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)

type CheckboxGroupProps = React.PropsWithChildren<{
  onCheckedChange?: (values: string[]) => void
  title?: React.ReactNode
  layout: 'row' | 'column'
  defaultChecked?: string[]
  className?: string
}>

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  title,
  onCheckedChange,
  defaultChecked = [],
  children,
  layout = 'column',
  className,
}) => {
  const [checkedItems, setCheckedItems] =
    React.useState<string[]>(defaultChecked)

  const onItemCheckedChange = React.useCallback<
    (state: CheckboxPrimitive.CheckedState, itemValue: string) => void
  >(
    (state: CheckboxPrimitive.CheckedState, itemValue: string) => {
      if (state === true) {
        setCheckedItems((cur) => {
          const newItems = [...cur, itemValue]
          onCheckedChange?.(newItems)
          return newItems
        })
      } else if (state === false) {
        const checkedItem = checkedItems.find(
          (checkedItem) => checkedItem == itemValue,
        )

        if (!checkedItem) {
          return
        }
        _.remove(checkedItems, (item) => item == checkedItem)
        setCheckedItems(checkedItems)
        onCheckedChange?.(checkedItems)
      }
    },
    [checkedItems, onCheckedChange],
  )

  const items = React.useMemo<
    React.ReactElement<CheckboxItemProps>[] | undefined
  >(() => {
    const elements = React.Children.map(children, (child) => child)?.filter(
      (child) => React.isValidElement<CheckboxItemProps>(child),
    )

    if (!elements) {
      return undefined
    }

    return elements.map((element) =>
      React.cloneElement(element, {
        key: element.key,
        defaultChecked:
          defaultChecked.find(
            (checkedValue) => checkedValue == element.props.value,
          ) !== undefined,
        onCheckedChange: (checked: CheckboxPrimitive.CheckedState) => {
          onItemCheckedChange(checked, element.props.value)
          element.props?.onCheckedChange?.(checked)
        },
      }),
    )
  }, [children, defaultChecked, onItemCheckedChange])

  return (
    <>
      {title && <div className="mb-2.5">{title}</div>}
      <div
        className={cn(
          'flex',
          layout == 'column' ? 'flex-col gap-y-2.5' : 'flex-row gap-x-2.5',
          className,
        )}
      >
        {items?.map((item) => (
          <React.Fragment key={item.key}>{item}</React.Fragment>
        ))}
      </div>
    </>
  )
}

Checkbox.displayName = CheckboxPrimitive.Root.displayName
Checkbox.Group = CheckboxGroup
Checkbox.Item = CheckboxItem

export { Checkbox }
