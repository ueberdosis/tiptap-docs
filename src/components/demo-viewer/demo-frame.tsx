'use client';

import { type Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Framework, Theme } from './state';

export type DemoFile = { name: string; content: string };
export type DemoDocument = Record<string, unknown>;

export type DemoBridgeEvent =
  | { type: 'ready'; tabs: Framework[]; tab: Framework }
  | { type: 'source'; tab: Framework; files: DemoFile[] }
  | { type: 'document'; tab: Framework; json: DemoDocument; edited: boolean }
  | { type: 'height'; height: number };

export type DemoFrameHandle = {
  /** Replaces the demo's document, without reloading the frame. */
  setContent: (json: DemoDocument) => void;
};

export type DemoFrameProps = {
  ref?: Ref<DemoFrameHandle>;
  src: string;
  title: string;
  theme: Theme;
  /** A document to show instead of the demo's own, sent once the demo is ready. */
  initialContent?: DemoDocument | null;
  /** Loads at once, also while hidden. A lazy frame that is not shown never loads. */
  isEager?: boolean;
  onBridge?: (event: DemoBridgeEvent) => void;
  /** The frame loaded, but no message came from it: the demo page has no bridge. */
  onNoBridge?: () => void;
  className?: string;
};

/** Posts a message to the demo's own origin only, since `content` carries what the reader typed. */
const postToFrame = (
  frame: HTMLIFrameElement | null,
  src: string,
  message: Record<string, unknown>,
) => {
  frame?.contentWindow?.postMessage(
    { channel: 'tiptap-docs', ...message },
    new URL(src, window.location.href).origin,
  );
};

/**
 * An iframe with a hosted demo page. The demo page posts `{ channel: 'tiptap-demo' }` messages
 * (`ready`, `source`, `document`, `height`) and takes `{ channel: 'tiptap-docs' }` messages
 * (`hello`, `theme`, `content`).
 */
export function DemoFrame({
  ref,
  src,
  title,
  theme,
  initialContent,
  isEager,
  onBridge,
  onNoBridge,
  className,
}: DemoFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  // The document to restore is the one at mount. A new `src` mounts a new frame.
  const [restore] = useState(() => initialContent ?? null);
  const callbacks = useRef({ onBridge, onNoBridge });
  const documents = useRef(0);
  const readyRef = useRef(false);

  useEffect(() => {
    callbacks.current = { onBridge, onNoBridge };
  });

  useImperativeHandle(ref, () => ({
    setContent: (json) => postToFrame(frameRef.current, src, { type: 'content', json }),
  }));

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const message = event.data;
      if (event.source !== frameRef.current?.contentWindow || message?.channel !== 'tiptap-demo') {
        return;
      }

      if (message.type === 'ready') {
        // `ready` comes on load and again in reply to `hello`. The document is restored once.
        if (!readyRef.current && restore) {
          postToFrame(frameRef.current, src, { type: 'content', json: restore });
        }
        readyRef.current = true;
        setIsReady(true);
        callbacks.current.onBridge?.({ type: 'ready', tabs: message.tabs, tab: message.tab });
      }

      if (message.type === 'height' && typeof message.height === 'number') {
        callbacks.current.onBridge?.({ type: 'height', height: message.height });
      }

      if (message.type === 'source') {
        callbacks.current.onBridge?.({ type: 'source', tab: message.tab, files: message.files });
      }

      if (message.type === 'document') {
        // The first document is the demo's own content, unless one was restored.
        documents.current += 1;
        callbacks.current.onBridge?.({
          type: 'document',
          tab: message.tab,
          json: message.json,
          edited: documents.current > 1 || restore !== null,
        });
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [restore, src]);

  // The frame may load before the page listens. `hello` asks it to send `ready` again.
  // A late `ready` still counts, so a lazy frame that loads after this wait recovers.
  useEffect(() => {
    postToFrame(frameRef.current, src, { type: 'hello' });
    const timeout = window.setTimeout(() => {
      if (!readyRef.current) callbacks.current.onNoBridge?.();
    }, 10000);
    return () => window.clearTimeout(timeout);
  }, [src]);

  // The theme changes without a reload, so what the reader typed stays.
  useEffect(() => {
    if (isReady) postToFrame(frameRef.current, src, { type: 'theme', theme });
  }, [isReady, src, theme]);

  const onLoad = () => {
    window.setTimeout(() => {
      if (!readyRef.current) callbacks.current.onNoBridge?.();
    }, 2500);
  };

  return (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      loading={isEager ? 'eager' : 'lazy'}
      onLoad={onLoad}
      className={cn('block size-full border-0 bg-transparent', className)}
    />
  );
}
