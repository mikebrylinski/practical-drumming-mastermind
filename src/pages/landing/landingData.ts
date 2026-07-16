export type LandingFaq = { q: string; a: string }
export type LandingFeature = { title: string; body: string }

export type LandingPageData = {
  /** URL slug, mounted at the site root (e.g. "drum-lessons" -> /drum-lessons). */
  slug: string
  /** Primary + secondary keywords this page targets (used for internal notes only). */
  keywords: readonly string[]
  seoTitle: string
  seoDescription: string
  eyebrow: string
  h1Lead: string
  h1Highlight: string
  heroSubtitle: string
  intro: readonly string[]
  featuresTitle: string
  features: readonly LandingFeature[]
  audienceTitle: string
  audience: readonly string[]
  faqTitle: string
  faqs: readonly LandingFaq[]
  ctaTitle: string
  ctaBody: string
}

export const landingPages: readonly LandingPageData[] = [
  {
    slug: 'drum-lessons',
    keywords: ['drum lessons'],
    seoTitle: 'Drum Lessons With Mike Malinin — Online Mentorship',
    seoDescription:
      'Online drum lessons and live mentorship with Mike Malinin, former Goo Goo Dolls drummer. Focus on feel, musicality, and real-world professional skills.',
    eyebrow: 'Drum Lessons',
    h1Lead: 'Drum Lessons With',
    h1Highlight: 'Mike Malinin',
    heroSubtitle:
      'Live, online drum lessons and mentorship from a Diamond-certified, arena-touring professional.',
    intro: [
      'Most drum lessons bury you in isolated exercises and never connect them to real music. Practical Drumming is different — it is direct mentorship with Mike Malinin, the drummer behind billions of streams, focused on the things that actually make you sound professional: feel, dynamics, and playing for the song.',
      'Whether you are preparing for the studio, tightening your pocket, or finally pushing past a plateau, you get honest feedback and a clear path forward from someone who has performed on Diamond and platinum records and toured the world for two decades.',
    ],
    featuresTitle: 'What these drum lessons include',
    features: [
      {
        title: 'Live mentorship',
        body: 'Real-time guidance and feedback from Mike — not a library of pre-recorded videos you watch alone.',
      },
      {
        title: 'Feel over flash',
        body: 'Groove, dynamics, and timing are prioritized so your playing sounds musical, not mechanical.',
      },
      {
        title: 'Studio & stage ready',
        body: 'Learn how professionals prepare parts, track in the studio, and hold down a live show.',
      },
      {
        title: 'Small, focused group',
        body: 'A high-touch mastermind community where you are seen, heard, and pushed to grow.',
      },
    ],
    audienceTitle: 'Who these drum lessons are for',
    audience: [
      'Intermediate and advanced players who already have the basics down',
      'Gigging drummers who want a tighter, more professional pocket',
      'Musicians preparing for studio sessions or auditions',
      'Returning players ready to break through a plateau',
    ],
    faqTitle: 'Drum lessons — common questions',
    faqs: [
      {
        q: 'Are these drum lessons online or in person?',
        a: 'Lessons and mentorship happen online through live sessions, so you can learn directly from Mike Malinin from anywhere in the world.',
      },
      {
        q: 'Do I need to be an advanced drummer?',
        a: 'No, but this is best suited to players who already play. The focus is refining musicality, feel, and professional-level decision making rather than absolute beginner fundamentals.',
      },
      {
        q: 'Is this pre-recorded video courses?',
        a: 'No. This is a live mentorship experience led by Mike Malinin, with direct feedback on your playing.',
      },
      {
        q: 'How do I get started?',
        a: 'Book a call to see if the mastermind is the right fit, and we will map out where to take your drumming next.',
      },
    ],
    ctaTitle: 'Ready for drum lessons that actually move the needle?',
    ctaBody:
      'Book a call and learn directly from a drummer who has done it at the highest level.',
  },
  {
    slug: 'drum-classes',
    keywords: ['drum classes'],
    seoTitle: 'Online Drum Classes With a Pro Drummer | Mike Malinin',
    seoDescription:
      'Online drum classes led by Mike Malinin, former Goo Goo Dolls drummer. Live group mentorship built around real music, feel, and professional performance.',
    eyebrow: 'Drum Classes',
    h1Lead: 'Online Drum Classes With',
    h1Highlight: 'Mike Malinin',
    heroSubtitle:
      'Live group drum classes and mentorship led by a professional touring and recording drummer.',
    intro: [
      'Group drum classes can be inspiring — or a waste of time. The difference is who is leading the room. In the Practical Drumming mastermind, your classes are led by Mike Malinin, a drummer who has performed on some of the most recognizable rock recordings of the last three decades.',
      'These are not generic, one-size-fits-all classes. Each session is built around real musical situations, giving you the context professionals actually use to make songs feel great.',
    ],
    featuresTitle: 'What makes these drum classes different',
    features: [
      {
        title: 'Led by a working pro',
        body: 'Every class is guided by Mike Malinin — arena tours, platinum records, and decades of studio work.',
      },
      {
        title: 'Music-first curriculum',
        body: 'Concepts are taught in the context of real songs, so your skills transfer straight to the kit.',
      },
      {
        title: 'Live and interactive',
        body: 'Ask questions, get feedback, and learn from the breakthroughs of other serious drummers.',
      },
      {
        title: 'Curated, not crowded',
        body: 'Membership is intentionally limited to keep the classes personal and high-value.',
      },
    ],
    audienceTitle: 'Who should join these drum classes',
    audience: [
      'Drummers who learn best in a live, interactive setting',
      'Players who want accountability and a community of peers',
      'Musicians who want pro context, not just isolated licks',
      'Anyone tired of passive video courses',
    ],
    faqTitle: 'Drum classes — common questions',
    faqs: [
      {
        q: 'Are the drum classes live?',
        a: 'Yes. Classes are delivered as live, interactive online sessions led by Mike Malinin, not pre-recorded lectures.',
      },
      {
        q: 'How big are the classes?',
        a: 'Membership is intentionally limited so every class stays personal and each drummer gets attention.',
      },
      {
        q: 'What level are the classes aimed at?',
        a: 'They are designed for drummers who already play and want to grow their musicality, feel, and professionalism.',
      },
      {
        q: 'How can I join?',
        a: 'Book a call to check availability and confirm the mastermind classes are right for your goals.',
      },
    ],
    ctaTitle: 'Join drum classes led by a real professional',
    ctaBody: 'Spots are limited. Book a call to see if the mastermind is right for you.',
  },
  {
    slug: 'learn-drums',
    keywords: ['learn drums', 'drum learn'],
    seoTitle: 'Learn Drums From a Pro | Mike Malinin — Practical Drumming',
    seoDescription:
      'Learn drums the right way with mentorship from Mike Malinin, former Goo Goo Dolls drummer. Build feel, groove, and professional skills through live guidance.',
    eyebrow: 'Learn Drums',
    h1Lead: 'Learn Drums From',
    h1Highlight: 'Mike Malinin',
    heroSubtitle:
      'Skip years of trial and error — learn drums directly from a Diamond-certified professional.',
    intro: [
      'The fastest way to learn drums is to learn from someone who has already done it at the highest level. Instead of piecing together random lessons from the internet, you get a clear, mentored path from Mike Malinin — a drummer who has played on billions of streams worth of music.',
      'You will learn what actually matters: how to lock in a groove, control dynamics, serve the song, and carry yourself like a professional behind the kit.',
    ],
    featuresTitle: 'What you learn',
    features: [
      {
        title: 'Rock-solid groove',
        body: 'Develop the timing and pocket that make drummers get called back for gigs and sessions.',
      },
      {
        title: 'Dynamics & control',
        body: 'Learn to play with intensity without volume — the hallmark of a mature, musical drummer.',
      },
      {
        title: 'Song construction',
        body: 'Understand how drum parts are built to serve the music, from verse to chorus to fill.',
      },
      {
        title: 'Pro mindset',
        body: 'Preparation, professionalism, and the habits that separate hobbyists from working players.',
      },
    ],
    audienceTitle: 'Perfect if you want to',
    audience: [
      'Finally build the groove and feel you have been chasing',
      'Learn from a proven professional instead of guessing',
      'Turn scattered practice into real, measurable progress',
      'Play with confidence in any musical situation',
    ],
    faqTitle: 'Learn drums — common questions',
    faqs: [
      {
        q: 'Can I learn drums online with this?',
        a: 'Yes. Everything is delivered online through live mentorship, so you can learn drums from Mike Malinin no matter where you live.',
      },
      {
        q: 'How fast will I improve?',
        a: 'Progress depends on your effort, but focused mentorship from a professional removes guesswork and accelerates growth dramatically.',
      },
      {
        q: 'Is this only for rock drummers?',
        a: 'Mike has toured and recorded across rock and Grammy-winning country, and the principles of feel and musicality apply to any style.',
      },
      {
        q: 'How do I begin?',
        a: 'Book a call and we will talk through your goals and the best path to reach them.',
      },
    ],
    ctaTitle: 'Learn drums from someone who has lived it',
    ctaBody: 'Book a call and start your path with a professional mentor.',
  },
  {
    slug: 'learn-to-play-drums',
    keywords: ['learn playing drums', 'learn to play drums'],
    seoTitle: 'Learn to Play Drums the Right Way | Mike Malinin',
    seoDescription:
      'Learn to play drums with live mentorship from Mike Malinin, professional drummer for the Goo Goo Dolls and Tanya Tucker. Build real skills that transfer to music.',
    eyebrow: 'Learn to Play Drums',
    h1Lead: 'Learn to Play Drums',
    h1Highlight: 'the Right Way',
    heroSubtitle:
      'A mentored path to playing real music — guided by a professional touring and recording drummer.',
    intro: [
      'Learning to play drums is about far more than speed and chops. It is about making music feel good — and that is exactly what Mike Malinin has done on stages and records heard by millions around the world.',
      'Through Practical Drumming, you learn to play drums with purpose: building the groove, feel, and musical instincts that make people want to keep listening.',
    ],
    featuresTitle: 'How you learn to play',
    features: [
      {
        title: 'Play real music',
        body: 'Every concept ties back to actual songs, so what you practice shows up in your playing.',
      },
      {
        title: 'Build feel first',
        body: 'Timing, groove, and dynamics come first — the foundation every great drummer stands on.',
      },
      {
        title: 'Guided by a pro',
        body: 'Direct mentorship from Mike Malinin keeps you on the fastest, most effective path.',
      },
      {
        title: 'Confidence behind the kit',
        body: 'Learn to trust your playing whether you are jamming, gigging, or recording.',
      },
    ],
    audienceTitle: 'This is for you if you want to',
    audience: [
      'Move beyond bedroom practice and play real music',
      'Develop feel and groove instead of just technique',
      'Learn from a professional rather than trial and error',
      'Build lasting confidence behind the kit',
    ],
    faqTitle: 'Learning to play drums — common questions',
    faqs: [
      {
        q: 'Do I need my own drum kit?',
        a: 'Regular access to a kit or practice pad helps you apply what you learn, but much of the mentorship focuses on musical concepts you can work on anywhere.',
      },
      {
        q: 'Is this suitable if I already play a little?',
        a: 'Yes. This is ideal for players who can already play and want to learn to play with real feel, musicality, and professionalism.',
      },
      {
        q: 'Is it all online?',
        a: 'Yes, the mentorship and sessions are delivered live online with Mike Malinin.',
      },
      {
        q: 'What is the first step?',
        a: 'Book a call to talk through your goals and see if the mastermind is the right fit.',
      },
    ],
    ctaTitle: 'Start learning to play drums with a pro',
    ctaBody: 'Book a call and get a clear path from a world-class drummer.',
  },
  {
    slug: 'drum-instructors',
    keywords: ['drum instructors'],
    seoTitle: 'Drum Instructor With Pro Credits | Mike Malinin',
    seoDescription:
      'Learn from a drum instructor who has actually done it — Mike Malinin, former Goo Goo Dolls drummer. Live online instruction focused on real musical results.',
    eyebrow: 'Drum Instructors',
    h1Lead: 'A Drum Instructor',
    h1Highlight: "Who's Toured the World",
    heroSubtitle:
      'Not a hobbyist teacher — instruction from a drummer with Diamond records and decades on the road.',
    intro: [
      'The best drum instructors do not just know the material — they have lived it. Mike Malinin spent nearly two decades touring internationally and recording platinum albums, and now he brings that experience directly to serious drummers.',
      'When you learn from an instructor at this level, you get more than exercises. You get the real-world context, musical judgment, and professional standards that only come from doing the work on the biggest stages.',
    ],
    featuresTitle: 'What sets this instructor apart',
    features: [
      {
        title: 'Proven track record',
        body: 'Recordings with billions of streams, Diamond and platinum certifications, and world tours.',
      },
      {
        title: 'Real-world context',
        body: 'Instruction rooted in actual touring, recording, and professional performance experience.',
      },
      {
        title: 'Direct feedback',
        body: 'Personal guidance on your playing, not generic advice aimed at everyone at once.',
      },
      {
        title: 'Industry insight',
        body: 'Learn how the professional music world really works, from auditions to studio sessions.',
      },
    ],
    audienceTitle: 'Ideal for drummers who want',
    audience: [
      'An instructor with genuine professional credits',
      'Feedback grounded in real touring and recording experience',
      'Guidance on both playing and the music industry',
      'A mentor invested in their long-term growth',
    ],
    faqTitle: 'Drum instructor — common questions',
    faqs: [
      {
        q: 'Who is the instructor?',
        a: 'Mike Malinin — a professional drummer and educator best known as the drummer for the Goo Goo Dolls (1995–2013) and bandleader for Tanya Tucker.',
      },
      {
        q: 'Do I get direct access to the instructor?',
        a: 'Yes. The mastermind is built around direct mentorship and feedback from Mike, not a faceless course.',
      },
      {
        q: 'What experience level does the instructor teach?',
        a: 'Instruction is aimed at drummers who already play and want to reach a higher, more professional level.',
      },
      {
        q: 'How do I connect with the instructor?',
        a: 'Book a call to speak about your goals and confirm the mastermind is a good fit.',
      },
    ],
    ctaTitle: 'Learn from a drum instructor who has done it',
    ctaBody: 'Book a call and get direct instruction from a proven professional.',
  },
  {
    slug: 'drum-teacher',
    keywords: ['drum teacher'],
    seoTitle: 'Drum Teacher You Can Actually Learn From | Mike Malinin',
    seoDescription:
      'A drum teacher with real credits: Mike Malinin, professional drummer for the Goo Goo Dolls and Tanya Tucker. Live online mentorship for serious drummers.',
    eyebrow: 'Drum Teacher',
    h1Lead: 'Your Drum Teacher:',
    h1Highlight: 'Mike Malinin',
    heroSubtitle:
      'Learn from a drum teacher who has performed on Diamond records and toured the world.',
    intro: [
      'A great drum teacher changes everything — the right guidance can save you years of frustration. Mike Malinin has spent a career on the road and in the studio, and now he teaches drummers how to play with the feel and musicality that get you noticed.',
      'This is teaching built on experience, not theory. You learn the same principles Mike used to anchor hit songs and command arena stages, adapted directly to your own playing.',
    ],
    featuresTitle: 'What you get from this teacher',
    features: [
      {
        title: 'Experience-based teaching',
        body: 'Lessons drawn from decades of real touring, recording, and performance.',
      },
      {
        title: 'Honest, useful feedback',
        body: 'Clear guidance on what to fix and how to fix it, so you keep improving.',
      },
      {
        title: 'Musical focus',
        body: 'Groove, feel, and dynamics are taught as the foundation of great drumming.',
      },
      {
        title: 'A mentor, not just a teacher',
        body: 'Ongoing support and community, not a one-and-done lesson you forget by next week.',
      },
    ],
    audienceTitle: 'A great fit if you want',
    audience: [
      'A teacher who has actually worked as a professional',
      'Practical, no-nonsense feedback on your playing',
      'To grow your musicality, not just your speed',
      'A long-term mentor invested in your progress',
    ],
    faqTitle: 'Drum teacher — common questions',
    faqs: [
      {
        q: 'What makes Mike a good drum teacher?',
        a: 'He teaches from a career of professional touring and recording, focusing on the musical skills that matter most rather than isolated technique.',
      },
      {
        q: 'Are lessons one-on-one?',
        a: 'The mastermind blends direct mentorship with a small, curated community so you get personal feedback and peer learning.',
      },
      {
        q: 'Is this for beginners?',
        a: 'It is best for drummers who already play and want to level up their feel, musicality, and professionalism.',
      },
      {
        q: 'How do I start lessons?',
        a: 'Book a call to talk through your goals and see if the mastermind is right for you.',
      },
    ],
    ctaTitle: 'Find a drum teacher worth learning from',
    ctaBody: 'Book a call and learn directly from a world-class professional.',
  },
  {
    slug: 'drum-teaching',
    keywords: ['drum teaching', 'drums teaching'],
    seoTitle: 'Drum Teaching That Transfers to Real Music | Mike Malinin',
    seoDescription:
      'Drum teaching from Mike Malinin, professional touring and recording drummer. Live mentorship built around feel, groove, and real-world musicianship.',
    eyebrow: 'Drum Teaching',
    h1Lead: 'Drum Teaching From',
    h1Highlight: 'a Working Pro',
    heroSubtitle:
      'A teaching approach built on real music, real gigs, and real studio experience.',
    intro: [
      'A lot of drum teaching stops at exercises and never connects to actual music. Mike Malinin takes the opposite approach — his teaching is built entirely around making music feel good, drawn from a career of professional touring and recording.',
      'The result is teaching that transfers. Everything you work on is tied to how drums function in real songs, so your progress shows up the moment you sit down at the kit.',
    ],
    featuresTitle: 'The teaching philosophy',
    features: [
      {
        title: 'Music before mechanics',
        body: 'Teaching starts with feel and groove — the qualities that make drumming musical.',
      },
      {
        title: 'Context, not just content',
        body: 'You learn why parts work, so you can make great choices in any song.',
      },
      {
        title: 'Real-world standards',
        body: 'Teaching reflects the professionalism expected on tours and in studios.',
      },
      {
        title: 'Feedback loops',
        body: 'Direct feedback keeps your practice pointed at what will actually help you improve.',
      },
    ],
    audienceTitle: 'This teaching is for',
    audience: [
      'Drummers frustrated by exercise-only instruction',
      'Players who want their practice to translate to real music',
      'Musicians seeking professional standards and context',
      'Serious drummers ready to commit to growth',
    ],
    faqTitle: 'Drum teaching — common questions',
    faqs: [
      {
        q: 'How is this drum teaching structured?',
        a: 'It is a live mentorship experience led by Mike Malinin, combining direct teaching, feedback, and a curated community of serious drummers.',
      },
      {
        q: 'What does the teaching focus on?',
        a: 'Feel, groove, dynamics, song construction, and the professional mindset — the skills that make drumming musical and reliable.',
      },
      {
        q: 'Is the teaching online?',
        a: 'Yes, all teaching and mentorship is delivered live online so you can take part from anywhere.',
      },
      {
        q: 'How do I get involved?',
        a: 'Book a call to discuss your goals and confirm the mastermind is the right fit.',
      },
    ],
    ctaTitle: 'Experience drum teaching that actually transfers',
    ctaBody: 'Book a call and learn from a drummer who has done it at the highest level.',
  },
  {
    slug: 'drum-schools',
    keywords: ['drum schools'],
    seoTitle: 'Beyond Drum Schools — Real Mentorship | Mike Malinin',
    seoDescription:
      'An alternative to traditional drum schools: live mentorship with Mike Malinin, former Goo Goo Dolls drummer. Learn from real touring and recording experience.',
    eyebrow: 'Drum Schools',
    h1Lead: 'Beyond Drum Schools:',
    h1Highlight: 'Real Mentorship',
    heroSubtitle:
      'Get what most drum schools cannot offer — direct mentorship from a professional who has lived it.',
    intro: [
      'Traditional drum schools can teach you the fundamentals, but they rarely give you access to someone who has performed on Diamond records and toured the world. Practical Drumming was built to fill that gap.',
      'Instead of a rigid, generic curriculum, you get personal mentorship from Mike Malinin and a community of serious drummers — an experience closer to learning from a mentor than sitting in a classroom.',
    ],
    featuresTitle: 'Why choose this over a typical drum school',
    features: [
      {
        title: 'Access to a real pro',
        body: 'Learn from Mike Malinin directly, not a rotating roster of part-time instructors.',
      },
      {
        title: 'Flexible and online',
        body: 'No commuting or fixed semesters — mentorship fits around your life and schedule.',
      },
      {
        title: 'Community of peers',
        body: 'Grow alongside other committed drummers in a curated mastermind environment.',
      },
      {
        title: 'Career-relevant insight',
        body: 'Understand the real music industry from someone who has navigated it at the top.',
      },
    ],
    audienceTitle: 'Consider this if you want',
    audience: [
      'Mentorship instead of a generic school curriculum',
      'The flexibility of learning online',
      'Direct access to a professional drummer',
      'Real industry insight alongside your playing',
    ],
    faqTitle: 'Drum school alternative — common questions',
    faqs: [
      {
        q: 'Is this an accredited drum school?',
        a: 'No — it is a private mentorship and mastermind community led by professional drummer Mike Malinin, designed to give you direct access that most schools cannot.',
      },
      {
        q: 'How is it better than a drum school?',
        a: 'You learn directly from a working professional in a flexible, online format with a focus on real musicianship and industry insight.',
      },
      {
        q: 'What level is it for?',
        a: 'It is aimed at drummers who already play and want mentorship to reach a higher level.',
      },
      {
        q: 'How do I enroll?',
        a: 'Book a call to learn about the mastermind and confirm it fits your goals.',
      },
    ],
    ctaTitle: 'Get more than a drum school can offer',
    ctaBody: 'Book a call and learn directly from a professional mentor.',
  },
  {
    slug: 'drum-tutors',
    keywords: ['drum tutors'],
    seoTitle: 'Drum Tutor With Real Credits | Mike Malinin',
    seoDescription:
      'A drum tutor who has performed at the highest level — Mike Malinin, former Goo Goo Dolls drummer. Personalized online mentorship for serious drummers.',
    eyebrow: 'Drum Tutors',
    h1Lead: 'Your Drum Tutor:',
    h1Highlight: 'Mike Malinin',
    heroSubtitle:
      'Personalized drum tutoring from a Diamond-certified, arena-touring professional.',
    intro: [
      'A good drum tutor meets you where you are and shows you exactly what to work on next. Mike Malinin brings decades of professional experience to that role, giving serious drummers personalized guidance rooted in real music.',
      'Rather than following a fixed script, your tutoring focuses on your playing, your goals, and the specific breakthroughs that will make the biggest difference for you.',
    ],
    featuresTitle: 'What tutoring with Mike looks like',
    features: [
      {
        title: 'Personalized guidance',
        body: 'Direction based on your playing and goals, not a generic curriculum.',
      },
      {
        title: 'Pro-level feedback',
        body: 'Insight from a drummer who has recorded platinum albums and toured worldwide.',
      },
      {
        title: 'Clear next steps',
        body: 'Always know what to work on and why, so your practice stays focused.',
      },
      {
        title: 'Ongoing support',
        body: 'A mentoring relationship and community, not a single disconnected session.',
      },
    ],
    audienceTitle: 'A great fit if you want',
    audience: [
      'A tutor who tailors guidance to you',
      'Feedback from a genuine professional',
      'A focused plan instead of scattered practice',
      'Ongoing mentorship as you grow',
    ],
    faqTitle: 'Drum tutor — common questions',
    faqs: [
      {
        q: 'Is the tutoring personalized?',
        a: 'Yes. The mastermind centers on direct mentorship from Mike, with feedback and guidance tailored to your playing and goals.',
      },
      {
        q: 'Is tutoring done online?',
        a: 'Yes, all tutoring and mentorship is delivered live online so you can learn from anywhere.',
      },
      {
        q: 'What level do you tutor?',
        a: 'Tutoring is best suited to drummers who already play and want to reach a higher, more professional level.',
      },
      {
        q: 'How do I book a drum tutor?',
        a: 'Book a call to talk through your goals and see if the mastermind mentorship is right for you.',
      },
    ],
    ctaTitle: 'Work with a drum tutor who has been there',
    ctaBody: 'Book a call and get personalized guidance from a world-class drummer.',
  },
] as const

export const landingSlugs = landingPages.map((p) => p.slug)

export function getLandingPage(slug: string): LandingPageData | undefined {
  return landingPages.find((p) => p.slug === slug)
}
