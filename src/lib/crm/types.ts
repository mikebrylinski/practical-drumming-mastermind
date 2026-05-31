import type { ApplicationStatus, BookingStatus, LeadEvent, Role } from '../supabase/types'
import type { Stage } from './scoring'

export type CRMLead = {
  userId: string
  name: string
  email: string
  role: Role
  isAnonymous: boolean
  visitorId?: string | null

  intentScore: number
  stage: Stage

  lastActivity: string
  events: LeadEvent[]

  bookingStatus?: BookingStatus
  applicationStatus?: ApplicationStatus
  contacted?: boolean
  note?: string | null
}
