import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import IExecEmailNotificationManager from './IExecEmailNotificationManager'
import IExecEmailNotificationSettings from './IExecEmailNotificationSettings'

const EmailNotification = () => {
  return (
    <>
      <div className="space-y-4">
        <MetaTags title="emailnotification" />
      </div>
      <IExecEmailNotificationSettings />
      <IExecEmailNotificationManager />
    </>
  )
}

export default EmailNotification
