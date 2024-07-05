import NextLink, { LinkProps } from 'next/link'
import React, { HTMLProps, FC } from 'react'

export const Link: FC<LinkProps & HTMLProps<HTMLAnchorElement>> = ({
  prefetch = false,
  ...rest
}) => {
  return <NextLink {...rest} prefetch={prefetch} />
}

export default Link
