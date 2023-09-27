import InfoOutline from '@components/Common/Icons/InfoOutline'
import { Text, TextField } from '@radix-ui/themes'
import type { TextFieldInputProps } from '@radix-ui/themes/dist/cjs/components/text-field'
import React, { forwardRef, useId } from 'react'

import Tooltip from './Tooltip'

interface Props extends TextFieldInputProps {
  label?: string
  info?: string
  prefix?: string
  suffix?: string
  validationError?: string
  showErrorLabel?: boolean
}
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    info,
    validationError,
    showErrorLabel = true,
    prefix,
    suffix,
    ...props
  },
  ref
) {
  const id = useId()
  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex">
          <Text as="div" size="2" mb="1">
            {label}
          </Text>
          {info && (
            <Tooltip content={info} placement="top">
              <span>
                <InfoOutline className="mx-1 my-0.5 h-3 w-3 opacity-70" />
              </span>
            </Tooltip>
          )}
        </div>
      )}
      <div className="flex">
        <TextField.Root className="w-full">
          {prefix && (
            <TextField.Slot>
              <Text size="2">{prefix}</Text>
            </TextField.Slot>
          )}
          <TextField.Input
            id={id}
            ref={ref}
            color={validationError?.length ? 'red' : 'gray'}
            {...props}
          />
          {suffix && (
            <TextField.Slot>
              <Text size="2">{suffix}</Text>
            </TextField.Slot>
          )}
        </TextField.Root>
      </div>
      {validationError && showErrorLabel ? (
        <Text color="red" mt="1" size="1" weight="medium">
          {validationError}
        </Text>
      ) : null}
    </label>
  )
})
