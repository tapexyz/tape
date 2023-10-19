import CollectOutline from '@components/Common/Icons/CollectOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@radix-ui/react-accordion'
import {
  Box,
  Button,
  Dialog,
  DialogClose,
  Flex,
  IconButton,
  ScrollArea
} from '@radix-ui/themes'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication, OpenActionModule } from '@tape.xyz/lens'
import type { FC } from 'react'
import React from 'react'

import CollectPublication from './CollectPublication'

type Props = {
  publication: AnyPublication
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'
  text?: string
}

const OpenActions: FC<Props> = ({ publication, variant = 'solid', text }) => {
  const targetPublication = getPublication(publication)
  const openActions = targetPublication.openActionModules

  const renderAction = (action: OpenActionModule) => {
    switch (action.__typename) {
      case 'SimpleCollectOpenActionSettings':
      case 'MultirecipientFeeCollectOpenActionSettings':
        return (
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full text-left">
              <span className="text-brand-500 font-bold">
                Collect publication
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <CollectPublication
                publication={targetPublication}
                action={action}
              />
            </AccordionContent>
          </AccordionItem>
        )
      default:
        break
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant={variant} highContrast>
          <CollectOutline className="h-4 w-4" />
          {text}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Flex gap="3" justify="between" pb="2">
          <Dialog.Title>
            <Flex align="center" gap="2">
              <CollectOutline className="h-4 w-4" /> <span>Act</span>
            </Flex>
          </Dialog.Title>
          <DialogClose>
            <IconButton variant="ghost" color="gray">
              <TimesOutline outlined={false} className="h-4 w-4" />
            </IconButton>
          </DialogClose>
        </Flex>

        <ScrollArea
          type="hover"
          scrollbars="vertical"
          style={{ maxHeight: 400 }}
        >
          <Accordion
            type="single"
            className="w-full space-y-2"
            defaultValue="item-1"
            collapsible
          >
            {openActions?.map((action, i) => {
              return <Box key={i}>{renderAction(action)}</Box>
            })}
          </Accordion>
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default OpenActions
