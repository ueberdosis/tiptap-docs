'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import {
  CheckIcon,
  Code2Icon,
  ExpandIcon,
  ExternalLinkIcon,
  EyeIcon,
  LinkIcon,
  MonitorIcon,
  MoonIcon,
  RotateCcwIcon,
  Rows2Icon,
  SmartphoneIcon,
  SunIcon,
  TabletIcon,
  XIcon,
} from 'lucide-react';
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/cn';
import { useDemoBaseUrl } from '@/lib/demo-urls';
import { ControlButton, ControlLink, Divider, Segmented } from './controls';
import { DemoCode } from './demo-code';
import {
  type DemoBridgeEvent,
  type DemoDocument,
  type DemoFile,
  DemoFrame,
  type DemoFrameHandle,
} from './demo-frame';
import {
  demoId,
  FRAMEWORKS,
  type Framework,
  formatHash,
  parseFrameworks,
  parseHash,
  SIZE_WIDTHS,
  type Size,
  storeHeight,
  type Theme,
  useHash,
  useStoredFramework,
  useStoredHeight,
  type View,
} from './state';

export type DemoViewerProps = {
  /** The demo page, such as `/Extensions/Comments`. May have a query. Not needed with `src`. */
  path?: string;
  isPro?: boolean;
  /** A full URL instead of `path`. Shown as it is, without code, theme or framework. */
  src?: string;
  /** A fixed height of 15rem, unless `height` is set. */
  isSmall?: boolean;
  /** A fixed height of 70vh, at most 31rem, unless `height` is set. */
  isLarge?: boolean;
  /**
   * `auto` (the default) follows the demo's own height, up to `maxHeight`. A number (pixels) or a
   * CSS length fixes it. Demo pages without the bridge get 24rem.
   */
  height?: 'auto' | number | string;
  /** The most `auto` grows to, in pixels. */
  maxHeight?: number;
  /** The reader can drag the demo's bottom edge to change its height. On unless `false`. */
  resizable?: boolean;
  /** What shows first. `both` shows the demo and its code below it. */
  view?: View;
  /** The code below the demo. Off, the bar has no Preview / Code / Both either. */
  code?: boolean;
  /** How much code shows below the demo before "Show all": pixels, or `full` for all. */
  codeHeight?: number | 'full';
  /** The frameworks the code offers, such as `"React"` or `"React, Vue"`. One hides the switch. */
  frameworks?: Framework[] | string;
  /** A light / dark switch for the demo, for demos made for both. */
  themes?: boolean;
  /** A desktop / tablet / phone width switch, for demos of responsive UI. */
  sizes?: boolean;
  /** The Expand button, which opens the demo large over the page with its code beside it. On unless `false`. */
  expand?: boolean;
  /** A short line at the left of the bar, for a demo without code. */
  caption?: ReactNode;
  className?: string;
};

const OPEN_SOURCE_REPO = 'https://github.com/ueberdosis/tiptap/tree/main/demos/src';

const VIEW_OPTIONS: { value: View; label: string; tooltip: string; icon: ReactNode }[] = [
  { value: 'preview', label: 'Preview', tooltip: 'Show the demo', icon: <EyeIcon /> },
  { value: 'code', label: 'Code', tooltip: 'Show the code', icon: <Code2Icon /> },
  { value: 'both', label: 'Both', tooltip: 'Show the demo and its code', icon: <Rows2Icon /> },
];

const THEME_OPTIONS: { value: Theme; label: string; icon: ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
];

const SIZE_OPTIONS: { value: Size; label: string; icon: ReactNode }[] = [
  { value: 'desktop', label: 'Desktop width', icon: <MonitorIcon /> },
  { value: 'tablet', label: 'Tablet width', icon: <TabletIcon /> },
  { value: 'phone', label: 'Phone width', icon: <SmartphoneIcon /> },
];

type Bridge = { state: 'pending' | 'ready' | 'none'; tabs: Framework[]; tab: Framework | null };

/**
 * A hosted demo with a bar above it: Preview / Code / Both, light or dark, desktop, tablet or
 * phone width, reset, a link to this state, the demo expanded over the page, and the demo alone
 * in a new tab. The code comes from the demo page itself (see `DemoFrame`).
 *
 * The framework is one choice for the reader, kept for every demo. Each framework is its own demo
 * page, so switching reloads the frame. A document the reader edited is carried over.
 */
export function DemoViewer({
  path = '',
  isPro,
  src,
  isSmall,
  isLarge,
  height = isSmall ? 240 : isLarge ? 'min(70vh, 31rem)' : 'auto',
  maxHeight = 640,
  resizable = true,
  view: defaultView = 'both',
  code: showsCode = true,
  codeHeight = 448,
  frameworks: frameworksProp,
  themes: hasThemes,
  sizes: hasSizes,
  expand: hasExpand = true,
  caption,
  className,
}: DemoViewerProps) {
  const id = demoId(src ?? path);
  const [pathname, search = ''] = path.split('?');
  const demoPath = pathname.replace(/\/$/, '');
  const pathFramework = FRAMEWORKS.find((name) => demoPath.endsWith(`/${name}`));
  const allowed = parseFrameworks(frameworksProp);
  // A path that ends in a framework, or a page that names one, shows that framework only.
  const fixedFramework = pathFramework ?? (allowed.length === 1 ? allowed[0] : undefined);
  const name =
    demoPath
      .split('/')
      .filter(Boolean)
      .at(pathFramework ? -2 : -1) ?? 'Demo';
  const base = useDemoBaseUrl(isPro);

  const hashState = parseHash(useHash(), id);
  const [storedFramework, setStoredFramework] = useStoredFramework();
  const [viewChoice, setViewChoice] = useState<View | null>(null);
  const [frameworkChoice, setFrameworkChoice] = useState<Framework | null>(null);
  const [themeChoice, setThemeChoice] = useState<Theme | null>(null);
  const [sizeChoice, setSizeChoice] = useState<Size | null>(null);
  const [loadTheme, setLoadTheme] = useState<Theme | null>(null);
  const [reloads, setReloads] = useState(0);
  const [bridge, setBridge] = useState<Bridge>({ state: 'pending', tabs: [], tab: null });
  const [files, setFiles] = useState<Partial<Record<Framework, DemoFile[]>>>({});
  const [doc, setDoc] = useState<{ json: DemoDocument; edited: boolean } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // Expanded has its own view, and opens on both.
  const [expandedView, setExpandedView] = useState<View>('both');
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const storedHeight = useStoredHeight(id);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const demoCard = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const inlineHandle = useRef<DemoFrameHandle>(null);
  const expandedEdited = useRef(false);

  const wanted = frameworkChoice ?? hashState?.framework ?? storedFramework;
  const framework = fixedFramework ?? (allowed.includes(wanted) ? wanted : allowed[0]);
  const theme = hasThemes ? (themeChoice ?? hashState?.theme ?? 'light') : 'light';
  const size = hasSizes ? (sizeChoice ?? hashState?.size ?? 'desktop') : 'desktop';
  // The framework the demo actually shows: a demo with React only shows React.
  const shownFramework =
    bridge.tab ??
    (bridge.tabs.length && !bridge.tabs.includes(framework) ? bridge.tabs[0] : framework);
  const hasBridge = !src && bridge.state === 'ready';
  const hasCode = showsCode && !src && bridge.state !== 'none';
  const view = hasCode ? (viewChoice ?? hashState?.view ?? defaultView) : 'preview';

  const frameSrc = (() => {
    if (src) return src;
    const params = new URLSearchParams(search);
    params.set('embed', 'true');
    params.set('hideSource', 'true');
    if (!pathFramework) params.set('tab', framework);
    params.set('theme', loadTheme ?? theme);
    return `${base}${pathname}?${params}`;
  })();

  const newTabUrl = (() => {
    if (src) return src;
    const demo = pathFramework ? demoPath : `${demoPath}/${shownFramework}`;
    return `${new URL(base).origin}/src${demo}/?theme=${theme}`;
  })();

  const githubUrl =
    !isPro && !src
      ? `${OPEN_SOURCE_REPO}${pathFramework ? demoPath : `${demoPath}/${shownFramework}`}`
      : undefined;

  // A link with this demo's state scrolls to it.
  const isLinked = hashState !== null;
  useEffect(() => {
    if (isLinked) document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }, [id, isLinked]);

  const onBridge = (event: DemoBridgeEvent) => {
    if (event.type === 'ready') {
      setBridge({ state: 'ready', tabs: event.tabs, tab: event.tab });
    }
    if (event.type === 'height') {
      setContentHeight(event.height);
      storeHeight(id, event.height);
    }
    if (event.type === 'source') {
      setFiles((previous) => ({ ...previous, [event.tab]: event.files }));
    }
    if (event.type === 'document') {
      setDoc((previous) => ({
        json: event.json,
        edited: Boolean(previous?.edited || event.edited),
      }));
      if (isExpanded && event.edited) expandedEdited.current = true;
    }
  };

  // The expanded frame measures at the dialog's width, so its height is not the inline demo's.
  const onExpandedBridge = (event: DemoBridgeEvent) => {
    if (event.type !== 'height') onBridge(event);
  };

  const onNoBridge = () =>
    setBridge((previous) =>
      previous.state === 'pending' ? { ...previous, state: 'none' } : previous,
    );

  // A new frame starts in the theme shown now. Later changes go to it by message.
  const freezeTheme = () => setLoadTheme(null);

  const changeFramework = (value: Framework) => {
    if (value === framework) return;
    setStoredFramework(value);
    if (hashState?.framework) setFrameworkChoice(value);
    setBridge((previous) => ({ ...previous, tab: null }));
    freezeTheme();
  };

  const changeTheme = (value: Theme) => {
    if (loadTheme === null) setLoadTheme(theme);
    setThemeChoice(value);
  };

  const reset = () => {
    setDoc(null);
    setDragHeight(null);
    setBridge((previous) => ({ ...previous, tab: null }));
    freezeTheme();
    setReloads((count) => count + 1);
  };

  const [linkCopied, copyLink] = useCopyButton(() => {
    const hash = formatHash(id, { view, framework: shownFramework, size, theme });
    return navigator.clipboard.writeText(`${window.location.href.split('#')[0]}${hash}`);
  });

  const openExpanded = () => {
    setExpandedView('both');
    expandedEdited.current = false;
    setIsExpanded(true);
  };

  const onExpandedChange = (isOpen: boolean) => {
    setIsExpanded(isOpen);
    // What the reader typed there comes back to the page.
    if (!isOpen && expandedEdited.current && doc) inlineHandle.current?.setContent(doc.json);
  };

  const frameworks = fixedFramework
    ? []
    : bridge.tabs.length
      ? allowed.filter((item) => bridge.tabs.includes(item))
      : allowed;

  // Dragged, fixed, or the demo's own height (24rem until it says, or without the bridge).
  const frameHeight: number | string =
    dragHeight ??
    (height !== 'auto'
      ? height
      : Math.min(maxHeight, Math.max(120, (hasBridge && contentHeight) || storedHeight || 384)));

  // An auto height shows the demo once it has its height, instead of growing in front of the reader.
  const isMeasuring =
    height === 'auto' && dragHeight === null && contentHeight === null && bridge.state !== 'none';

  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    const startY = event.clientY;
    const startHeight = demoCard.current?.getBoundingClientRect().height ?? 384;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const onMove = (move: globalThis.PointerEvent) =>
      setDragHeight(Math.max(120, Math.round(startHeight + move.clientY - startY)));
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
  };

  const resizeByKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowDown' ? 40 : event.key === 'ArrowUp' ? -40 : 0;
    if (!step) return;
    event.preventDefault();
    const current = demoCard.current?.getBoundingClientRect().height ?? 384;
    setDragHeight(Math.max(120, Math.round(current + step)));
  };

  const frameKey = `${frameSrc}#${reloads}`;
  const restore = doc?.edited ? doc.json : null;

  const code = (codeClassName?: string, collapsedHeight: number | null = null) => (
    <DemoCode
      className={codeClassName}
      collapsedHeight={collapsedHeight}
      files={files[shownFramework] ?? null}
      document={doc?.json ?? null}
      framework={shownFramework}
      frameworks={frameworks}
      onFrameworkChange={changeFramework}
      githubUrl={githubUrl}
      isUnavailable={bridge.state === 'none'}
      demoUrl={newTabUrl}
    />
  );

  const bar = (inExpanded: boolean) => (
    // On phones the bar scrolls sideways instead of wrapping to a second row.
    <div className="flex items-center gap-x-2 gap-y-1.5 max-sm:-mx-1 max-sm:overflow-x-auto max-sm:px-1 max-sm:[scrollbar-width:none] sm:flex-wrap max-sm:[&::-webkit-scrollbar]:hidden">
      {hasCode && !inExpanded ? (
        <Segmented label="View">
          {VIEW_OPTIONS.map((option) => (
            <ControlButton
              key={option.value}
              label={option.label}
              tooltip={option.tooltip}
              aria-pressed={view === option.value}
              isActive={view === option.value}
              onClick={() => setViewChoice(option.value)}
              className="px-2.5"
            >
              <span className="max-sm:hidden">{option.label}</span>
              <span className="sm:hidden">{option.icon}</span>
            </ControlButton>
          ))}
        </Segmented>
      ) : null}
      {/* The caption takes the left only when there is no view switch. */}
      {caption && !hasCode && !inExpanded ? (
        <p className="min-w-0 flex-1 truncate text-fd-muted-foreground text-sm [&_strong]:font-semibold [&_strong]:text-fd-foreground">
          {caption}
        </p>
      ) : null}

      <div className="ms-auto flex shrink-0 items-center gap-x-2 gap-y-1.5 sm:flex-wrap">
        {hasCode && inExpanded ? (
          <>
            {/* Expanded always shows the demo. The code is beside it or hidden. */}
            <ControlButton
              label="Code"
              tooltip={expandedView === 'both' ? 'Hide the code' : 'Show the code beside the demo'}
              aria-pressed={expandedView === 'both'}
              isActive={expandedView === 'both'}
              onClick={() => setExpandedView(expandedView === 'both' ? 'preview' : 'both')}
            >
              <Code2Icon />
              <span className="max-sm:hidden">Code</span>
            </ControlButton>
            <Divider />
          </>
        ) : null}
        {hasBridge && hasThemes ? (
          <Segmented label="Theme">
            {THEME_OPTIONS.map((option) => (
              <ControlButton
                key={option.value}
                label={option.label}
                tooltip={`${option.label} demo`}
                aria-pressed={theme === option.value}
                isActive={theme === option.value}
                onClick={() => changeTheme(option.value)}
              >
                {option.icon}
              </ControlButton>
            ))}
          </Segmented>
        ) : null}
        {hasSizes ? (
          <Segmented label="Width" className="max-sm:hidden">
            {SIZE_OPTIONS.map((option) => (
              <ControlButton
                key={option.value}
                label={option.label}
                aria-pressed={size === option.value}
                isActive={size === option.value}
                onClick={() => setSizeChoice(option.value)}
              >
                {option.icon}
              </ControlButton>
            ))}
          </Segmented>
        ) : null}
        <div className="flex items-center gap-0.5">
          <ControlButton label="Reset" tooltip="Reload the demo" onClick={reset}>
            <RotateCcwIcon />
          </ControlButton>
          {!src ? (
            <ControlButton
              label={linkCopied ? 'Copied' : 'Copy link'}
              tooltip="Copy a link to the demo as shown"
              onClick={copyLink}
              aria-live="polite"
            >
              {linkCopied ? <CheckIcon /> : <LinkIcon />}
              {linkCopied ? <span>Copied</span> : null}
            </ControlButton>
          ) : null}
          {/* The icon actions, then the ones that open the demo elsewhere. */}
          <Divider />
          {inExpanded || !hasExpand ? null : (
            <ControlButton
              label="Expand"
              tooltip="Open large, with the code beside it"
              onClick={openExpanded}
            >
              <ExpandIcon />
              <span className="max-sm:hidden">Expand</span>
            </ControlButton>
          )}
          <ControlLink
            label="New tab"
            tooltip="Open the demo alone in a new tab"
            tipAlign="end"
            href={newTabUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLinkIcon />
            <span className="max-sm:hidden">New tab</span>
          </ControlLink>
          {inExpanded ? (
            <>
              <Divider />
              <ControlButton
                label="Close"
                tooltip="Close (Esc)"
                tipAlign="end"
                onClick={() => onExpandedChange(false)}
              >
                <XIcon />
              </ControlButton>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );

  // The demos have their own background. A narrow width shows the frame on a muted stage.
  const stage = (frame: ReactNode, frameClassName?: string) => (
    <div
      className={cn(
        'flex h-full justify-center overflow-hidden transition-colors',
        size === 'desktop' ? (theme === 'dark' ? 'bg-[#110f0e]' : 'bg-white') : 'bg-fd-muted',
      )}
    >
      <div
        className={cn(
          'max-w-full transition-[width] duration-200',
          theme === 'dark' ? 'bg-[#110f0e]' : 'bg-white',
          size !== 'desktop' && 'shadow-md',
          frameClassName,
        )}
        style={{ width: SIZE_WIDTHS[size] }}
      >
        {frame}
      </div>
    </div>
  );

  return (
    <div
      id={id}
      className={cn(
        // Next to a code block or another demo, the gap is 1rem.
        'code-demo not-prose my-12 scroll-mt-28',
        '[&:has(+_:is(figure.shiki,.code-demo))]:mb-4 [:is(figure.shiki,.code-demo)+&]:mt-4',
        className,
      )}
    >
      <div className="mb-2">{bar(false)}</div>
      <div className="relative">
        {/* Hidden but loaded in the Code view, since the code comes from the demo. */}
        <div
          aria-hidden={view === 'code' || undefined}
          className={
            view === 'code'
              ? 'pointer-events-none absolute inset-x-0 top-0 opacity-0'
              : 'relative overflow-hidden rounded-xl border bg-white'
          }
        >
          <div
            ref={demoCard}
            style={{ height: frameHeight }}
            className={cn(
              'transition-opacity duration-200',
              isMeasuring ? 'opacity-0' : 'opacity-100',
            )}
          >
            {stage(
              <DemoFrame
                key={frameKey}
                ref={inlineHandle}
                src={frameSrc}
                title={`${name} demo`}
                theme={theme}
                initialContent={restore}
                isEager={view === 'code'}
                onBridge={onBridge}
                onNoBridge={onNoBridge}
              />,
              'h-full',
            )}
          </div>
          {resizable && view !== 'code' ? (
            // biome-ignore lint/a11y/useSemanticElements: a focusable drag handle, not a divider line
            <div
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize the demo"
              aria-valuenow={typeof frameHeight === 'number' ? frameHeight : undefined}
              title="Drag to resize the demo"
              tabIndex={0}
              onPointerDown={startResize}
              onKeyDown={resizeByKey}
              onDoubleClick={() => setDragHeight(null)}
              className="group/resize absolute inset-x-0 bottom-0 flex h-3 cursor-row-resize touch-none items-end justify-center pb-1 focus-visible:outline-none"
            >
              <span className="h-1 w-10 rounded-full bg-fd-border transition-colors group-hover/resize:bg-fd-primary/60 group-focus-visible/resize:bg-fd-primary" />
            </div>
          ) : null}
        </div>

        {hasCode && view !== 'preview'
          ? code(
              view === 'code' ? 'h-160 max-h-[70vh]' : 'mt-4',
              view === 'both' && codeHeight !== 'full' ? codeHeight : null,
            )
          : null}
      </div>

      <Dialog.Root open={isExpanded} onOpenChange={onExpandedChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
          <Dialog.Popup
            ref={popup}
            // Focus starts on the dialog, not on its first button, whose tooltip would show.
            initialFocus={popup}
            className="fixed inset-2 z-50 flex flex-col overflow-hidden rounded-xl border bg-fd-background text-fd-foreground shadow-2xl outline-none sm:inset-6"
          >
            <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
              <Dialog.Title className="me-2 font-semibold text-sm">{name}</Dialog.Title>
              <div className="min-w-0 flex-1">{bar(true)}</div>
            </div>
            {isExpanded ? (
              <ExpandedBody
                view={hasCode ? expandedView : 'preview'}
                demo={stage(
                  <DemoFrame
                    key={`expanded-${frameKey}`}
                    src={frameSrc}
                    title={`${name} demo`}
                    theme={theme}
                    initialContent={restore}
                    onBridge={onExpandedBridge}
                    onNoBridge={onNoBridge}
                  />,
                  'h-full',
                )}
                code={hasCode ? code('h-full rounded-none border-0') : null}
              />
            ) : null}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

/** The demo and its code side by side. The line between them moves with the pointer or the arrow keys. */
function ExpandedBody({
  view,
  demo,
  code,
}: {
  view: View;
  demo: ReactNode;
  code: ReactNode | null;
}) {
  const [codeShare, setCodeShare] = useState(40);
  const container = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const box = container.current?.getBoundingClientRect();
    if (!box) return;
    const share = ((clientX - box.left) / box.width) * 100;
    setCodeShare(Math.min(80, Math.max(20, share)));
  };

  // Code on the left, the demo on the right. On narrow screens the demo comes first.
  return (
    <div ref={container} className="flex min-h-0 flex-1 flex-col-reverse md:flex-row">
      {code && view !== 'preview' ? (
        <>
          <div
            className={cn(
              'min-h-0',
              view === 'code' ? 'flex-1' : 'max-md:h-2/5 md:w-(--code-share) md:shrink-0',
            )}
            style={{ '--code-share': `${codeShare}%` } as CSSProperties}
          >
            {code}
          </div>
          {view === 'code' ? null : (
            // biome-ignore lint/a11y/useSemanticElements: a focusable drag handle, not a divider line
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize the code"
              aria-valuenow={Math.round(codeShare)}
              aria-valuemin={20}
              aria-valuemax={80}
              tabIndex={0}
              onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
              onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) moveTo(event.clientX);
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') setCodeShare((share) => Math.min(80, share + 5));
                if (event.key === 'ArrowLeft') setCodeShare((share) => Math.max(20, share - 5));
              }}
              className="hidden w-1.5 shrink-0 cursor-col-resize bg-fd-border transition-colors hover:bg-fd-primary/60 focus-visible:bg-fd-primary focus-visible:outline-none md:block"
            />
          )}
        </>
      ) : null}
      {/* Hidden, not removed, in the Code view, so the demo keeps what the reader typed. */}
      <div className={cn('min-h-0 min-w-0 flex-1 [&>div]:h-full', view === 'code' && 'hidden')}>
        {demo}
      </div>
    </div>
  );
}
