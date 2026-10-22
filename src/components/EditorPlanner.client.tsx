'use client'

import { CheckIcon, CopyIcon, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import { CATALOG_AREAS, CATALOG_GROUPS, CatalogArea } from '@/content/catalog'
import { EDITOR_PRESETS } from '@/content/presets'
import { useUrlParam } from '@/hooks/useUrlParam'
import type { CatalogEntry } from '@/server/getCatalog'
import { PlannedFeature, SERVICE_TEXT, planEditor, planToMarkdown } from '@/utils/planEditor'

const CUSTOM = 'custom'

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

/** Pick a starting point, add or remove features, and see what it takes to build the editor. */
export const EditorPlannerView = ({
  entries,
  docsRoot,
}: {
  entries: CatalogEntry[]
  docsRoot: string
}) => {
  const [presetId, setPresetId] = useUrlParam<string>('preset', EDITOR_PRESETS[0].id)
  const preset = EDITOR_PRESETS.find((candidate) => candidate.id === presetId)
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
  const result = planEditor(features, preset?.template)
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

  const toggle = (name: string) => {
    const isOn = selected.has(name)
    const inPreset = preset?.features.includes(name) ?? false
    const nextAdded = new Set(added)
    const nextRemoved = new Set(removed)
    if (isOn) {
      nextAdded.delete(name)
      if (inPreset) nextRemoved.add(name)
    } else {
      nextRemoved.delete(name)
      if (!inPreset) nextAdded.add(name)
    }
    setAdded(nextAdded)
    setRemoved(nextRemoved)
  }

  const needle = query.trim().toLowerCase()
  const visible = entries.filter(
    (entry) =>
      !needle ||
      entry.name.toLowerCase().includes(needle) ||
      entry.description.toLowerCase().includes(needle),
  )

  return (
    <div className="grid gap-10">
      <section aria-label="Start from" className="grid gap-3">
        <h2 className="text-xl font-bold leading-[120%]">Start from</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {EDITOR_PRESETS.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => choosePreset(candidate.id)}
              aria-pressed={candidate.id === presetId}
              className={`text-left p-4 rounded-xl border transition-colors ${
                candidate.id === presetId
                  ? 'border-purple-500 bg-white'
                  : 'border-grayAlpha-200 hover:border-grayAlpha-400'
              }`}
            >
              <div className="font-semibold text-black">{candidate.title}</div>
              <div className="mt-1 text-sm text-grayAlpha-600">{candidate.description}</div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => choosePreset(CUSTOM)}
            aria-pressed={presetId === CUSTOM}
            className={`text-left p-4 rounded-xl border transition-colors ${
              presetId === CUSTOM
                ? 'border-purple-500 bg-white'
                : 'border-grayAlpha-200 hover:border-grayAlpha-400'
            }`}
          >
            <div className="font-semibold text-black">Start empty</div>
            <div className="mt-1 text-sm text-grayAlpha-600">Pick every feature yourself.</div>
          </button>
        </div>
      </section>

      <Card>
        <section aria-label="What you need" className="grid gap-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-bold leading-[120%]">What you need</h2>
            <CopyButton text={markdown} label="Copy for your agent" />
          </div>

          <dl className="grid sm:grid-cols-[10rem_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="font-semibold">Plan</dt>
            <dd>
              {result.plan}
              {result.addOns.length ? `, plus the add-ons ${result.addOns.join(', ')}` : ''}
              {result.pilot.length ? `, and the pilot program for ${result.pilot.join(', ')}` : ''}
              {result.plan !== 'Open source' || result.addOns.length ? (
                <>
                  {' '}
                  · <Link href="https://tiptap.dev/pricing">Pricing</Link>
                </>
              ) : null}
            </dd>
            {result.services.map((service) => (
              <div className="contents" key={service}>
                <dt className="font-semibold">{SERVICE_TEXT[service].title}</dt>
                <dd>
                  {SERVICE_TEXT[service].text} <Link href={SERVICE_TEXT[service].url}>Hosting</Link>
                </dd>
              </div>
            ))}
            {result.template ? (
              <>
                <dt className="font-semibold">UI template</dt>
                <dd>
                  <Link href={result.template.url}>{result.template.title}</Link> already builds
                  this editor.
                </dd>
              </>
            ) : null}
            <dt className="font-semibold">Features</dt>
            <dd className="flex flex-wrap gap-1">
              {result.features.length === 0 ? 'None selected yet.' : null}
              {result.features.map((feature) => (
                <Link key={feature.name} href={feature.url} className="no-underline">
                  <Tag>{feature.name}</Tag>
                </Link>
              ))}
            </dd>
          </dl>

          {result.packages.length ? (
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-sm">Install</h3>
                <CopyButton text={`npm install ${result.packages.join(' ')}`} label="Copy" />
              </div>
              <pre className="text-sm bg-grayAlpha-100 rounded-lg p-3 whitespace-pre-wrap break-all">
                <code>npm install {result.packages.join(' ')}</code>
              </pre>
              <p className="text-sm text-grayAlpha-600">
                Add your framework&apos;s package too, such as <code>@tiptap/react</code> (
                <Link href="/editor/getting-started/install">Quick start</Link>).
                {result.hasProPackages ? (
                  <>
                    {' '}
                    Packages under <code>@tiptap-pro</code> come from{' '}
                    <Link href="/guides/pro-extensions">Tiptap&apos;s private registry</Link>.
                  </>
                ) : null}
              </p>
            </div>
          ) : null}
        </section>
      </Card>

      <section aria-label="Features" className="grid gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-bold leading-[120%]">Features ({selected.size} selected)</h2>
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
        </div>
        {(Object.keys(CATALOG_AREAS) as CatalogArea[]).map((area) =>
          CATALOG_GROUPS.filter((group) => group.area === area).map((group) => {
            const items = visible.filter((entry) => entry.group === group.id)
            if (items.length === 0) return null
            return (
              <fieldset key={group.id} className="grid gap-2">
                <legend className="font-semibold mb-2">{group.title}</legend>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-1">
                  {items.map((entry) => (
                    <label
                      key={entry.name}
                      className="flex items-center gap-2 text-sm py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(entry.name)}
                        onChange={() => toggle(entry.name)}
                      />
                      <span>{entry.name}</span>
                      {entry.plan && entry.plan !== 'Open source' ? (
                        <Tag size="small" variant="gray">
                          {entry.plan}
                        </Tag>
                      ) : null}
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          }),
        )}
      </section>
    </div>
  )
}
