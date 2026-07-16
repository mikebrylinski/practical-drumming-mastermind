export type DrummerLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Touring/Professional'

export type BookCallAnswers = {
  fullName: string
  email: string
  instagram: string
  level: DrummerLevel | ''
  goals: string[]
  goalsOther: string
  frustration: string
}

export const initialBookCallAnswers: BookCallAnswers = {
  fullName: '',
  email: '',
  instagram: '',
  level: '',
  goals: [],
  goalsOther: '',
  frustration: '',
}

/** Total question steps in the book-a-call questionnaire (0-indexed max = QUESTION_STEP_COUNT - 1). */
export const QUESTION_STEP_COUNT = 4

export type BookCallPhase = 'intro' | 'schedule' | 'questions' | 'confirmed'
