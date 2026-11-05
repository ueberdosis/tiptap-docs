'use client'

import { CheckIcon, CopyIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import {
  CATALOG_AREAS,
  CATALOG_GROUPS,
  CatalogArea,
  CatalogPlan,
  PLAN_LABELS,
} from '@/content/catalog'
import { INDUSTRIES } from '@/content/industries'
import { EDITOR_PRESETS } from '@/content/presets'
import { useUrlParam } from '@/hooks/useUrlParam'
import type { CatalogEntry } from '@/server/getCatalog'
import { cn } from '@/utils'
import {
  Deployment,
  PlannedFeature,
  SERVICE_TEXT,
  nextSteps,
  planName,
  planEditor,
  planToMarkdown,
} from '@/utils/planEditor'

const CUSTOM = 'custom'
const UNSURE = 'unsure'

const DEPLOYMENTS = [
  { id: 'cloud', title: 'Tiptap Cloud', text: 'Tiptap runs the services for you.' },
  { id: 'on-premises', title: 'On-premises', text: 'The services run on your own servers.' },
  { id: UNSURE, title: 'Not sure yet', text: 'Decide later. The plan assumes Tiptap Cloud.' },
]

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="secondary"
      size="small"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? (
        <CheckIcon className="w-3.5 h-3.5" aria-hidden="true" />
      ) : (
        <CopyIcon className="w-3.5 h-3.5" aria-hidden="true" />
      )}
      {copied ? 'Copied' : label}
    </Button>
  )
}

function Step({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={`step-${number}`} className="grid gap-4">
      <h2
        id={`step-${number}`}
        className="flex items-center gap-3 text-xl font-bold leading-[120%]"
      >
        <span
          className="flex-none grid place-items-center size-7 rounded-full bg-black text-white text-sm"
          aria-hidden="true"
        >
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function ChoiceCard({
  isActive,
  onClick,
  title,
  text,
}: {
  isActive: boolean
  onClick: () => void
  title: string
  text: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'text-left p-4 rounded-xl border bg-white transition-colors',
        isActive
          ? 'border-purple-500 ring-1 ring-purple-500'
          : 'border-grayAlpha-200 hover:border-grayAlpha-400',
      )}
    >
      <div className="font-semibold text-black">{title}</div>
      <div className="mt-1 text-sm text-grayAlpha-600">{text}</div>
    </button>
  )
}

function PlanTag({ plan }: { plan?: CatalogPlan }) {
  return plan && plan !== 'Open source' ? (
    <Tag size="small" variant="gray" tooltip={PLAN_LABELS[plan].tooltip}>
      {PLAN_LABELS[plan].label}
    </Tag>
  ) : null
}

/** A guided way to pick an editor's features and see the plan and the next step for it. */
export const EditorPlannerView = ({
  entries,
  docsRoot,
}: {
  entries: CatalogEntry[]
  docsRoot: string
}) => {
  const [presetId, setPresetId] = useUrlParam<string>('preset', EDITOR_PRESETS[0].id)
  const [industryId, setIndustryId] = useUrlParam<string>('industry', '')
  const [deploymentId, setDeploymentId] = useUrlParam<string>('hosting', 'cloud')
  const preset = EDITOR_PRESETS.find((candidate) => candidate.id === presetId)
  const industry = INDUSTRIES.find((candidate) => candidate.id === industryId)
  const deployment: Deployment = deploymentId === 'on-premises' ? 'on-premises' : 'cloud'

  // Changes to the preset, so a preset from the URL needs no extra render
  const [added, setAdded] = useState<Set<string>>(new Set())
  const [removed, setRemoved] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')

  const selected = useMemo(() => {
    const names = new Set(preset?.features ?? [])
    for (const name of added) names.add(name)
    for (const name of removed) names.delete(name)
    return names
  }, [preset, added, removed])

  const byName = useMemo(() => new Map(entries.map((entry) => [entry.name, entry])), [entries])
  const features: PlannedFeature[] = [...selected]
    .map((name) => byName.get(name))
    .filter((entry): entry is CatalogEntry => !!entry)
    .map(({ name, url, plan, package: pkg }) => ({ name, url, plan, package: pkg }))
  const result = planEditor(features, preset?.template, deployment)
  const { primary, secondary } = nextSteps(result)
  const markdown = planToMarkdown(
    result,
    docsRoot,
    preset ? `Editor plan: ${preset.title}` : 'Editor plan',
  )

  const choosePreset = (id: string) => {
    setPresetId(id)
    setAdded(new Set())
    setRemoved(new Set())
  }

  const setFeatures = (names: string[], on: boolean) => {
    const nextAdded = new Set(added)
    const nextRemoved = new Set(removed)
    for (const name of names) {
      const inPreset = preset?.features.includes(name) ?? false
      if (on) {
        nextRemoved.delete(name)
        if (!inPreset) nextAdded.add(name)
      } else {
        nextAdded.delete(name)
        if (inPreset) nextRemoved.add(name)
      }
    }
    setAdded(nextAdded)
    setRemoved(nextRemoved)
  }

  // Features the industry and the preset suggest, that aren't in the editor yet.
  // Announced features without docs are only named.
  const suggested = [...new Set([...(industry?.features ?? []), ...(preset?.suggestions ?? [])])]
  const recommended = suggested
    .filter((name) => byName.has(name) && !selected.has(name))
    .map((name) => byName.get(name) as CatalogEntry)
  const industryMissing = (industry?.features ?? []).filter(
    (name) => byName.has(name) && !selected.has(name),
  )
  const upcoming = (industry?.features ?? []).filter((name) => !byName.has(name))

  // On small screens the summary sits below both steps, so a bar at the bottom
  // keeps the plan and the next step in view until the summary is reached
  const summaryRef = useRef<HTMLElement>(null)
  const [isSummaryReached, setIsSummaryReached] = useState(false)
  useEffect(() => {
    const summary = summaryRef.current
    if (!summary) return
    const observer = new IntersectionObserver(([entry]) =>
      setIsSummaryReached(entry.isIntersecting || entry.boundingClientRect.top < 0),
    )
    observer.observe(summary)
    return () => observer.disconnect()
  }, [])

  const needle = query.trim().toLowerCase()
  const visible = entries.filter(
    (entry) =>
      !needle ||
      entry.name.toLowerCase().includes(needle) ||
      entry.description.toLowerCase().includes(needle),
  )

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem] gap-10 items-start pb-20 lg:pb-0">
      <div className="grid gap-12 min-w-0">
        <Step number={1} title="What are you building?">
          <div className="grid sm:grid-cols-2 gap-2">
            {EDITOR_PRESETS.map((candidate) => (
              <ChoiceCard
                key={candidate.id}
                isActive={candidate.id === presetId}
                onClick={() => choosePreset(candidate.id)}
                title={candidate.title}
                text={candidate.description}
              />
            ))}
            <ChoiceCard
              isActive={presetId === CUSTOM}
              onClick={() => choosePreset(CUSTOM)}
              title="Start empty"
              text="Pick every feature yourself."
            />
          </div>

          <h3 className="font-semibold mt-4">Your industry (optional)</h3>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Industry">
            {INDUSTRIES.map((candidate) => (
              <Button
                key={candidate.id}
                variant="tertiary"
                size="small"
                isActive={candidate.id === industryId}
                aria-pressed={candidate.id === industryId}
                onClick={() => setIndustryId(candidate.id === industryId ? '' : candidate.id)}
              >
                {candidate.title}
              </Button>
            ))}
          </div>
          {industry ? <p className="text-sm text-grayAlpha-600">{industry.description}</p> : null}

          <h3 className="font-semibold mt-4">Where should it run?</h3>
          <div className="grid sm:grid-cols-3 gap-2" role="group" aria-label="Where it runs">
            {DEPLOYMENTS.map((option) => (
              <ChoiceCard
                key={option.id}
                isActive={deploymentId === option.id}
                onClick={() => setDeploymentId(option.id)}
                title={option.title}
                text={option.text}
              />
            ))}
          </div>
          <p className="text-sm text-grayAlpha-600">
            The editor always runs in your app. <Link href="/hosting">Hosting</Link> compares where
            the Document Server, AI, and Conversion can run.
          </p>
        </Step>

        <Step number={2} title="Adjust the features">
          <div className="grid gap-2">
            <h3 className="font-semibold">In your editor ({selected.size})</h3>
            {selected.size === 0 ? (
              <p className="text-sm text-grayAlpha-600">
                Nothing yet. Add recommended features or browse all of them.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-1.5" aria-label="Selected features">
                {[...selected].map((name) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-1 rounded-full border border-grayAlpha-200 bg-white pl-3 pr-1 py-0.5 text-sm"
                  >
                    {name}
                    <button
                      type="button"
                      className="p-1 rounded-full text-grayAlpha-600 hover:bg-grayAlpha-100 hover:text-black"
                      onClick={() => setFeatures([name], false)}
                      aria-label={`Remove ${name}`}
                    >
                      <XIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {recommended.length ? (
            <div className="grid gap-3 mt-2">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="font-semibold">Recommended</h3>
                {industry && industryMissing.length ? (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setFeatures(industryMissing, true)}
                  >
                    Add all for {industry.title}
                  </Button>
                ) : null}
              </div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {recommended.map((entry) => (
                  <li
                    key={entry.name}
                    className="flex items-start gap-3 p-3 rounded-xl border border-grayAlpha-200 bg-white"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={entry.url} className="font-semibold text-black">
                          {entry.name}
                        </Link>
                        <PlanTag plan={entry.plan} />
                      </div>
                      <div className="mt-1 text-sm text-grayAlpha-600">{entry.description}</div>
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setFeatures([entry.name], true)}
                      aria-label={`Add ${entry.name}`}
                    >
                      <PlusIcon className="w-3.5 h-3.5" aria-hidden="true" />
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {upcoming.length ? (
            <p className="text-sm text-grayAlpha-600">Coming soon: {upcoming.join(', ')}.</p>
          ) : null}

          <details className="rounded-xl border border-grayAlpha-200 bg-white mt-2">
            <summary className="cursor-pointer select-none px-4 py-3 font-semibold">
              Browse all {entries.length} features
            </summary>
            <div className="grid gap-6 px-4 pb-4 pt-1">
              <label className="flex items-center p-2 gap-2 bg-white w-full sm:w-72 rounded-lg border border-neutral-300 focus-within:border-neutral-700">
                <SearchIcon className="w-4 h-4 text-neutral-500" aria-hidden="true" />
                <input
                  type="text"
                  className="w-full outline-none text-sm"
                  placeholder="Filter features..."
                  aria-label="Filter features"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              {(Object.keys(CATALOG_AREAS) as CatalogArea[]).map((area) =>
                CATALOG_GROUPS.filter((group) => group.area === area).map((group) => {
                  const items = visible.filter((entry) => entry.group === group.id)
                  if (items.length === 0) return null
                  return (
                    <fieldset key={group.id} className="grid gap-1">
                      <legend className="font-semibold text-sm mb-1">{group.title}</legend>
                      <div className="grid sm:grid-cols-2 gap-x-4">
                        {items.map((entry) => (
                          <label
                            key={entry.name}
                            className="flex items-center gap-2 text-sm py-1 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selected.has(entry.name)}
                              onChange={(event) => setFeatures([entry.name], event.target.checked)}
                            />
                            <span>{entry.name}</span>
                            <PlanTag plan={entry.plan} />
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )
                }),
              )}
            </div>
          </details>
        </Step>
      </div>

      <aside
        ref={summaryRef}
        id="your-plan"
        aria-label="Your plan"
        className="scroll-mt-24 lg:sticky lg:top-24 grid gap-5 p-5 rounded-xl border border-grayAlpha-200 bg-white"
      >
        <div>
          <div className="text-sm text-grayAlpha-600">Your plan</div>
          <div className="text-2xl font-bold leading-[120%]">{planName(result)}</div>
          {result.addOns.length ? (
            <div className="mt-2 text-sm">
              <span className="font-semibold">Add-ons:</span> {result.addOns.join(', ')}
            </div>
          ) : null}
          {result.pilot.length ? (
            <div className="mt-1 text-sm">
              <span className="font-semibold">Pilot program:</span> {result.pilot.join(', ')}
            </div>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Button asChild variant="primary">
            <Link href={primary.url}>{primary.label}</Link>
          </Button>
          {primary.text ? <p className="text-xs text-grayAlpha-600">{primary.text}</p> : null}
          {secondary ? (
            <Button asChild variant="tertiary" size="small">
              <Link href={secondary.url}>{secondary.label}</Link>
            </Button>
          ) : null}
        </div>

        {result.services.length ? (
          <div className="grid gap-1 text-sm">
            <div className="font-semibold">Services</div>
            {result.services.map((service) => (
              <p key={service} className="text-grayAlpha-600">
                {SERVICE_TEXT[service].text}
              </p>
            ))}
          </div>
        ) : null}

        {result.template ? (
          <div className="grid gap-1 text-sm">
            <div className="font-semibold">UI template</div>
            <p className="text-grayAlpha-600">
              <Link href={result.template.url}>{result.template.title}</Link> already builds this
              editor.
            </p>
          </div>
        ) : null}

        {result.packages.length ? (
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-sm">Install</div>
              <CopyButton text={`npm install ${result.packages.join(' ')}`} label="Copy" />
            </div>
            <pre
              tabIndex={0}
              aria-label="Install command"
              className="text-xs bg-grayAlpha-100 rounded-lg p-3 whitespace-pre-wrap break-all max-h-40 overflow-auto"
            >
              <code>npm install {result.packages.join(' ')}</code>
            </pre>
            <p className="text-xs text-grayAlpha-600">
              Add your framework&apos;s package too (
              <Link href="/editor/getting-started/install">Quick start</Link>).
              {result.hasProPackages ? (
                <>
                  {' '}
                  <code>@tiptap-pro</code> packages come from{' '}
                  <Link href="/guides/pro-extensions">the private registry</Link>.
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        <CopyButton text={markdown} label="Copy for your agent" />
      </aside>

      <div
        className={cn(
          'lg:hidden fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 px-4 py-3 border-t border-grayAlpha-200 bg-white transition-transform',
          isSummaryReached ? 'translate-y-full' : 'translate-y-0',
        )}
        inert={isSummaryReached}
      >
        <a href="#your-plan" className="flex-1 min-w-0 no-underline">
          <div className="text-xs text-grayAlpha-600">
            Your plan · {selected.size} {selected.size === 1 ? 'feature' : 'features'}
          </div>
          <div className="font-bold text-black truncate">
            {planName(result)}
            {result.addOns.length ? ' + add-ons' : ''}
          </div>
        </a>
        <Button asChild variant="primary" size="small">
          <Link href={primary.url}>{primary.label}</Link>
        </Button>
      </div>
    </div>
  )
}
