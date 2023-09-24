import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy'
}

const PrivacyLayout = ({ children }: { children: React.ReactNode }) => {
  return <section>{children}</section>
}

export default PrivacyLayout
