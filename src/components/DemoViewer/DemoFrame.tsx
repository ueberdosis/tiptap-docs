'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Framework, Theme } from './state'
import { cn } from '@/utils'

export type DemoFile = { name: string; content: string }
export type DemoDocument = Record<string, unknown>

export type DemoBridgeEvent =
  | { type: 'ready'; tabs: Framework[]; tab: Framework }
  | { type: 'source'; tab: Framework; files: DemoFile[] }
  | { type: 'document'; tab: Framework; json: DemoDocument; edited: boolean }
  | { type: 'height'; height: number }

export type DemoFrameHandle = {
  /** Replaces the demo's document, without reloading the frame. */
  setContent: (json: DemoDocument) => void
}

export type DemoFrameProps = {
  src: string
  title: string
  theme: Theme
  /** A document to show instead of the demo's own, sent once the demo is ready. */
  initialContent?: DemoDocument | null
  /** Loads at once, also while hidden; a lazy frame that isn't shown never loads. */
  isEager?: boolean
  onBridge?: (event: DemoBridgeEvent) => void
  /** The frame loaded, but no message came from it: the demos app has no bridge. */
  onNoBridge?: () => void
  className?: string
}

/**
 * An iframe with a demo from the demos app. The demos app's preview posts
 * `{ channel: 'tiptap-demo' }` messages (`ready`, `source`, `document`, `height`) and takes
 * `{ channel: 'tiptap-docs' }` messages (`hello`, `theme`, `content`), see tiptap-pro's `demos/preview/Demo.vue`.
 */
// Messages go to the demo's own origin only: `content` carries what the reader typed
const postToFrame = (
  frame: HTMLIFrameElement | null,
  src: string,
  message: Record<string, unknown>,
) => {
  frame?.contentWindow?.postMessage(
    { channel: 'tiptap-docs', ...message },
    new URL(src, window.location.href).origin,
  )
}

export const DemoFrame = forwardRef<DemoFrameHandle, DemoFrameProps>(
  ({ src, title, theme, initialContent, isEager, onBridge, onNoBridge, className }, ref) => {
    const frameRef = useRef<HTMLIFrameElement>(null)
    const [isReady, setIsReady] = useState(false)
    // The document to restore is the one at mount; a new `src` mounts a new frame (it is the key)
    const [restore] = useState(() => initialContent ?? null)
    const callbacks = useRef({ onBridge, onNoBridge })
    const documents = useRef(0)
    const readyRef = useRef(false)

    useEffect(() => {
      callbacks.current = { onBridge, onNoBridge }
    })

    useImperativeHandle(ref, () => ({
      setContent: (json) => send({ type: 'content', json }),
    }))

    const send = (message: Record<string, unknown>) => postToFrame(frameRef.current, src, message)

    useEffect(() => {
      const onMessage = (event: MessageEvent) => {
        const message = event.data

        if (
          event.source !== frameRef.current?.contentWindow ||
          message?.channel !== 'tiptap-demo'
        ) {
          return
        }

        if (message.type === 'ready') {
          // `ready` comes on load and again in reply to `hello`; the document is restored once
          if (!readyRef.current && restore) {
            postToFrame(frameRef.current, src, { type: 'content', json: restore })
          }
          readyRef.current = true
          setIsReady(true)
          callbacks.current.onBridge?.({ type: 'ready', tabs: message.tabs, tab: message.tab })
        }

        if (message.type === 'height' && typeof message.height === 'number') {
          callbacks.current.onBridge?.({ type: 'height', height: message.height })
        }

        if (message.type === 'source') {
          callbacks.current.onBridge?.({ type: 'source', tab: message.tab, files: message.files })
        }

        if (message.type === 'document') {
          // The first document is the demo's own content, unless one was restored
          documents.current += 1
          callbacks.current.onBridge?.({
            type: 'document',
            tab: message.tab,
            json: message.json,
            edited: documents.current > 1 || restore !== null,
          })
        }
      }

      window.addEventListener('message', onMessage)
      return () => window.removeEventListener('message', onMessage)
    }, [restore, src])

    // The frame may have loaded before this page listened (before hydration): say hello, it answers `ready`
    // A late `ready` still counts, so a lazy frame that loads after this wait recovers
    useEffect(() => {
      postToFrame(frameRef.current, src, { type: 'hello' })
      const timeout = window.setTimeout(() => {
        if (!readyRef.current) callbacks.current.onNoBridge?.()
      }, 10000)
      return () => window.clearTimeout(timeout)
    }, [src])

    // The theme changes without a reload, so what the reader typed stays
    useEffect(() => {
      if (isReady) {
        postToFrame(frameRef.current, src, { type: 'theme', theme })
      }
    }, [isReady, src, theme])

    const onLoad = () => {
      window.setTimeout(() => {
        if (!readyRef.current) {
          callbacks.current.onNoBridge?.()
        }
      }, 2500)
    }

    return (
      <iframe
        ref={frameRef}
        src={src}
        title={title}
        loading={isEager ? 'eager' : 'lazy'}
        onLoad={onLoad}
        className={cn('block w-full h-full border-0 bg-transparent', className)}
      />
    )
  },
)

DemoFrame.displayName = 'DemoFrame'
