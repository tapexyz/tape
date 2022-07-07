import { LENSTUBE_URL } from '@utils/constants'
import useCopyToClipboard from '@utils/hooks/useCopyToClipboard'
import useOutsideClick from '@utils/hooks/useOutsideClick'
import { useRouter } from 'next/router'
import { APITypes, PlyrInstance } from 'plyr-react'
import { forwardRef, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineLink } from 'react-icons/ai'
import { BiCheck } from 'react-icons/bi'
import { MdOutlineLoop } from 'react-icons/md'

type Props = {
  position: { x: number; y: number }
  hideContextMenu: () => void
}

const PlayerContextMenu = forwardRef<APITypes, Props>(
  ({ position, hideContextMenu }, ref) => {
    const [loop, setIsLoop] = useState(false)
    const { asPath } = useRouter()
    const [, copy] = useCopyToClipboard()
    const contextMenuRef = useRef(null)
    useOutsideClick(contextMenuRef, () => hideContextMenu())

    const toggleLoop = () => {
      const { current } = ref as React.MutableRefObject<APITypes>
      if (current.plyr.source === null) return
      const api = current as { plyr: PlyrInstance }
      api.plyr.loop = !api.plyr.loop
      setIsLoop(api.plyr.loop)
    }

    const onCopyVideoUrl = () => {
      copy(`${LENSTUBE_URL}${asPath}`)
      toast.success('Video link copied')
    }

    const onCopyAtCurrentTime = () => {
      const { current } = ref as React.MutableRefObject<APITypes>
      if (current.plyr?.source === null) return
      const plyrApi = current as { plyr: PlyrInstance }
      const selectedTime = plyrApi.plyr.currentTime.toFixed(2).toString()
      copy(`${LENSTUBE_URL}${asPath}?t=${selectedTime}`)
      toast.success(`Video link copied`)
    }

    return (
      <div
        className="fixed p-2 text-sm text-white bg-gray-900 bg-opacity-90 rounded-xl"
        style={{ top: position.y, left: position.x }}
        ref={contextMenuRef}
      >
        <div
          className="px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-xl"
          onClick={toggleLoop}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MdOutlineLoop />
              <p>Loop</p>
            </div>
            {loop && <BiCheck className="text-lg" />}
          </div>
        </div>
        <div
          className="px-3 py-2 cursor-pointer rounded-xl hover:bg-gray-700"
          onClick={onCopyVideoUrl}
        >
          <div className="flex items-center space-x-2">
            <AiOutlineLink />
            <p>Copy video URL</p>
          </div>
        </div>
        <div
          className="px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-xl"
          onClick={onCopyAtCurrentTime}
        >
          <div className="flex items-center space-x-2">
            <AiOutlineLink />
            <p>Copy video URL at current time</p>
          </div>
        </div>
      </div>
    )
  }
)

PlayerContextMenu.displayName = 'PlayerContextMenu'

export default PlayerContextMenu
