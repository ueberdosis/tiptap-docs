/** Whether the AI chat is on: true when `OPENAI_API_KEY` is set. Server only. Static pages read it at build time. */
export function isAIChatEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
