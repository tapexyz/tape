import { useMutation } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import { Button } from '@components/UIElements/Button'
import { CREATE_REPORT_PUBLICATION_MUTATION } from '@utils/gql/queries'
import { HOME } from '@utils/url-path'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { RiSpamLine } from 'react-icons/ri'

const ReportPublication = () => {
  const {
    query: { id },
    push
  } = useRouter()
  const [reason, setReason] = useState('ILLEGAL-ANIMAL_ABUSE')
  const [createReport, { data, loading: reporting, error }] = useMutation(
    CREATE_REPORT_PUBLICATION_MUTATION
  )

  useEffect(() => {
    if (data) {
      toast.success('Publication reported successfully.')
      push(HOME)
    }
    if (error?.message) toast.error(error.message)
  }, [error, data, push])

  const getReasonType = (type: string) => {
    if (type === 'ILLEGAL') return 'illegalReason'
    if (type === 'FRAUD') return 'fraudReason'
    if (type === 'SENSITIVE') return 'sensitiveReason'
    return 'illegalReason'
  }

  const onReport = () => {
    const type = reason.split('-')[0]
    const subReason = reason.split('-')[1]
    createReport({
      variables: {
        request: {
          publicationId: id,
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
      <MetaTags title="Report Publication" />
      <div className="flex justify-center">
        <div className="w-full p-3 bg-white rounded-md lg:w-1/2 dark:bg-black">
          <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
            <RiSpamLine />
            <span>Report</span>
          </h1>
          <div className="mt-4">
            <label
              className="block text-xs font-semibold uppercase required opacity-70"
              htmlFor="report"
            >
              Reason
            </label>
            <div className="mt-3">
              <select
                onChange={(e) => handleChange(e)}
                value={reason}
                name="report"
                className={clsx(
                  'bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full'
                )}
                id="report"
              >
                <optgroup label="ILLEGAL">
                  <option value="ILLEGAL-ANIMAL_ABUSE">Animal Abuse</option>
                  <option value="ILLEGAL-HUMAN_ABUSE">Human Abuse</option>
                </optgroup>
                <optgroup label="FRAUD">
                  <option value="FRAUD-SCAM">Scam</option>
                  <option value="FRAUD-IMPERSONATION">Impersonation</option>
                </optgroup>
                <optgroup label="SENSITIVE">
                  <option value="SENSITIVE-NSFW">NSFW</option>
                  <option value="SENSITIVE-OFFENSIVE">Offensive</option>
                </optgroup>
              </select>
            </div>
            <div className="flex justify-end mt-4 mb-1">
              <Button disabled={reporting} onClick={() => onReport()}>
                {reporting ? 'Reporting' : 'Report'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReportPublication
