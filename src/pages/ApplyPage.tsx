import { BookCallFlow } from '../components/book-call/BookCallFlow'
import { Seo } from '../components/Seo'

export function ApplyPage() {
  return (
    <>
      <Seo
        title="Book a Call"
        description="Book a private 45-minute fit call with Mike Malinin to see if the Practical Drumming Mastermind is the right fit for your drumming goals."
        canonicalPath="/apply"
      />
      <BookCallFlow />
    </>
  )
}
