export type Role = 'admin' | 'member'

export type Profile = {
  id: string
  email: string
  full_name: string
  role: Role
  created_at?: string
}

export type Cohort = {
  id: string
  name: string
  description: string | null
  starts_at: string | null
  livekit_room_name: string | null
  created_at: string
}

export type Session = {
  id: string
  cohort_id: string | null
  title: string
  scheduled_at: string | null
  livekit_room_name: string | null
  created_at: string
}

export type ApplicationStatus = 'new' | 'contacted' | 'accepted' | 'rejected'

export type Application = {
  id: string
  user_id: string | null
  email: string | null
  full_name: string | null
  type: string | null
  answers: Record<string, unknown>
  status: ApplicationStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type AvailabilitySlot = {
  id: string
  slug: string
  starts_at: string
  ends_at: string
  is_booked: boolean
  created_by: string | null
  created_at: string
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

export type Booking = {
  id: string
  slot_id: string | null
  user_id: string | null
  name: string | null
  email: string | null
  livekit_room_name: string | null
  status: BookingStatus
  starts_at: string | null
  created_at: string
}

export type EmailLog = {
  id: string
  template: string
  to_email: string
  subject: string | null
  status: 'sent' | 'skipped' | 'error'
  provider_id: string | null
  error: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type LeadEventType =
  | 'page_visit'
  | 'booking_click'
  | 'form_submit'
  | 'application_update'
  | 'booking_created'
  | 'contacted'

export type LeadEvent = {
  id: string
  user_id: string | null
  visitor_id: string | null
  type: LeadEventType | string
  path: string | null
  metadata: Record<string, unknown>
  score_delta: number
  created_at: string
}
