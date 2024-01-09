import MetaTags from '@components/Common/MetaTags'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import {
  EVENTS,
  getProfile,
  getPublication,
  getPublicationData,
  Tower
} from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import { useReportPublicationMutation } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button, Select, SelectItem } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  publication: AnyPublication
  close?: () => void
}

const ReportPublication: FC<Props> = ({ publication, close }) => {
  const targetPublication = getPublication(publication)
  const [reason, setReason] = useState('SPAM-FAKE_ENGAGEMENT')

  const [createReport, { loading: reporting }] = useReportPublicationMutation({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    },
    onCompleted: () => {
      toast.success(`Publication reported.`)
      Tower.track(EVENTS.PUBLICATION.REPORT, {
        publication_id: targetPublication.id,
        publication_type: targetPublication.__typename?.toLowerCase()
      })
    }
  })

  const getReasonType = (type: string) => {
    if (type === 'ILLEGAL') {
      return 'illegalReason'
    }
    if (type === 'FRAUD') {
      return 'fraudReason'
    }
    if (type === 'SENSITIVE') {
      return 'sensitiveReason'
    }
    if (type === 'SPAM') {
      return 'spamReason'
    }
    return 'illegalReason'
  }

  const onReport = async () => {
    const type = reason.split('-')[0]
    const subReason = reason.split('-')[1]
    await createReport({
      variables: {
        request: {
          for: targetPublication.id,
          reason: {
            [getReasonType(type)]: {
              reason: type,
              subreason: subReason
            }
          },
          additionalComments: `${type} - ${subReason}`
        }
      }
    })
    close?.()
  }

  return (
    <>
      <MetaTags title={`Report Publication`} />
      <div className="flex justify-center">
        <div className="w-full">
          <h1>{getPublicationData(targetPublication.metadata)?.title}</h1>
          <h6>by {getProfile(targetPublication.by)?.slugWithPrefix}</h6>
          <div className="mt-4 flex flex-col space-y-4">
            <Select onValueChange={(value) => setReason(value)} value={reason}>
              <SelectItem value="SPAM-FAKE_ENGAGEMENT">
                Fake Engagement
              </SelectItem>
              <SelectItem value="SPAM-MANIPULATION_ALGO">
                Algorithm Manipulation
              </SelectItem>
              <SelectItem value="SPAM-MISLEADING">Misleading</SelectItem>
              <SelectItem value="SPAM-MISUSE_HASHTAGS">
                Misuse Hashtags
              </SelectItem>
              <SelectItem value="SPAM-REPETITIVE">Repetitive</SelectItem>
              <SelectItem value="SPAM-UNRELATED">Unrelated</SelectItem>
              <SelectItem value="SPAM-SOMETHING_ELSE">
                Something Else
              </SelectItem>
              <SelectItem value="ILLEGAL-ANIMAL_ABUSE">Animal Abuse</SelectItem>
              <SelectItem value="ILLEGAL-HUMAN_ABUSE">Human Abuse</SelectItem>
              <SelectItem value="ILLEGAL-DIRECT_THREAT">
                Direct threat
              </SelectItem>
              <SelectItem value="ILLEGAL-THREAT_INDIVIDUAL">
                Threat Individual
              </SelectItem>
              <SelectItem value="ILLEGAL-VIOLENCE">Violence</SelectItem>
              <SelectItem value="FRAUD-SCAM">Scam</SelectItem>
              <SelectItem value="FRAUD-IMPERSONATION">Impersonation</SelectItem>
              <SelectItem value="SENSITIVE-NSFW">NSFW</SelectItem>
              <SelectItem value="SENSITIVE-OFFENSIVE">Offensive</SelectItem>
            </Select>
            <div className="flex items-center justify-end space-x-2">
              <Button onClick={() => close?.()} variant="secondary">
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={reporting}
                disabled={reporting}
                onClick={() => onReport()}
              >
                Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportPublication
