import { Flex, Text, TextArea as TextAreaField } from '@radix-ui/themes'
import type { TextAreaProps } from '@radix-ui/themes/dist/cjs/components/text-area'
import React, { forwardRef, useId } from 'react'

interface Props extends TextAreaProps {
  label?: string
  type?: string
  className?: string
  validationError?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea({ label, validationError, ...props }, ref) {
    const id = useId()
    return (
      <label className="w-full" htmlFor={id}>
        {label && (
          <div className="mb-1 flex items-center space-x-1.5">
            <Text as="div" size="2" weight="medium">
              {label}
            </Text>
          </div>
        )}
        <Flex>
          <TextAreaField
            id={id}
            ref={ref}
            className="w-full"
            color={validationError?.length ? 'red' : 'gray'}
            {...props}
          />
        </Flex>
        {validationError && (
          <div className="mx-1 mt-1 text-xs font-medium text-red-500">
            {validationError}
          </div>
        )}
        {validationError ? (
          <Text color="red" mt="1" size="1" weight="medium">
            {validationError}
          </Text>
        ) : null}
      </label>
    )
  }
)
