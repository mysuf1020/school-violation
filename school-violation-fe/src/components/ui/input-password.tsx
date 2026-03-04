import * as React from 'react'

import { Text } from './typography/text'
import { Input } from './input'
import Icon from '../icons'

type InputCustomProps = {
  requirementLabel?: string
  error?: boolean
  hideSuffixIcon?: boolean
}

type InputProps = Omit<React.ComponentProps<'input'>, 'prefix' | 'suffix'> &
  InputCustomProps

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, requirementLabel, hideSuffixIcon, ...props }, ref) => {
    const [isFocus, setFocus] = React.useState(false)
    const [displayPassword, setDisplayPassword] = React.useState(false)
    return (
      <>
        <Input
          ref={ref}
          type={displayPassword ? 'text' : 'password'}
          className={className}
          onFocus={(e) => {
            setFocus(true)
            if (props.onFocus) {
              props.onFocus(e)
            }
          }}
          onBlur={(e) => {
            setFocus(false)
            if (props.onBlur) {
              props.onBlur(e)
            }
          }}
          suffix={
            <button
              hidden={hideSuffixIcon}
              type="button"
              tabIndex={-1}
              onClick={() => setDisplayPassword((prevState) => !prevState)}
              className="text-neutral-600 pr-3"
            >
              {displayPassword && <Icon name="EyeCrossedOutlined" size={16} />}
              {!displayPassword && <Icon name="EyeOutlined" size={16} />}
            </button>
          }
          {...props}
        />
        {isFocus && !error && requirementLabel && (
          <Text className="text-neutral-600">{requirementLabel}</Text>
        )}
      </>
    )
  },
)
InputPassword.displayName = 'InputPassword'

export { InputPassword }
