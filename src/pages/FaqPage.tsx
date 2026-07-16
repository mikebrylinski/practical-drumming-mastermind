import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'

const faqs = [
  {
    q: 'What happens on the fit call?',
    a: 'It’s a private 45-minute video call with Mike. You’ll talk through where you are as a player, what you want next, and whether the Mastermind is the right room — with no pressure to join on the spot.',
  },
  {
    q: 'Is this a beginner course?',
    a: 'No. This is a mentorship experience designed for drummers who already play and want to refine musicality, feel, and professional-level decision making.',
  },
  {
    q: 'Is this pre-recorded videos?',
    a: 'No. This is a curated mastermind experience led by Mike Malinin with direct mentorship components.',
  },
  {
    q: 'Why is membership limited?',
    a: 'To ensure a high-touch, personal experience for each member.',
  },
  {
    q: 'What makes this different from other drum education platforms?',
    a: 'Most platforms focus on technique volume. This focuses on musicality, feel, and real-world professional experience from arena-level touring.',
  },
  {
    q: 'How much time do I need?',
    a: 'This is flexible. It is designed for serious musicians integrating growth into their existing playing schedule.',
  },
]

export function FaqPage() {
  return (
    <article className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Seo
        title="FAQ"
        description="Frequently asked questions about the Practical Drumming Mastermind Club with Mike Malinin."
        canonicalPath="/faq"
      />
      <Reveal>
        <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">FAQ</p>
        <h1 className="mt-4 font-bebas text-4xl text-mist md:text-5xl lg:text-6xl">
          Questions
        </h1>
      </Reveal>
      <dl className="mt-16 space-y-12">
        {faqs.map(({ q, a }, i) => (
          <Reveal key={q} delay={i * 0.05}>
            <div>
              <dt className="font-garamond text-lg text-gold md:text-xl">{q}</dt>
              <dd className="mt-3 font-garamond text-base leading-relaxed text-mist/70 md:text-lg">
                {a}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </article>
  )
}
