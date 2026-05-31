export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

/** Resolve a cohort's live room name, falling back to a slug of its name. */
export function cohortRoomName(cohort: { livekit_room_name?: string | null; name: string }): string {
  return cohort.livekit_room_name || `cohort-${slugify(cohort.name)}`
}
