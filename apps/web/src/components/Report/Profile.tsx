import MetaTags from '@components/Common/MetaTags'
import { Button, Dialog, Flex, Select, Text } from '@radix-ui/themes'
import { ERROR_MESSAGE } from '@tape.xyz/constants'
import { EVENTS, getProfile, Tower } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { useReportProfileMutation } from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  profile: Profile
}

const ReportProfile: FC<Props> = ({ profile }) => {
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
  }

  return (
    <>
      <MetaTags title={`Report Publication`} />
      <div className="flex justify-center">
        <div className="w-full">
          <h1>{getProfile(profile)?.slugWithPrefix}</h1>
          <div className="mt-4 flex flex-col space-y-4">
            <Flex direction="column">
              <Text weight="medium">Reason</Text>
              <Select.Root
                onValueChange={(value) => setReason(value)}
                value={reason}
              >
                <Select.Trigger />
                <Select.Content variant="soft">
                  <Select.Group>
                    <Select.Label>Spam</Select.Label>
                    <Select.Item value="SPAM-REPETITIVE">
                      Repetitive
                    </Select.Item>
                    <Select.Item value="SPAM-SOMETHING_ELSE">
                      Something Else
                    </Select.Item>
                  </Select.Group>
                  <Select.Group>
                    <Select.Label>Fraud</Select.Label>
                    <Select.Item value="FRAUD-IMPERSONATION">
                      Impersonation
                    </Select.Item>
                    <Select.Item value="FRAUD-SOMETHING_ELSE">
                      Something Else
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

export default ReportProfile
