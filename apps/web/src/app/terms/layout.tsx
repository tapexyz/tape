import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions'
}

const TermsLayout = ({ children }: { children: React.ReactNode }) => {
  return <section>{children}</section>
}

export default TermsLayout
