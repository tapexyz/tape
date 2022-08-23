import MetaTags from '@components/Common/MetaTags'
import { Mixpanel, TRACK } from '@utils/track'
import React, { useEffect } from 'react'

const Privacy = () => {
  useEffect(() => {
    Mixpanel.track(TRACK.PAGE_VIEW.PRIVACY)
  }, [])

  return (
    <div className="space-y-5 md:py-10">
      <MetaTags title="Privacy Policy" />
      <h1 className="text-2xl font-semibold md:text-3xl">Privacy Policy</h1>
      <span>Last updated - Jun 26, 2022</span>
      <p>
        At Lenstube, accessible from{' '}
        <a
          href="https://lenstube.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500"
        >
          https://lenstube.xyz
        </a>
        , one of our main priorities is the privacy of our visitors. This
        Privacy Policy document contains types of information that is collected
        and recorded by Lenstube and how we use it.
      </p>
      <p>
        If you have additional questions or require more information about our
        Privacy Policy, do not hesitate to contact us.
      </p>

      <h2 className="text-xl font-semibold">Information we collect</h2>
      <ul className="list-disc list-inside">
        <li>
          When you register for an account, we only ask for username and
          ethereum address.
        </li>
        <li>
          Usage information, such as information about how you interact with us,
          and it is anonymous;
        </li>
      </ul>

      <h2 className="text-xl font-semibold">How we use your information</h2>
      <ul className="list-disc list-inside">
        <li>Improve, personalize, and expand our website</li>
        <li>Understand and analyze how you use our website</li>
        <li>Resolve disputes and troubleshoot problems</li>
      </ul>

      <h2 className="text-xl font-semibold">How we update our policy</h2>
      <div>
        <p>
          We will notify you of material changes to this policy by updating the
          last updated date at the top of this page.
        </p>
        <p>
          Your continued use of our Services confirms your acceptance of our
          Privacy Policy, as amended. We recommend that you visit this page
          frequently to check for changes.
        </p>
      </div>

      <p>
        IF YOU DO NOT AGREE TO THIS PRIVACY POLICY YOU MAY NOT ACCESS OR
        OTHERWISE USE THE SERVICE.
      </p>
    </div>
  )
}

export default Privacy
