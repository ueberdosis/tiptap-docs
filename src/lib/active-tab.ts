function inScope(pathname: string, scope: string) {
  return pathname === scope || pathname.startsWith(`${scope}/`);
}

/** The tab with the longest scope that `pathname` starts with, else the first tab. */
export function pickTab<T extends { scope: string }>(tabs: T[], pathname: string): T {
  return (
    tabs
      .filter((tab) => inScope(pathname, tab.scope))
      .reduce<T | undefined>(
        (best, tab) => (!best || tab.scope.length > best.scope.length ? tab : best),
        undefined,
      ) ?? tabs[0]
  );
}
