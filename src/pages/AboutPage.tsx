import { Reveal } from '../components/Reveal'

export function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">About</p>
        <h1 className="mt-4 font-bebas text-5xl text-mist md:text-6xl lg:text-7xl">
          About Mike Malinin
        </h1>
      </Reveal>
      <Reveal delay={0.06} className="mt-12 space-y-6 font-garamond text-lg leading-relaxed text-mist/75 md:text-xl">
        <p>
          Mike Malinin is a professional drummer best known for his long-standing career with the
          Goo Goo Dolls, one of the most successful modern rock bands of the last three decades.
        </p>
        <p>
          He performed on multi-platinum records and helped shape the sound behind iconic songs
          including “Iris,” a Billboard #1 hit and one of the most played rock songs of its
          generation.
        </p>
        <p>
          Mike has toured internationally for over 20 years, performing in arenas, amphitheaters,
          and major festival stages around the world. His drumming can also be heard across film
          and television placements including major Hollywood productions.
        </p>
      </Reveal>
      <Reveal delay={0.12} className="mt-10 space-y-6 border-l border-gold/35 pl-8 font-garamond text-lg italic leading-relaxed text-mist/70 md:text-xl">
        <p>But Mike’s real expertise goes beyond performance.</p>
        <p>
          It’s understanding how to serve a song.
          <br />
          How to hold back.
          <br />
          How to play with intention.
          <br />
          How to make music feel undeniable.
        </p>
        <p className="not-italic text-gold/90">
          That philosophy is the foundation of Practical Drumming: Mastermind Club.
        </p>
      </Reveal>
    </article>
  )
}
