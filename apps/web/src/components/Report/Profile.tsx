import MetaTags from '@components/Common/MetaTags'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useReportProfileMutation } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Button, Select, SelectItem } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  profile: Profile
  close?: () => void
}

const ReportProfile: FC<Props> = ({ profile, close }) => {
  const [reason, setReason] = useState('SPAM-REPETITIVE')

  const [createReport, { loading: reporting }] = useReportProfileMutation({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    },
    onCompleted: () => {
      toast.success(`Profile reported.`)
      Tower.track(EVENTS.PROFILE.REPORT, {
        profile_id: profile.id
      })
    }
  })

  const getReasonType = (type: string) => {
    if (type === 'FRAUD') {
      return 'fraudReason'
    }
    if (type === 'SPAM') {
      return 'spamReason'
    }
    return 'spamReason'
  }

  const onReport = async () => {
    const type = reason.split('-')[0]
    const subReason = reason.split('-')[1]
    await createReport({
      variables: {
        request: {
          for: profile.id,
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
      <MetaTags title="Report Publication" />
      <div className="w-full">
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex flex-col">
            <Select onValueChange={(value) => setReason(value)} value={reason}>
              <SelectItem value="SPAM-REPETITIVE">Repetitive</SelectItem>
              <SelectItem value="FRAUD-IMPERSONATION">Impersonation</SelectItem>
              <SelectItem value="SPAM-SOMETHING_ELSE">
                Something Else
              </SelectItem>
            </Select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={reporting}
              loading={reporting}
              onClick={() => onReport()}
            >
              Report
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportProfile
