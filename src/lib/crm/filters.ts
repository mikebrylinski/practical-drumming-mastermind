import type { ApplicationStatus } from '../supabase/types'
import type { Stage } from './scoring'
import type { CRMLead } from './types'

export type LeadFilterState = {
  scoreMin: number
  scoreMax: number
  stage: 'all' | Stage
  booking: 'all' | 'has' | 'none'
  application: 'all' | ApplicationStatus
  activity: 'all' | '24h' | '7d' | 'stale'
}

export const defaultFilters: LeadFilterState = {
  scoreMin: 0,
  scoreMax: 100,
  stage: 'all',
  booking: 'all',
  application: 'all',
  activity: 'all',
}

const DAY = 86_400_000

export function applyFilters(leads: CRMLead[], f: LeadFilterState): CRMLead[] {
  const now = Date.now()
  return leads.filter((lead) => {
    if (lead.intentScore < f.scoreMin || lead.intentScore > f.scoreMax) return false
    if (f.stage !== 'all' && lead.stage !== f.stage) return false

    if (f.booking === 'has' && !lead.bookingStatus) return false
    if (f.booking === 'none' && lead.bookingStatus) return false

    if (f.application !== 'all' && lead.applicationStatus !== f.application) return false

    if (f.activity !== 'all') {
      const age = now - new Date(lead.lastActivity).getTime()
      if (f.activity === '24h' && age > DAY) return false
      if (f.activity === '7d' && age > 7 * DAY) return false
      if (f.activity === 'stale' && age <= 7 * DAY) return false
    }
    return true
  })
}
