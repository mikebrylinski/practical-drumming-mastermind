import { Reveal } from '../Reveal'
import { pageWrapClass, SectionShell } from '../SectionShell'

const testimonials = [
  {
    quote:
      "I've played with a lot of drummers. But when I get to look back through the cymbals and see Mike, that makes me the happiest. He's simply my favorite, and one of the best there is.",
    name: 'Nathan December',
    role: 'Touring guitarist · REM & Goo Goo Dolls',
  },
  {
    quote:
      "I've worked with Mike on the road and in the studio. A musician's musician, consistent and professional. He is wicked smart, dedicated to the art, and a gifted communicator.",
    name: 'Cory Stone',
    role:
      'Recording & live sound engineer · Rickie Lee Jones, Pam Tillis, Lucinda Williams, Steve Earle, Olivia Newton-John, Randy Travis, Tanya Tucker',
  },
  {
    quote:
      "I've had the pleasure of touring with Mike for over 5 years. His professionalism and nature towards music really shows in his playing. He has a deep knowledge of his instrument and will be a great mentor for anyone deciding on their musical journey.",
    name: 'Dino Villanueva',
    role: 'Bass player · Tanya Tucker, Casey James, Runaway Jane',
  },
  {
    quote:
      "I've played in a few projects with Mike. As a bass player, it is crucial to establish a strong connection and lock in with your drummer and avoid constantly having to listen for random time fluctuations, which destroys the foundation of a song. Mike is one of the few drummers I've played with who is so solid that you can just let your feel guide you.",
    name: 'Rob Cooper',
    role: 'Bass player · Pete Droge, Forty Marshas',
  },
  {
    quote:
      "I've known Mike for over 40 years, and he has always been one of the most talented, disciplined, resourceful, and dedicated musicians I've known. Mike plays the perfect part for the song and makes everyone around him sound better. This ability has earned him not only the drummer spot, but also the Musical Director role for national acts.",
    name: 'Mike Daane',
    role: 'Bass player · Andy Timmons · Audio engineer & producer',
  },
  {
    quote:
      "Music is an agreement to show up in time and space with other musicians and create something bigger than any one person could do on their own. Having Mike as part of our band family was an incredible experience. He brought more than talent, he brought wisdom and kindness. Mike is a natural teacher. I learned so much from him in my time playing music with him, and I know I can speak for my band who all would say the same.",
    name: 'Malarie McConaha',
    role: 'Singer · songwriter · The FBR',
  },
] as const

export function TestimonialsSection() {
  return (
    <SectionShell alt className="border-t border-white/[0.06] lg:py-24">
      <Reveal className="w-full text-center">
        <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
          From the community
        </p>
        <h2 className="mt-2 font-bebas text-[clamp(2rem,5vw,3rem)] leading-[0.95] tracking-[0.03em] text-mist">
          What People Are Saying
        </h2>
      </Reveal>
      <div
        className={`${pageWrapClass} mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3`}
      >
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <blockquote className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal/60 p-6 ring-1 ring-white/[0.04]">
              <p className="flex-1 font-garamond text-base leading-relaxed text-mist/70">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-5 border-t border-white/10 pt-4">
                <p className="font-garamond text-sm font-medium text-mist">{t.name}</p>
                <p className="font-garamond text-xs text-mist/45">{t.role}</p>
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
