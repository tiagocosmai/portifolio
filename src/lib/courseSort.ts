const YEAR_RE = /\b(19|20)\d{2}\b/g;

/** Highest 19xx/20xx year found in the line (e.g. course or event year). */
export function extractLatestYearFromCoursePt(pt: string): number {
  let max = 0;
  const s = pt.matchAll(YEAR_RE);
  for (const m of s) {
    const y = Number.parseInt(m[0], 10);
    if (y > max) max = y;
  }
  return max;
}

/** Newest first; ties broken by Portuguese string order of `pt`. */
export function sortCourseItemsByYearDesc<T extends { pt: string }>(
  items: readonly T[],
): T[] {
  return [...items].sort((a, b) => {
    const ya = extractLatestYearFromCoursePt(a.pt);
    const yb = extractLatestYearFromCoursePt(b.pt);
    if (yb !== ya) return yb - ya;
    return a.pt.localeCompare(b.pt, "pt");
  });
}
