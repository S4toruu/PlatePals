import { Quicksand, Rubik, Montserrat } from 'next/font/google'

export const quicksand = Quicksand({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-quicksand',
})
export const rubik = Rubik({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-rubik',
})
export const montserrat = Montserrat({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-montserrat',
})
