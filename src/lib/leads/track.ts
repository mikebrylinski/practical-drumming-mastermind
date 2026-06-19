import type { LeadEventType } from '../supabase/types'

const VISITOR_KEY = 'pd_visitor_id'
const VISIT_COUNT_KEY = 'pd_visit_count'

/**
 * Kept for API compatibility with AuthProvider. Lead tracking is disabled, so
 * the user id is no longer retained or sent server-side.
 */
export function setLeadUserId(_id: string | null) {
  void _id
}

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return 'anonymous'
  }
}

export function incrementVisitCount(): number {
  try {
    const next = Number(localStorage.getItem(VISIT_COUNT_KEY) ?? '0') + 1
    localStorage.setItem(VISIT_COUNT_KEY, String(next))
    return next
  } catch {
    return 1
  }
}

/**
 * Lead tracking is currently disabled — CRM ingestion is turned off, so this is
 * a no-op and no longer POSTs to /api/leads/event. Re-enable by restoring the
 * fetch below if lead tracking is brought back.
 */
export function trackLeadEvent(
  _type: LeadEventType | string,
  _metadata: Record<string, unknown> = {},
) {
  void _type
  void _metadata
}
