'use client'

import {
  MessageSquare,
  FileCheck,
  ListChecks,
  Workflow,
  PenLine,
  Files,
  MessageCircle,
  FileSearch,
  Layers,
  GitCompare,
  Volume2,
  Languages,
  AlignLeft,
  CheckCircle2,
  Zap,
  Type,
  RotateCcw,
  Code,
  ImagePlus,
  Activity,
  type LucideIcon,
} from 'lucide-react'

import { Card } from './ui/Card'
import Link from '@/components/Link'

interface UseCase {
  title: string
  description: string
  href: string
  tags: string[]
  icon: LucideIcon
}

const USE_CASES: UseCase[] = [
  // AI Toolkit use cases - AI AGENTS
  {
    title: 'Build AI agent chatbot',
    description:
      'Create conversational AI interfaces where agents read and edit documents based on user requests.',
    href: '/content-ai/capabilities/ai-toolkit/guides/ai-agent-chatbot',
    tags: ['AI Agents'],
    icon: MessageSquare,
  },
  {
    title: 'Edit multiple documents',
    description:
      'Build AI agents that create, switch between, and edit multiple documents in one workflow.',
    href: '/content-ai/capabilities/ai-toolkit/advanced-guides/multi-document',
    tags: ['AI Agents'],
    icon: Files,
  },
  {
    title: 'Add AI comments',
    description:
      'Enable AI agents to read, write, and edit comments in documents for collaborative workflows.',
    href: '/content-ai/capabilities/ai-toolkit/advanced-guides/comments',
    tags: ['AI Agents'],
    icon: MessageCircle,
  },
  {
    title: 'Review changes',
    description:
      'Show each AI edit as a track-changes style suggestion that users review immediately.',
    href: '/content-ai/capabilities/ai-toolkit/guides/review-changes',
    tags: ['AI Agents'],
    icon: FileCheck,
  },
  {
    title: 'Review all changes at once',
    description:
      'Let AI make all edits, then show a summary of changes for batch review and approval.',
    href: '/content-ai/capabilities/ai-toolkit/guides/review-changes-as-summary',
    tags: ['AI Agents'],
    icon: ListChecks,
  },
  {
    title: 'Stream tool execution',
    description: 'Display AI tool calls and document changes in real-time as the agent works.',
    href: '/content-ai/capabilities/ai-toolkit/guides/tool-streaming',
    tags: ['AI Agents'],
    icon: Workflow,
  },
  {
    title: 'Generate custom components with AI',
    description:
      'Enable AI to generate content using your custom editor nodes and marks, not just basic text.',
    href: '/content-ai/capabilities/ai-toolkit/primitives/schema-awareness',
    tags: ['AI Agents'],
    icon: Layers,
  },

  // AI Toolkit use cases - CUSTOM WORKFLOWS
  {
    title: 'Make inline edits',
    description:
      'Select text and rewrite it with AI based on instructions. Best for simple, focused edits.',
    href: '/content-ai/capabilities/ai-toolkit/guides/inline-edits',
    tags: ['Workflows'],
    icon: PenLine,
  },
  {
    title: 'Proofread documents',
    description:
      'Build an AI proofreader that analyzes documents and suggests corrections with explanations.',
    href: '/content-ai/capabilities/ai-toolkit/advanced-guides/proofreader',
    tags: ['Workflows'],
    icon: FileSearch,
  },
  {
    title: 'Show document differences',
    description:
      'Compare two document versions in real-time and display differences with highlights.',
    href: '/content-ai/capabilities/ai-toolkit/primitives/compare-documents',
    tags: ['Workflows'],
    icon: GitCompare,
  },

  // AI Generation use cases - POPULAR FEATURES
  {
    title: 'Inline autocompletion',
    description:
      'Show AI-powered text suggestions as users type. Accept with Tab, like GitHub Copilot.',
    href: '/content-ai/capabilities/generation/text-generation/autocompletion',
    tags: ['AI Generation'],
    icon: Zap,
  },
  {
    title: 'Create custom commands',
    description:
      'Build your own AI commands with custom prompts, parameters, and response handling.',
    href: '/content-ai/capabilities/generation/text-generation/custom-commands',
    tags: ['AI Generation'],
    icon: Code,
  },

  // AI Generation use cases - TEXT MANIPULATION
  {
    title: 'Fix grammar and spelling',
    description: 'Automatically correct grammar and spelling errors in selected text.',
    href: '/content-ai/capabilities/generation/text-generation/built-in-commands#aifixspellingandgrammar',
    tags: ['AI Generation'],
    icon: CheckCircle2,
  },
  {
    title: 'Change text tone',
    description:
      'Adjust writing tone to academic, casual, formal, friendly, professional, and more.',
    href: '/content-ai/capabilities/generation/text-generation/built-in-commands#aiadjusttone',
    tags: ['AI Generation'],
    icon: Volume2,
  },
  {
    title: 'Translate text',
    description: 'Translate selected content into any language with AI-powered translation.',
    href: '/content-ai/capabilities/generation/text-generation/built-in-commands#aitranslate',
    tags: ['AI Generation'],
    icon: Languages,
  },
  {
    title: 'Summarize content',
    description: 'Generate concise summaries or extract key points from selected text.',
    href: '/content-ai/capabilities/generation/text-generation/built-in-commands#aisummarize',
    tags: ['AI Generation'],
    icon: AlignLeft,
  },

  // AI Generation use cases - ADVANCED FEATURES
  {
    title: 'Generate rich text format',
    description: 'Generate AI responses with rich formatting like bold, italic, lists, and links.',
    href: '/content-ai/capabilities/generation/text-generation/format',
    tags: ['AI Generation'],
    icon: Type,
  },
  {
    title: 'Stream AI content',
    description: 'Display AI-generated text in real-time with typewriter-style streaming effect.',
    href: '/content-ai/capabilities/generation/text-generation/stream',
    tags: ['AI Generation'],
    icon: Activity,
  },
  {
    title: 'Manage AI responses',
    description:
      'Preview, accept, reject, or regenerate AI-generated content before inserting into editor.',
    href: '/content-ai/capabilities/generation/text-generation/manage-responses',
    tags: ['AI Generation'],
    icon: RotateCcw,
  },
  {
    title: 'Generate images',
    description: 'Create AI-generated images using custom prompts with different visual styles.',
    href: '/content-ai/capabilities/generation/image-generation',
    tags: ['AI Generation'],
    icon: ImagePlus,
  },
]

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const Icon = useCase.icon
  return (
    <Card isClickable asChild>
      <Link href={useCase.href}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <Icon className="size-4 text-neutral-600" />
          <div></div>
        </div>
        <div className="font-semibold text-black leading-[140%]">{useCase.title}</div>
        <div className="mt-2 leading-[140%] text-grayAlpha-600">{useCase.description}</div>
      </Link>
    </Card>
  )
}

export const UseCasesGrid = () => {
  const toolkitAgentUseCases = USE_CASES.filter((uc) => uc.tags.includes('AI Agents'))
  const toolkitWorkflowUseCases = USE_CASES.filter((uc) => uc.tags.includes('Workflows'))
  const generationUseCases = USE_CASES.filter((uc) => uc.tags.includes('AI Generation'))

  return (
    <div className="grid gap-20 first:mt-0 last:mb-0">
      <UseCaseSection title="AI agents" useCases={toolkitAgentUseCases} />
      <UseCaseSection title="Custom workflows" useCases={toolkitWorkflowUseCases} />
      <UseCaseSection title="AI Generation" useCases={generationUseCases} />
    </div>
  )
}

function UseCaseSection({ title, useCases }: { title: string; useCases: UseCase[] }) {
  return (
    <div>
      <div className="text-xl font-bold mb-6 leading-[120%]">{title}</div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-5">
        {useCases.map((useCase) => (
          <UseCaseCard useCase={useCase} key={useCase.href} />
        ))}
      </div>
    </div>
  )
}
