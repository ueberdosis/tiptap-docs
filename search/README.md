# Search ranking

The docs search runs on Typesense. The DocSearch scraper builds the index from the live site (`docsearch.config.json`, `.github/workflows/docsearch.yml`), and the site queries it with the parameters in `src/utils/searchParameters.ts`.

| File                            | What it does                                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/utils/searchParameters.ts` | Weights per field and sorting. The page title counts most.                                                                                                                                                         |
| `docsearch.config.json`         | `page_rank` per URL prefix in `start_urls`. The first prefix that matches wins, so `https://tiptap.dev/` stays last. Negative ranks put Legacy pages and changelogs after current pages of the same match quality. |
| `search/synonyms.json`          | Synonyms in Typesense's format. Entries with a `root` are one-way: a query for the root also finds the synonyms, not the other way round.                                                                          |
| `search/ranking-tests.json`     | Real queries and the page each should show in the top 3.                                                                                                                                                           |

## Check the ranking

```bash
TYPESENSE_HOST=… TYPESENSE_SEARCH_API_KEY=… pnpm search:check
```

A search-only key is enough. To try other weights before changing them, set `NEXT_PUBLIC_SEARCH_WEIGHTS` or `NEXT_PUBLIC_SEARCH_SORT_BY` for the run. Add a query to the test set whenever a reader can't find a page.

## Update the synonyms

```bash
TYPESENSE_HOST=… TYPESENSE_ADMIN_API_KEY=… pnpm search:synonyms
```

Needs a key that may write synonyms. The scraper carries synonyms over to each new collection, so run it again only when the file changes. `--dry-run` shows what it would write.

## Change `page_rank`

It takes effect with the next scraper run after the change is on `main`.
