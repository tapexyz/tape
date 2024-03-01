import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const tw = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
