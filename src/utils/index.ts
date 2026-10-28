import clsx from 'clsx'
import { twMerge } from 'tw-merge'

export const cn = (...classes: (string | undefined)[]) => {
  return twMerge(clsx(...classes))
}

export const getRepoBase = () => {
  const repo = process.env.NEXT_PUBLIC_REPO || 'ueberdosis/tiptap-docs'
  const base = process.env.NEXT_PUBLIC_REPO_BASE || '/src'
  return `${repo}/blob/main${base.replace(/\/$/, '')}`
}
