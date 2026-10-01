# MDX loading checks

PR #592 removes unnecessary MDX work from page rendering. The footer receives the current file path instead of reading and sending metadata for every page. Copy markdown converts the rendered article when clicked, so the server renders the article once. Extension, UI component, and incident lists read YAML headers in 4 KiB chunks, one file at a time. Headers above 64 KiB fail, including headers without a closing delimiter.

## Measurements

Measured locally on macOS with Node 24.21.0 and Next 16.3.6. These values describe this workload, not a memory guarantee for every deployment.

The before/after run used `next start` and 100 sequential requests to `/editor/extensions/overview`, in five groups of 20. The baseline already used the new header reader. This comparison measures the additional footer and copy changes.

| Metric                               | Before footer/copy fix | After     |
| ------------------------------------ | ---------------------- | --------- |
| HTML bytes per response              | 708,991                | 277,983   |
| Mean request time in the final group | 65.2 ms                | 16.0 ms   |
| Process RSS after 100 requests       | 386.8 MiB              | 343.5 MiB |

The standalone benchmark warms five routes, then sends 500 mixed requests with five requests at a time. It forces garbage collection between groups to separate retained heap from temporary allocations. Retained heap rises from 57.5 MiB after 25 requests to 59.4 MiB after 500. Total RSS reaches 298.1 MiB. A further 20 plain-page requests read zero raw MDX files.

The benchmark fails if retained heap grows by 16 MiB after the first measured group, if a plain page reads raw MDX, or if a response contains the old full metadata payload. This is a regression check, not proof that every possible memory issue is gone. Next and V8 still allocate memory and retain visited compiled page modules.

## Verification

- `pnpm test`: seven tests pass, including parity against all 695 checked-in MDX headers, UTF-8 and chunk boundaries, file cleanup, card metadata, incident sorting, and bounded reads.
- `SKIP_CHANGELOGS=1 pnpm build`: passes using existing generated changelog data. This also runs content-date generation. Fresh changelog fetching failed because Node could not resolve GitHub in this environment.
- `pnpm test:runtime`: homepage, direct and index routes, edit links, 404, and markdown responses pass against the standalone server.
- The same runtime tests pass against `next dev`. Dev reports ready in 169 ms in this local run.
- Changed-file ESLint check: no errors, one existing image warning in Layout.
- Browser check: the extension overview copy output is identical before and after, including card links. UI component copy includes its title and component links.

Run the standalone memory check after building:

```sh
pnpm benchmark:content
```

The runtime tests expect a server at `http://127.0.0.1:3145`. Set `DOCS_TEST_URL` to use another server. The memory benchmark starts and stops its own standalone server on port 3146. Set `DOCS_BENCH_PORT` to use another port.
