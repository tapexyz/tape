import MetaTags from '@components/Common/MetaTags'
import { Analytics, TRACK } from '@lenstube/browser'
import { ERROR_MESSAGE } from '@lenstube/constants'
import { getPublication } from '@lenstube/generic'
import type { AnyPublication } from '@lenstube/lens'
import { useReportPublicationMutation } from '@lenstube/lens'
import type { CustomErrorWithData } from '@lenstube/lens/custom-types'
import { t, Trans } from '@lingui/macro'
import { Button, Dialog, Flex, Select, Text } from '@radix-ui/themes'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  publication: AnyPublication
}

const ReportPublication: FC<Props> = ({ publication }) => {
  const targetPublication = getPublication(publication)
  const [reason, setReason] = useState('SPAM-FAKE_ENGAGEMENT')

  const [createReport, { loading: reporting }] = useReportPublicationMutation({
    onError: (error: CustomErrorWithData) => {
      toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    },
    onCompleted: () => {
      toast.success(t`Publication reported.`)
      Analytics.track(TRACK.PUBLICATION.REPORT, {
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

  const onReport = () => {
    const type = reason.split('-')[0]
    const subReason = reason.split('-')[1]
    createReport({
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
  }

  return (
    <>
      <MetaTags title={t`Report Publication`} />
      <div className="flex justify-center">
        <div className="w-full">
          <div className="opacity-60">
            <h1>{targetPublication.metadata.marketplace?.name}</h1>
            <span className="text-sm">by {targetPublication.by.handle}</span>
          </div>
          <div className="mt-4 flex flex-col space-y-4">
            <Flex direction="column">
              <Text weight="medium">
                <Trans>Reason</Trans>
              </Text>
              <Select.Root
                onValueChange={(value) => setReason(value)}
                value={reason}
              >
                <Select.Trigger placeholder="Select a reason" />
                <Select.Content variant="soft">
                  <Select.Group>
                    <Select.Label>Spam</Select.Label>
                    <Select.Item value="SPAM-FAKE_ENGAGEMENT">
                      <Trans>Fake Engagement</Trans>
                    </Select.Item>
                    <Select.Item value="SPAM-MANIPULATION_ALGO">
                      <Trans>Algorithm Manipulation</Trans>
                    </Select.Item>
                    <Select.Item value="SPAM-MISLEADING">
                      <Trans>Misleading</Trans>
                    </Select.Item>
                    <Select.Item value="SPAM-MISUSE_HASHTAGS">
                      <Trans>Misuse Hashtags</Trans>
                    </Select.Item>
                    <Select.Item value="SPAM-REPETITIVE">
                      <Trans>Repetitive</Trans>
                    </Select.Item>
                    <Select.Item value="SPAM-UNRELATED">
                      <Trans>Unrelated</Trans>
                    </Select.Item>
                    <Select.Item value="SPAM-SOMETHING_ELSE">
                      <Trans>Something Else</Trans>
                    </Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.Label>Illegal</Select.Label>
                    <Select.Item value="ILLEGAL-ANIMAL_ABUSE">
                      <Trans>Animal Abuse</Trans>
                    </Select.Item>
                    <Select.Item value="ILLEGAL-HUMAN_ABUSE">
                      <Trans>Human Abuse</Trans>
                    </Select.Item>
                    <Select.Item value="ILLEGAL-DIRECT_THREAT">
                      <Trans>Direct threat</Trans>
                    </Select.Item>
                    <Select.Item value="ILLEGAL-THREAT_INDIVIDUAL">
                      <Trans>Threat Individual</Trans>
                    </Select.Item>
                    <Select.Item value="ILLEGAL-VIOLENCE">
                      <Trans>Violence</Trans>
                    </Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.Label>Fraud</Select.Label>
                    <Select.Item value="FRAUD-SCAM">
                      <Trans>Scam</Trans>
                    </Select.Item>
                    <Select.Item value="FRAUD-IMPERSONATION">
                      <Trans>Impersonation</Trans>
                    </Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.Label>Sensitive</Select.Label>
                    <Select.Item value="SENSITIVE-NSFW">
                      <Trans>NSFW</Trans>
                    </Select.Item>
                    <Select.Item value="SENSITIVE-OFFENSIVE">
                      <Trans>Offensive</Trans>
                    </Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Flex>
            <Flex mt="4" gap="2" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button
                  color="red"
                  disabled={reporting}
                  onClick={() => onReport()}
                >
                  <Trans>Report</Trans>
                </Button>
              </Dialog.Close>
            </Flex>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportPublication
