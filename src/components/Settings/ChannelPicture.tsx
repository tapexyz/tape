import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { BROADCAST_MUTATION } from '@gql/queries'
import { CREATE_SET_PROFILE_IMAGE_URI_VIA_DISPATHCER } from '@gql/queries/dispatcher'
import { SET_PFP_URI_TYPED_DATA } from '@gql/queries/typed-data'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED
} from '@utils/constants'
import { getCroppedImgUrl } from '@utils/functions/canvasUtils'
import { getFileFromDataURL } from '@utils/functions/getFileFromDataURL'
import getProfilePicture from '@utils/functions/getProfilePicture'
import omitKey from '@utils/functions/omitKey'
import { sanitizeIpfsUrl } from '@utils/functions/sanitizeIpfsUrl'
import uploadMediaToIPFS from '@utils/functions/uploadToIPFS'
import clsx from 'clsx'
import { utils } from 'ethers'
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react'
// import { Area, Point } from 'react-easy-crop/types'
import toast from 'react-hot-toast'
import { RiImageAddLine } from 'react-icons/ri'
import {
  CreateSetProfileImageUriBroadcastItemResult,
  Profile,
  UpdateProfileImageRequest
} from 'src/types'
import { IPFSUploadResult } from 'src/types/local'
import { useContractWrite, useSignTypedData } from 'wagmi'
// import CropModal from './CropModal'
// react-image-crop
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop
} from 'react-image-crop'
// test crop modal
import CropModal from './CropModal'
type Props = {
  channel: Profile
}
import 'react-image-crop/dist/ReactCrop.css'

const ChannelPicture: FC<Props> = ({ channel }) => {
  const [selectedPfp, setSelectedPfp] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const userSigNonce = useAppStore((state) => state.userSigNonce)
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  // const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>('')
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })
  const [rotation, setRotation] = useState(0)
  const [croppedPfp, setCroppedPfp] = useState<File | null>(null)

  // react-image-crop
  const [imgSrc, setImgSrc] = useState<string>()
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<{
    x: number
    y: number
    width: number
    height: number
    unit: 'px' | '%'
  }>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(1)

  //save the resulted image
  const [result, setResult] = useState<string | undefined>('')

  // const cropImageHandler = async () => {
  //   const croppedImage2 = await getCroppedImgUrl2(imageSrc, croppedAreaPixels)
  //   setResult(croppedImage2)
  // }
  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
    setSelectedPfp(getProfilePicture(channel, 'avatar_lg'))
  }

  const onCompleted = () => {
    setLoading(false)
    if (selectedChannel && selectedPfp)
      setSelectedChannel({
        ...selectedChannel,
        picture: { original: { url: selectedPfp } }
      })
    toast.success('Channel image updated')
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { data: pfpData, write: writePfpUri } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [createSetProfileImageViaDispatcher] = useMutation(
    CREATE_SET_PROFILE_IMAGE_URI_VIA_DISPATHCER,
    {
      onError,
      onCompleted
    }
  )

  const [broadcast] = useMutation(BROADCAST_MUTATION, {
    onError,
    onCompleted
  })

  const [createSetProfileImageURITypedData] = useMutation(
    SET_PFP_URI_TYPED_DATA,
    {
      async onCompleted(data) {
        const { typedData, id } =
          data.createSetProfileImageURITypedData as CreateSetProfileImageUriBroadcastItemResult
        try {
          const signature = await signTypedDataAsync({
            domain: omitKey(typedData?.domain, '__typename'),
            types: omitKey(typedData?.types, '__typename'),
            value: omitKey(typedData?.value, '__typename')
          })
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          const args = {
            profileId,
            imageURI,
            sig: { v, r, s, deadline: typedData.value.deadline }
          }
          setUserSigNonce(userSigNonce + 1)
          if (!RELAYER_ENABLED) {
            return writePfpUri?.({ recklesslySetUnpreparedArgs: [args] })
          }
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.reason)
            writePfpUri?.({ recklesslySetUnpreparedArgs: [args] })
        } catch (error) {
          setLoading(false)
          logger.error('[Error Set Pfp Typed Data]', error)
        }
      },
      onError
    }
  )

  const signTypedData = (request: UpdateProfileImageRequest) => {
    createSetProfileImageURITypedData({
      variables: { options: { overrideSigNonce: userSigNonce }, request }
    })
  }

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageViaDispatcher({
      variables: { request }
    })
    if (!data?.createSetProfileImageURIViaDispatcher?.txId) {
      signTypedData(request)
    }
  }
  function readFile(file: any) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  const closeModal = () => {
    setShowModal(false)
  }

  // const onCropComplete = useCallback(
  //   (croppedArea: Area, croppedAreaPixels: Area) => {
  //     setCroppedAreaPixels(croppedAreaPixels)
  //   },
  //   []
  // )

  const pfpUpload = async (file: File) => {
    if (file) {
      try {
        setLoading(true)
        const result: IPFSUploadResult = await uploadMediaToIPFS(file)
        const request = {
          profileId: selectedChannel?.id,
          url: result.url
        }
        setSelectedPfp(result.url)
        const canUseDispatcher = selectedChannel?.dispatcher?.canUseRelay
        if (!canUseDispatcher) {
          return signTypedData(request)
        }
        await createViaDispatcher(request)
      } catch (error) {
        onError(error)
        logger.error('[Error Pfp Upload]', error)
      }
    }
  }

  useEffect(() => {
    if (croppedPfp) {
      pfpUpload(croppedPfp)
    }
    // eslint-disable-next-line
  }, [croppedPfp])

  const selectCroppedImage = useCallback(async () => {
    console.log(`completedCrop.height: ${completedCrop?.height}`)
    console.log(`completedCrop.width: ${completedCrop?.width}`)
    console.log(`completedCrop.x: ${completedCrop?.x}`)
    console.log(`completedCrop.y: ${completedCrop?.y}`)
    console.log(`crop.x: ${crop?.x}`)
    console.log(`crop.y: ${crop?.y}`)
    console.log(`crop.height: ${crop?.height}`)
    console.log(`crop.width: ${crop?.width}`)

    // console.log(`previewCanvasRef.current: ${previewCanvasRef.current}
    if (previewCanvasRef) {
      try {
        // const croppedImage: any = await getCroppedImgUrl(
        //   imageSrc,
        //   croppedAreaPixels,
        //   rotation
        // )
        // const croppedImage: any = await getCroppedImgUrl(
        //   imageSrc,
        //   completedCrop
        // )
        // console.log(`croppedImage: ${croppedImage}`)
        // if (crop) {
        //   const croppedImage2: any = await getCroppedImgUrl(imageSrc, crop)
        //   console.log(`croppedImage2: ${croppedImage2}`)
        // }

        // const croppedImageFile = getFileFromDataURL(
        //   croppedImage,
        //   'cropped.jpeg'
        // )
        // console.log(`croppedImageFile: ${croppedImageFile}`)

        // via canvas method
        const canvasRef = previewCanvasRef.current
        const imageData64 = canvasRef?.toDataURL('image/jpeg')
        const myFilename = 'previewFile.jpeg'

        // file to be uploaded
        const myNewCroppedFile = await dataUrlToFile(imageData64!, myFilename)
        console.log(`myNewCroppedFile: ${myNewCroppedFile}`)
        console.log(`imageData64: ${imageData64}`)
        setCroppedPfp(myNewCroppedFile)

        closeModal()
      } catch (e) {
        console.error(e)
      }
    }
  }, [
    // imageSrc, croppedAreaPixels, rotation
    imageSrc,
    completedCrop
  ])
  // export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const dataUrlToFile = async (
    dataUrl: string,
    fileName: string
  ): Promise<File> => {
    const res: Response = await fetch(dataUrl)
    const blob: Blob = await res.blob()
    return new File([blob], fileName, { type: 'image/png' })
  }
  const handleDownloadClick = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    // const { imgSrc } = this.state
    if (imgSrc) {
      // const canvasRef = this.imagePreviewCanvasRef.current
      const canvasRef = previewCanvasRef.current

      // const { imgSrcExt } = this.state
      // const imageData64 = canvasRef?.toDataURL('image/' + imgSrcExt)
      // const myFilename = 'previewFile.' + imgSrcExt
      const imageData64 = canvasRef?.toDataURL('image/jpeg')
      const myFilename = 'previewFile.jpeg'

      // file to be uploaded
      const myNewCroppedFile = await dataUrlToFile(imageData64!, myFilename)
      console.log(`myNewCroppedFile: ${myNewCroppedFile}`)
      console.log(`imageData64: ${imageData64}`)
      // download file
      // downloadBase64File(imageData64, myFilename)
      // this.handleClearToDefault()
    }
  }
  const onPfpSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        const file = e.target.files[0]
        let imageDataUrl: any = await readFile(file)
        setImageSrc(imageDataUrl)
        setShowModal(true)
        setImgSrc(imageDataUrl)
        // react-image-crop
        // const imageUrl = URL.createObjectURL(file)
        // console.log(`imageDataUrl: ${imageDataUrl}`)
        // console.log(`imageUrl: ${imageUrl}`)
        // setSrcImg(imageUrl)
      } catch (error) {
        onError(error)
        logger.error('[Error Pfp Crop]', error)
        setCroppedPfp(null)
      }
    }
  }
  // function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setCrop(undefined) // Makes crop preview update between images.
  //     const reader = new FileReader()
  //     reader.addEventListener('load', () =>
  //       setImgSrc(reader.result?.toString() || '')
  //     )
  //     reader.readAsDataURL(e.target.files[0])
  //     setShowModal(true)
  //   }
  // }
  // const onCropComplete = useCallback(
  //   (croppedArea: PixelCrop, croppedAreaPixels: PixelCrop) => {
  //     setCroppedAreaPixels(croppedAreaPixels)
  //   },
  //   []
  // )

  const cropImageNow = () => {
    if (crop) {
      // convert image string to HTMLImageElement
      const image = new Image()
      image.src = imageSrc
      const canvas = document.createElement('canvas')
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const pixelRatio = window.devicePixelRatio
      canvas.width = crop.width * pixelRatio
      canvas.height = crop.height * pixelRatio
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      // Converting to base64
      const base64Image = canvas.toDataURL('image/jpeg')
      // setOutput(base64Image)
      console.log(base64Image)
    }
  }
  return (
    <div className="relative flex-none overflow-hidden rounded-full group">
      <img
        src={
          selectedPfp
            ? sanitizeIpfsUrl(selectedPfp)
            : getProfilePicture(channel, 'avatar_lg')
        }
        className="object-cover w-32 h-32 border-2 rounded-full"
        draggable={false}
        alt="channel picture"
      />
      <label
        htmlFor="choosePfp"
        className={clsx(
          'absolute top-0 grid w-32 h-32 bg-white rounded-full cursor-pointer bg-opacity-70 place-items-center backdrop-blur-lg invisible group-hover:visible dark:bg-black',
          { '!visible': loading && !pfpData?.hash }
        )}
      >
        {loading && !pfpData?.hash ? (
          <Loader />
        ) : (
          <RiImageAddLine className="text-xl" />
        )}
        <input
          id="choosePfp"
          type="file"
          accept=".png, .jpg, .jpeg, .svg, .gif"
          className="hidden w-full"
          onChange={onPfpSelect}
          // onChange={onSelectFile}
        />
        <CropModal
          show={showModal}
          setShowCrop={setShowModal}
          crop={crop!}
          setCrop={setCrop}
          setCompletedCrop={setCompletedCrop}
          // onCropComplete={onCropComplete}
          aspect={aspect!}
          imgRef={imgRef}
          imgSrc={imgSrc!}
          scale={scale}
          rotate={rotate}
          completedCrop={completedCrop!}
          previewCanvasRef={previewCanvasRef}
          selectCroppedImage={selectCroppedImage}
          cropImageNow={handleDownloadClick}
        />
      </label>

      {/* <button onClick={cropImageHandler}>Crop Image</button> */}
    </div>
  )
}

export default ChannelPicture
