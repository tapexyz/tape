import CollectOutline from '@components/Common/Icons/CollectOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import { formatNumber, getPublication } from '@dragverse/generic'
import isOpenActionAllowed from '@dragverse/generic/functions/isOpenActionAllowed'
import { type AnyPublication, type OpenActionModule } from '@dragverse/lens'
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
import type { FC, ReactNode } from 'react'

import CollectPublication from './CollectPublication'

type Props = {
  publication: AnyPublication
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'
  text?: string
  children?: ReactNode
}

const OpenActions: FC<Props> = ({
  publication,
  variant = 'solid',
  text,
  children
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
            value="item-1"
            className="rounded-small group border dark:border-gray-700"
          >
            <AccordionTrigger className="bg-brand-50/50 dark:bg-brand-950/30 rounded-small w-full px-4 py-3 text-left">
              <Flex justify="between" align="center">
                <span className="text-brand-500">Collect publication</span>
                <span className="group-data-[state=open]:hidden">
                  $<b> {formatNumber(Number(details?.amount.rate))}</b>
                </span>
              </Flex>
            </AccordionTrigger>
            <AccordionContent className="p-3">
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

  const canAct =
    hasOpenActions && isOpenActionAllowed(targetPublication.openActionModules)

  if (!canAct) {
    return null
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {children ?? (
          <Button variant={variant} highContrast>
            <CollectOutline className="h-4 w-4" />
            {text}
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex gap="3" justify="between" pb="2">
          <Dialog.Title>
            <Flex align="center" gap="2">
              <CollectOutline className="h-5 w-5" /> <span>Collect</span>
            </Flex>
          </Dialog.Title>
          <DialogClose>
            <IconButton variant="ghost" color="gray">
              <TimesOutline outlined={false} className="h-3 w-3" />
            </IconButton>
          </DialogClose>
        </Flex>

        <ScrollArea
          type="hover"
          scrollbars="vertical"
          style={{ maxHeight: 500 }}
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
