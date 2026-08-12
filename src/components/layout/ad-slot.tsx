/**
 * Reserved space for a display ad unit. Renders nothing visible until a real
 * ad script fills it, so empty pages stay clean.
 */
export function AdSlot({
  id,
  format = "leaderboard",
}: {
  id: string;
  format?: "leaderboard" | "rectangle" | "inline";
}) {
  // Collapsed until a real ad script injects content: an empty box would just
  // leave a hole in the page.
  return <div data-ad-slot={id} data-ad-format={format} aria-hidden="true" className="w-full empty:hidden" />;
}
