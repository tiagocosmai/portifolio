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

/** Newest first. Talks given as speaker come before other items of the same year. */
export function sortCourseItemsByYearDesc<
  T extends { pt: string; role?: string },
>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const ya = extractLatestYearFromCoursePt(a.pt);
    const yb = extractLatestYearFromCoursePt(b.pt);
    if (yb !== ya) return yb - ya;
    const speakerA = a.role === "speaker" ? 0 : 1;
    const speakerB = b.role === "speaker" ? 0 : 1;
    if (speakerA !== speakerB) return speakerA - speakerB;
    return a.pt.localeCompare(b.pt, "pt");
  });
}
