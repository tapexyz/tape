import ReportPublication from '@components/ReportPublication'
import Modal from '@components/UIElements/Modal'
import React, { FC } from 'react'
import { LenstubePublication } from 'src/types/local'

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
