'use client'

import { usePathname } from 'next/navigation'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from './ui/Button'
import { FULL_DOMAIN } from '@/utils/constants'

export const AskAi = () => {
  const pathname = usePathname()
  const url = [`${FULL_DOMAIN}`, `${pathname}`].join('')
  const encoded = encodeURIComponent(`
You are a helpful AI assistant and expert in Tiptap and ProseMirror.

The user is currently reading this documentation page:
${url}

Your task:
- Explain clearly what this page is about and what problem it helps solve.
- Describe the key concepts, APIs, or components mentioned on the page.
- Give practical examples or use cases so the user can apply the information right away.
- If the page contains code, summarize what it does and how to use it.
- If you cannot directly read the page, give a general explanation of what this topic likely covers in the context of Tiptap.
- Use plain language and be concise but thorough.
- End with a short summary of how this feature fits into the bigger Tiptap ecosystem.

Output format:
1. **Overview**
2. **How it works**
3. **Example usage**
4. **When to use it**
5. **Related concepts or next steps**
`)

  const urls = [
    {
      key: 'claude',
      url: `https://claude.ai/new?q=${encoded}`,
      label: 'Ask Claude',
      icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Claude</title><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>',
    },
    {
      key: 'openai',
      url: `https://chatgpt.com/?hints=search&q=${encoded}`,
      label: 'Ask OpenAI',
      icon: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>OpenAI</title><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`,
    },
    {
      key: 't3',
      url: `https://t3.chat/new?q=${encoded}`,
      label: 'Ask T3 chat',
      icon: '<svg role="img" viewBox="0 0 258 199" xmlns="http://www.w3.org/2000/svg"><title>T3 Chat</title><path fill-rule="evenodd" d="M165.735 25.07 188.947.972H.466V25.07h165.269Z" clip-rule="evenodd"/><path d="m163.981 96.324 90.041-92.64-32.816-.001-75.589 77.078 18.364 15.563ZM233.658 131.418c0 23.657-19.178 42.836-42.835 42.836-19.108 0-35.31-12.516-40.823-29.815l-3.375-10.591-19.296 19.295 1.763 4.193c10.123 24.085 33.942 41.018 61.731 41.018 36.968 0 66.936-29.968 66.936-66.936 0-24.481-13.36-45.678-32.803-57.328l-4.561-2.732-17.668 17.895 8.061 4.255c13.615 7.188 22.87 21.473 22.87 37.91Z"/><path fill-rule="evenodd" d="M88.263 192.669V45.646H64.165v147.023h24.097Z" clip-rule="evenodd"/></svg>',
    },
    {
      key: 'perplexity',
      url: `https://www.perplexity.ai/search?q=${encoded}`,
      label: 'Ask Perplexity',
      icon: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Perplexity</title><path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"/></svg>',
    },
  ]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild className="outline-none ring-0">
        <Button size="small" variant="tertiary">
          Ask AI <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          align="end"
          className="min-w-[160px] bg-white border border-grayAlpha-200 shadow-cardLight rounded-lg p-1.5"
        >
          {urls.map((url) => (
            <DropdownMenu.Item key={url.key} asChild>
              <a
                href={url.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-700 hover:bg-grayAlpha-100 rounded-lg p-2 cursor-pointer outline-none ring-0 flex items-center gap-2"
              >
                <div
                  className="size-4 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: url.icon }}
                ></div>
                <span className="flex-auto">{url.label}</span>
              </a>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
