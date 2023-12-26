import type { FC, ReactNode } from 'react'

import CollectOutline from '@components/Common/Icons/CollectOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import { getCollectModuleOutput } from '@lib/getCollectModuleOutput'
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
import { formatNumber, getPublication } from '@tape.xyz/generic'
import isOpenActionAllowed from '@tape.xyz/generic/functions/isOpenActionAllowed'
import { type AnyPublication, type OpenActionModule } from '@tape.xyz/lens'
import React from 'react'

import CollectPublication from './CollectPublication'

type Props = {
  children?: ReactNode
  publication: AnyPublication
  text?: string
  variant?: 'classic' | 'ghost' | 'outline' | 'soft' | 'solid' | 'surface'
}

const OpenActions: FC<Props> = ({
  children,
  publication,
  text,
  variant = 'solid'
}) => {
  const targetPublication = getPublication(publication)
  const openActions = targetPublication.openActionModules
  const hasOpenActions = (targetPublication.openActionModules?.length || 0) > 0

  const renderAction = (action: OpenActionModule) => {
    switch (action.__typename) {
      case 'SimpleCollectOpenActionSettings':
      case 'MultirecipientFeeCollectOpenActionSettings':
      case 'LegacySimpleCollectModuleSettings':
      case 'LegacyMultirecipientFeeCollectModuleSettings':
        const details = getCollectModuleOutput(action)
        return (
          <AccordionItem
            className="rounded-small group border dark:border-gray-700"
            value="item-1"
          >
            <AccordionTrigger className="bg-brand-50/50 dark:bg-brand-950/30 rounded-small w-full px-4 py-3 text-left">
              <Flex align="center" justify="between">
                <span className="text-brand-500">Collect publication</span>
                <span className="group-data-[state=open]:hidden">
                  $<b> {formatNumber(Number(details?.amount.rate))}</b>
                </span>
              </Flex>
            </AccordionTrigger>
            <AccordionContent className="p-3">
              <CollectPublication
                action={action}
                publication={targetPublication}
              />
            </AccordionContent>
          </AccordionItem>
        )
      default:
        break
    }
  }

  const canAct =
    hasOpenActions && isOpenActionAllowed(targetPublication.openActionModules)

  if (!canAct) {
    return null
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {children ?? (
          <Button highContrast variant={variant}>
            <CollectOutline className="size-4" />
            {text}
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex gap="3" justify="between" pb="2">
          <Dialog.Title>
            <Flex align="center" gap="2">
              <CollectOutline className="size-5" /> <span>Collect</span>
            </Flex>
          </Dialog.Title>
          <DialogClose>
            <IconButton color="gray" variant="ghost">
              <TimesOutline className="size-3" outlined={false} />
            </IconButton>
          </DialogClose>
        </Flex>

        <ScrollArea
          scrollbars="vertical"
          style={{ maxHeight: 500 }}
          type="hover"
        >
          <Accordion
            className="w-full space-y-2"
            collapsible
            defaultValue="item-1"
            type="single"
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
