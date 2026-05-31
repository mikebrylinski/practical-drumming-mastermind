// Server-side mirror of src/lib/crm/scoring.ts weights (Node/serverless context).
export const SCORE_WEIGHTS = {
  page_visit: 10,
  booking_click: 40,
  form_submit: 60,
  booking_created: 60,
  application_update: 0,
  contacted: 0,
}

export function scoreForEvent(type) {
  return SCORE_WEIGHTS[type] ?? 0
}
