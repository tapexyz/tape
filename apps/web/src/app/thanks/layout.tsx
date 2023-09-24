import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thanks'
}

const ThanksLayout = ({ children }: { children: React.ReactNode }) => {
  return <section>{children}</section>
}

export default ThanksLayout
