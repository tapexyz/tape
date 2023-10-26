import MetaTags from '@components/Common/MetaTags'
import { Button, Dialog, Flex, Select, Text } from '@radix-ui/themes'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { EVENTS, getPublication, Tower } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import { useReportPublicationMutation } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
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
      <MetaTags title={`Report Publication`} />
      <div className="flex justify-center">
        <div className="w-full">
          <h1>{targetPublication.metadata.marketplace?.name}</h1>
          <div className="mt-4 flex flex-col space-y-4">
            <Flex direction="column">
              <Text weight="medium">Reason</Text>
              <Select.Root
                onValueChange={(value) => setReason(value)}
                value={reason}
              >
                <Select.Trigger placeholder="Select a reason" />
                <Select.Content variant="soft">
                  <Select.Group>
                    <Select.Label>Spam</Select.Label>
                    <Select.Item value="SPAM-FAKE_ENGAGEMENT">
                      Fake Engagement
                    </Select.Item>
                    <Select.Item value="SPAM-MANIPULATION_ALGO">
                      Algorithm Manipulation
                    </Select.Item>
                    <Select.Item value="SPAM-MISLEADING">
                      Misleading
                    </Select.Item>
                    <Select.Item value="SPAM-MISUSE_HASHTAGS">
                      Misuse Hashtags
                    </Select.Item>
                    <Select.Item value="SPAM-REPETITIVE">
                      Repetitive
                    </Select.Item>
                    <Select.Item value="SPAM-UNRELATED">Unrelated</Select.Item>
                    <Select.Item value="SPAM-SOMETHING_ELSE">
                      Something Else
                    </Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.Label>Illegal</Select.Label>
                    <Select.Item value="ILLEGAL-ANIMAL_ABUSE">
                      Animal Abuse
                    </Select.Item>
                    <Select.Item value="ILLEGAL-HUMAN_ABUSE">
                      Human Abuse
                    </Select.Item>
                    <Select.Item value="ILLEGAL-DIRECT_THREAT">
                      Direct threat
                    </Select.Item>
                    <Select.Item value="ILLEGAL-THREAT_INDIVIDUAL">
                      Threat Individual
                    </Select.Item>
                    <Select.Item value="ILLEGAL-VIOLENCE">Violence</Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.Label>Fraud</Select.Label>
                    <Select.Item value="FRAUD-SCAM">Scam</Select.Item>
                    <Select.Item value="FRAUD-IMPERSONATION">
                      Impersonation
                    </Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.Label>Sensitive</Select.Label>
                    <Select.Item value="SENSITIVE-NSFW">NSFW</Select.Item>
                    <Select.Item value="SENSITIVE-OFFENSIVE">
                      Offensive
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
                  Report
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
