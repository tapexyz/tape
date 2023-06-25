import MetaTags from '@components/Common/MetaTags'
import { Button } from '@components/UIElements/Button'
import { Analytics, ERROR_MESSAGE, TRACK } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import { useReportPublicationMutation } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import { t, Trans } from '@lingui/macro'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  publication: Publication
  onSuccess: () => void
}

const ReportPublication: FC<Props> = ({ publication, onSuccess }) => {
  const [reason, setReason] = useState('SPAM-FAKE_ENGAGEMENT')

  const [createReport, { loading: reporting }] = useReportPublicationMutation({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    },
    onCompleted: () => {
      toast.success(t`Publication reported successfully.`)
      onSuccess()
      Analytics.track(TRACK.PUBLICATION.REPORT, {
        publication_id: publication.id,
        publication_type: publication.__typename?.toLowerCase()
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

  const onReport = () => {
    const type = reason.split('-')[0]
    const subReason = reason.split('-')[1]
    createReport({
      variables: {
        request: {
          publicationId: publication.id,
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
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReason(e.target.value)
  }

  return (
    <>
      <MetaTags title={t`Report Publication`} />
      <div className="flex justify-center">
        <div className="w-full">
          <div className="opacity-60">
            <h1>{publication.metadata.name}</h1>
            <span className="text-sm">by {publication.profile.handle}</span>
          </div>
          <div className="mt-4">
            <label
              className="block text-xs font-semibold uppercase opacity-70"
              htmlFor="report"
            >
              <Trans>Reason</Trans>
            </label>
            <div className="mt-1">
              <select
                onChange={(e) => handleChange(e)}
                value={reason}
                name="report"
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-sm outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900"
                id="report"
              >
                <optgroup label="SPAM">
                  <option value="SPAM-FAKE_ENGAGEMENT">
                    <Trans>Fake Engagement</Trans>
                  </option>
                  <option value="SPAM-MANIPULATION_ALGO">
                    <Trans>Algorithm Manipulation</Trans>
                  </option>
                  <option value="SPAM-MISLEADING">
                    <Trans>Misleading</Trans>
                  </option>
                  <option value="SPAM-MISUSE_HASHTAGS">
                    <Trans>Misuse Hashtags</Trans>
                  </option>
                  <option value="SPAM-REPETITIVE">
                    <Trans>Repetitive</Trans>
                  </option>
                  <option value="SPAM-UNRELATED">
                    <Trans>Unrelated</Trans>
                  </option>
                  <option value="SPAM-SOMETHING_ELSE">
                    <Trans>Something Else</Trans>
                  </option>
                </optgroup>
                <optgroup label="ILLEGAL">
                  <option value="ILLEGAL-ANIMAL_ABUSE">
                    <Trans>Animal Abuse</Trans>
                  </option>
                  <option value="ILLEGAL-HUMAN_ABUSE">
                    <Trans>Human Abuse</Trans>
                  </option>
                  <option value="ILLEGAL-DIRECT_THREAT">
                    <Trans>Direct threat</Trans>
                  </option>
                  <option value="ILLEGAL-THREAT_INDIVIDUAL">
                    <Trans>Threat Individual</Trans>
                  </option>
                  <option value="ILLEGAL-VIOLENCE">
                    <Trans>Violence</Trans>
                  </option>
                </optgroup>
                <optgroup label="FRAUD">
                  <option value="FRAUD-SCAM">
                    <Trans>Scam</Trans>
                  </option>
                  <option value="FRAUD-IMPERSONATION">
                    <Trans>Impersonation</Trans>
                  </option>
                </optgroup>
                <optgroup label="SENSITIVE">
                  <option value="SENSITIVE-NSFW">
                    <Trans>NSFW</Trans>
                  </option>
                  <option value="SENSITIVE-OFFENSIVE">
                    <Trans>Offensive</Trans>
                  </option>
                </optgroup>
              </select>
            </div>
            <div className="mb-1 mt-4 flex justify-end">
              <Button loading={reporting} onClick={() => onReport()}>
                <Trans>Report</Trans>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportPublication
