'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type InferUITool, type Tool, type UIMessage } from 'ai';
import type { ReactNode } from 'react';
import type { VersionName } from '@/lib/versions';
import { type AIChatClientData, AIChatProvider, AIChatSearch } from './chat';

export { AIChatPanel, useAIChat } from './chat';

export type SearchTool = Tool<
  { query: string; limit: number },
  { doc?: { url: string; title: string } | null }[]
>;

export type ChatUIMessage = UIMessage<
  never,
  { client: AIChatClientData },
  { search: InferUITool<SearchTool> }
>;

/** The chat state for one docs version. Its search covers only the pages of `version`. */
export function AIChat({ children, version }: { children: ReactNode; version: VersionName }) {
  const chat = useChat<ChatUIMessage>({
    id: 'search',
    throttle: 40,
    transport: new DefaultChatTransport({
      api: '/docs/api/chat',
      body: { version },
    }),
  });

  return (
    <AIChatProvider chat={chat} renderPart={renderPart}>
      {children}
    </AIChatProvider>
  );
}

function renderPart(part: ChatUIMessage['parts'][number], live: boolean) {
  if (part.type === 'tool-search') return <AIChatSearch part={part} live={live} />;
}
