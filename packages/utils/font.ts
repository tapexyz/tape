import { Rubik } from 'next/font/google'

const bloomer = Rubik({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  fallback: ['system-ui', 'sans-serif']
})

export default bloomer
