import type { LeadEventType } from '../supabase/types'

const VISITOR_KEY = 'pd_visitor_id'
const VISIT_COUNT_KEY = 'pd_visit_count'

// Current authenticated user id, kept in sync by AuthProvider so anonymous and
// known leads can be associated server-side.
let currentUserId: string | null = null

export function setLeadUserId(id: string | null) {
  currentUserId = id
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

/** Fire-and-forget lead event. Never throws; safe to call from any handler. */
export function trackLeadEvent(
  type: LeadEventType | string,
  metadata: Record<string, unknown> = {},
) {
  try {
    const body = JSON.stringify({
      type,
      path: typeof window !== 'undefined' ? window.location.pathname : null,
      metadata,
      visitorId: getVisitorId(),
      userId: currentUserId,
    })
    void fetch('/api/leads/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* no-op */
  }
}
