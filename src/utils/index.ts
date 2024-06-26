import clsx from 'clsx'
import { twMerge } from 'tw-merge'

export const cn = (...classes: (string | undefined)[]) => {
  return twMerge(clsx(...classes))
}

export const getRepoBase = () => {
  return `${process.env.NEXT_PUBLIC_REPO}/blob/main${process.env.NEXT_PUBLIC_REPO_BASE}`
}
