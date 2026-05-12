import { Reveal } from '../components/Reveal'

const faqs = [
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
    <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">FAQ</p>
        <h1 className="mt-4 font-bebas text-5xl text-mist md:text-6xl lg:text-7xl">
          Questions
        </h1>
      </Reveal>
      <dl className="mt-16 space-y-12">
        {faqs.map(({ q, a }, i) => (
          <Reveal key={q} delay={i * 0.05}>
            <div>
              <dt className="font-garamond text-xl text-gold md:text-2xl">{q}</dt>
              <dd className="mt-4 font-garamond text-lg leading-relaxed text-mist/70 md:text-xl">
                {a}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </article>
  )
}
