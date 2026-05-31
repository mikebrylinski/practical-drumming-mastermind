export type DrummerLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Touring/Professional'

export type Seriousness = 'Curious' | 'Committed' | 'All In'

export type BookCallAnswers = {
  level: DrummerLevel | ''
  goals: string[]
  goalsOther: string
  frustration: string
  seriousness: Seriousness | ''
  fullName: string
  email: string
  instagram: string
}

export const initialBookCallAnswers: BookCallAnswers = {
  level: '',
  goals: [],
  goalsOther: '',
  frustration: '',
  seriousness: '',
  fullName: '',
  email: '',
  instagram: '',
}

export type BookCallPhase = 'intro' | 'schedule' | 'questions' | 'confirmed'
