'use client'

// TODO [Dave]: I did a quick update to split this into Generation and AI Toolkit, but it's not the most elegant work.

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
  Type,
  RotateCcw,
  ImagePlus,
  Activity,
  Edit,
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

const CLIENT_USE_CASES: UseCase[] = [
  // AI Toolkit use cases - AI AGENTS
  {
    title: 'AI agent chatbot',
    description:
      'Create conversational AI interfaces where agents read and edit documents based on user requests.',
    href: '/ai/ai-toolkit/client/agents/ai-agent-chatbot',
    tags: ['AI Agents'],
    icon: MessageSquare,
  },
  {
    title: 'Review changes',
    description:
      'Show each AI edit as a track-changes style suggestion that users review immediately.',
    href: '/ai/ai-toolkit/client/agents/review-changes',
    tags: ['AI Agents'],
    icon: FileCheck,
  },
  {
    title: 'Review all changes at once',
    description:
      'Let AI make all edits, then show a summary of changes for batch review and approval.',
    href: '/ai/ai-toolkit/client/agents/review-changes-as-summary',
    tags: ['AI Agents'],
    icon: ListChecks,
  },
  {
    title: 'Edit multiple documents',
    description:
      'Build AI agents that create, switch between, and edit multiple documents in one workflow.',
    href: '/ai/ai-toolkit/client/agents/multi-document',
    tags: ['AI Agents'],
    icon: Files,
  },
  {
    title: 'Add AI comments',
    description:
      'Enable AI agents to read, write, and edit comments in documents for collaborative workflows.',
    href: '/ai/ai-toolkit/client/agents/comments',
    tags: ['AI Agents'],
    icon: MessageCircle,
  },
  {
    title: 'Stream edits',
    description: 'Display AI tool calls and document changes in real-time as the agent works.',
    href: '/ai/ai-toolkit/client/agents/streaming',
    tags: ['AI Agents'],
    icon: Workflow,
  },
  {
    title: 'Generate custom components with AI',
    description:
      'Enable AI to generate content using your custom editor nodes and marks, not just basic text.',
    href: '/ai/ai-toolkit/client/agents/schema-awareness',
    tags: ['AI Agents'],
    icon: Layers,
  },

  // AI Toolkit use cases - CUSTOM WORKFLOWS
  {
    title: 'Make inline edits',
    description:
      'Select text and rewrite it with AI based on instructions. Best for simple, focused edits.',
    href: '/ai/ai-toolkit/client/workflows/insert-content',
    tags: ['Workflows'],
    icon: PenLine,
  },
  {
    title: 'Proofread documents',
    description:
      'Build an AI proofreader that analyzes documents and suggests corrections with explanations.',
    href: '/ai/ai-toolkit/client/advanced-guides/proofreader',
    tags: ['Workflows'],
    icon: FileSearch,
  },
  {
    title: 'Tiptap Edit',
    description: 'A general-purpose workflow for making small and large edits to Tiptap documents.',
    href: '/ai/ai-toolkit/client/workflows/tiptap-edit',
    tags: ['Workflows'],
    icon: Edit,
  },
  {
    title: 'Comments',
    description: 'Manage comments and threads in your Tiptap documents.',
    href: '/ai/ai-toolkit/client/workflows/comments',
    tags: ['Workflows'],
    icon: MessageSquare,
  },
  {
    title: 'Show document differences',
    description:
      'Compare two document versions in real-time and display differences with highlights.',
    href: '/ai/ai-toolkit/client/advanced-guides/compare-documents',
    tags: ['Workflows'],
    icon: GitCompare,
  },
]

const GENERATION_USE_CASES = [
  // Basic AI Generation use cases - TEXT MANIPULATION
  {
    title: 'Fix grammar and spelling',
    description: 'Automatically correct grammar and spelling errors in selected text.',
    href: '/ai/basic/text-generation/built-in-commands#aifixspellingandgrammar',
    tags: ['Basic AI Generation'],
    icon: CheckCircle2,
  },
  {
    title: 'Change text tone',
    description:
      'Adjust writing tone to academic, casual, formal, friendly, professional, and more.',
    href: '/ai/basic/text-generation/built-in-commands#aiadjusttone',
    tags: ['Basic AI Generation'],
    icon: Volume2,
  },
  {
    title: 'Translate text',
    description: 'Translate selected content into any language with AI-powered translation.',
    href: '/ai/basic/text-generation/built-in-commands#aitranslate',
    tags: ['Basic AI Generation'],
    icon: Languages,
  },
  {
    title: 'Summarize content',
    description: 'Generate concise summaries or extract key points from selected text.',
    href: '/ai/basic/text-generation/built-in-commands#aisummarize',
    tags: ['Basic AI Generation'],
    icon: AlignLeft,
  },

  // Basic AI Generation use cases - ADVANCED FEATURES
  {
    title: 'Generate rich text format',
    description: 'Generate AI responses with rich formatting like bold, italic, lists, and links.',
    href: '/ai/basic/text-generation/format',
    tags: ['Basic AI Generation'],
    icon: Type,
  },
  {
    title: 'Stream AI content',
    description: 'Display AI-generated text in real-time with typewriter-style streaming effect.',
    href: '/ai/basic/text-generation/stream',
    tags: ['Basic AI Generation'],
    icon: Activity,
  },
  {
    title: 'Manage AI responses',
    description:
      'Preview, accept, reject, or regenerate AI-generated content before inserting into editor.',
    href: '/ai/basic/text-generation/manage-responses',
    tags: ['Basic AI Generation'],
    icon: RotateCcw,
  },
  {
    title: 'Generate images',
    description: 'Create AI-generated images using custom prompts with different visual styles.',
    href: '/ai/basic/image-generation',
    tags: ['Basic AI Generation'],
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

export const UseCasesGrid: React.FC<{ variant: 'client' | 'generation' }> = ({ variant }) => {
  const useCases = variant === 'client' ? CLIENT_USE_CASES : GENERATION_USE_CASES
  const toolkitAgentUseCases = useCases.filter((uc) => uc.tags.includes('AI Agents'))
  const toolkitWorkflowUseCases = useCases.filter((uc) => uc.tags.includes('Workflows'))
  const generationUseCases = useCases.filter((uc) => uc.tags.includes('Basic AI Generation'))

  return (
    <div className="grid gap-20 first:mt-0 last:mb-0">
      {toolkitAgentUseCases.length > 0 && (
        <UseCaseSection title="AI agents" useCases={toolkitAgentUseCases} />
      )}
      {toolkitWorkflowUseCases.length > 0 && (
        <UseCaseSection title="Custom workflows" useCases={toolkitWorkflowUseCases} />
      )}
      {generationUseCases.length > 0 && <UseCaseSection title="" useCases={generationUseCases} />}
    </div>
  )
}

function UseCaseSection({ title, useCases }: { title: string; useCases: UseCase[] }) {
  return (
    <div>
      {title && <div className="text-xl font-bold mb-6 leading-[120%]">{title}</div>}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-5">
        {useCases.map((useCase) => (
          <UseCaseCard useCase={useCase} key={useCase.href} />
        ))}
      </div>
    </div>
  )
}
