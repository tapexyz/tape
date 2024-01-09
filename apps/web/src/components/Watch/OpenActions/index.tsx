import { getCollectModuleOutput } from '@lib/getCollectModuleOutput'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@radix-ui/react-accordion'
import { ScrollArea } from '@radix-ui/themes'
import { formatNumber, getPublication } from '@tape.xyz/generic'
import isOpenActionAllowed from '@tape.xyz/generic/functions/isOpenActionAllowed'
import { type AnyPublication, type OpenActionModule } from '@tape.xyz/lens'
import { Button, CollectOutline, Modal } from '@tape.xyz/ui'
import type { FC, ReactNode } from 'react'
import React, { useState } from 'react'

import CollectPublication from './CollectPublication'

type Props = {
  publication: AnyPublication
  text?: string
  children?: ReactNode
}

const OpenActions: FC<Props> = ({ publication, text, children }) => {
  const [showActionModal, setShowActionModal] = useState(false)
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
              <div className="flex items-center justify-center">
                <span className="text-brand-500">Collect publication</span>
                <span className="group-data-[state=open]:hidden">
                  $<b> {formatNumber(Number(details?.amount.rate))}</b>
                </span>
              </div>
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
    <>
      {children ?? (
        <Button
          onClick={() => setShowActionModal(true)}
          icon={<CollectOutline className="size-4" />}
        >
          {text}
        </Button>
      )}
      <Modal
        title="Collect"
        show={showActionModal}
        setShow={setShowActionModal}
      >
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
              return <div key={i}>{renderAction(action)}</div>
            })}
          </Accordion>
        </ScrollArea>
      </Modal>
    </>
  )
}

export default OpenActions
