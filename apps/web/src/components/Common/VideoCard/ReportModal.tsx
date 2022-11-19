import ReportPublication from '@components/ReportPublication'
import Modal from '@components/UIElements/Modal'
import type { FC } from 'react'
import React from 'react'
import type { LenstubePublication } from 'src/types'

type Props = {
  video: LenstubePublication
  show: boolean
  setShowReport: React.Dispatch<boolean>
}

const ReportModal: FC<Props> = ({ show, setShowReport, video }) => {
  return (
    <Modal
      title="Report Publication"
      onClose={() => setShowReport(false)}
      show={show}
      panelClassName="max-w-md"
    >
      <div className="mt-2">
        <ReportPublication
          publication={video}
          onSuccess={() => setShowReport(false)}
        />
      </div>
    </Modal>
  )
}

export default ReportModal
