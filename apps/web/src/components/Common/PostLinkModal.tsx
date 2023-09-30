import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import { TextArea } from '@components/UIElements/TextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  getCrossChainNftMetadata,
  getURLs,
  trimify,
  useZoraNft
} from '@lenstube/generic'
import type { BasicNftMetadata } from '@lenstube/lens/custom-types'
import { t } from '@lingui/macro'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { object, string } from 'zod'

type Props = {
  show: boolean
  setShow: React.Dispatch<boolean>
}

const formSchema = object({
  link: string().url({ message: 'Invalid URL' })
})
type FormData = z.infer<typeof formSchema>

const defaults: BasicNftMetadata = {
  chain: '',
  address: '',
  provider: 'zora',
  token: ''
}

const PostLinkModal: FC<Props> = ({ show, setShow }) => {
  const [basicNftMetadata, setBasicNftMetadata] =
    useState<BasicNftMetadata>(defaults)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const { data } = useZoraNft({
    chain: basicNftMetadata?.chain,
    token: basicNftMetadata?.token,
    address: basicNftMetadata?.address,
    enabled: Boolean(basicNftMetadata?.address)
  })

  const value = watch('link')

  useEffect(() => {
    if (trimify(value)?.length) {
      const urls = getURLs(value)
      const nftMetadata = getCrossChainNftMetadata(urls)
      if (nftMetadata) {
        clearErrors()
        return setBasicNftMetadata(nftMetadata)
      }
      if (!nftMetadata) {
        setError('link', { message: 'Unsupported URL' })
      }
      setBasicNftMetadata(defaults)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onSubmit = () => {}

  return (
    <div>
      <Modal
        title={t`Share a Collect`}
        description={t`Supported now - Zora`}
        onClose={() => setShow(false)}
        show={show}
        panelClassName="max-w-lg"
      >
        <div className="no-scrollbar max-h-[40vh] overflow-y-auto p-0.5">
          <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              label="Absolute URL"
              placeholder="https://..."
              {...register('link')}
              validationError={errors.link?.message}
            />
            {data && (
              <div className="mt-4 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <h6 className="text-xl font-bold">{data.name}</h6>
                <p className="line-clamp-2">{data.description}</p>
              </div>
            )}
            <div className="mt-4 flex items-center justify-end">
              <Button disabled={!isValid || !data}>Post Link</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default PostLinkModal
