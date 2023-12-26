import type { TextFieldInputProps } from '@radix-ui/themes/dist/cjs/components/text-field'

import InfoOutline from '@components/Common/Icons/InfoOutline'
import { Text, TextField } from '@radix-ui/themes'
import React, { forwardRef, useId } from 'react'

import Tooltip from './Tooltip'

interface Props extends TextFieldInputProps {
  info?: string
  label?: string
  prefix?: string
  showErrorLabel?: boolean
  suffix?: string
  validationError?: string
}
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    info,
    label,
    prefix,
    showErrorLabel = true,
    suffix,
    validationError,
    ...props
  },
  ref
) {
  const id = useId()
  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="mb-1 flex items-center">
          <Text as="div" size="2" weight="medium">
            {label}
          </Text>
          {info && (
            <Tooltip content={info} placement="top">
              <span>
                <InfoOutline className="mx-1 size-3 opacity-70" />
              </span>
            </Tooltip>
          )}
        </div>
      )}
      <div className="flex">
        <TextField.Root className="w-full">
          {prefix && (
            <TextField.Slot>
              <Text size="2" weight="medium">
                {prefix}
              </Text>
            </TextField.Slot>
          )}
          <TextField.Input
            color={validationError?.length ? 'red' : 'gray'}
            id={id}
            ref={ref}
            {...props}
          />
          {suffix && (
            <TextField.Slot>
              <Text size="2" weight="medium">
                {suffix}
              </Text>
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
