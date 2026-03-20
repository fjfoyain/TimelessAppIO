import { Talent, User, UserRole, UserStatus } from "@/types";

export interface TalentWithUser {
  talent: Talent;
  user: User;
}

// ─── Demo Talent Data ─────────────────────────────────────────────────────────
// All entries below are illustrative demo profiles (isDemo: true).
// They coexist alongside real Firestore talent entries in the marketplace.

export const mockTalents: TalentWithUser[] = [
  // ── DJs ───────────────────────────────────────────────────────────────────
  {
    user: {
      id: "demo-tiesto",
      name: "Tiësto",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-dj.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-tiesto",
      userId: "demo-tiesto",
      category: "DJ",
      city: "Las Vegas",
      bio: "One of the most iconic DJs and producers in the history of electronic music, with a career spanning over three decades. From trance pioneers to chart-topping crossover hits, Tiësto has headlined every major festival from Coachella to Tomorrowland and holds a legendary Las Vegas residency. His sets are masterclasses in crowd energy and musical architecture.",
      tags: ["Trance", "Progressive House", "EDM", "Festival", "Las Vegas Residency"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Tomorrowland main stage" },
        { type: "image", url: "/images/dj-profile.jpg", caption: "Las Vegas residency" },
        { type: "image", url: "/images/community-card.jpg", caption: "Coachella headline set" },
      ],
      reviews: [
        { id: "demo-r-1", author: "Tomorrowland Festival", clientId: "dc-1", rating: 5, comment: "Every year Tiësto delivers a set that defines the weekend. Absolute legend on the decks.", timestamp: "2025-01-10" },
        { id: "demo-r-2", author: "Omnia Nightclub", clientId: "dc-2", rating: 5, comment: "Our most attended night in five years. The production value and energy were unmatched.", timestamp: "2024-11-20" },
      ],
      servicePlans: [
        { id: "demo-sp-1", title: "Festival Headline", description: "Main stage headline performance", price: 0, includes: ["Full production rider", "Technical advance team", "VIP meet & greet", "Custom set"] },
        { id: "demo-sp-2", title: "Club Residency Night", description: "Full-night club takeover", price: 0, includes: ["Custom set", "Production consultation", "Promotional collaboration", "Merch activation"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 1240,
      responseRate: 96,
      availability: ["Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    user: {
      id: "demo-calvinharris",
      name: "Calvin Harris",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-dj.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-calvinharris",
      userId: "demo-calvinharris",
      category: "DJ",
      city: "Ibiza",
      bio: "Scotland-born, globally crowned. Calvin Harris is the world's highest-earning DJ and a genre-defining artist who has shaped the sound of pop and dance music for over 15 years. His Ibiza residency at Hï is the gold standard of summer nightlife. An unrivaled force behind the decks and in the studio.",
      tags: ["Commercial House", "Dance-Pop", "Disco", "Ibiza Residency", "Global Festivals"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Hï Ibiza main room" },
        { type: "image", url: "/images/dj-profile.jpg", caption: "Coachella headline performance" },
      ],
      reviews: [
        { id: "demo-r-3", author: "Hï Ibiza", clientId: "dc-3", rating: 5, comment: "Calvin consistently delivers the most talked-about nights of the season.", timestamp: "2024-08-15" },
        { id: "demo-r-4", author: "Coachella Valley Music", clientId: "dc-4", rating: 5, comment: "A flawless headline set — from the crowd to the production, absolutely world-class.", timestamp: "2024-04-20" },
      ],
      servicePlans: [
        { id: "demo-sp-3", title: "Residency Performance", description: "Club residency headline night", price: 0, includes: ["Custom set", "Advance production", "Brand partnership options", "Social content"] },
        { id: "demo-sp-4", title: "Festival Headline", description: "Main stage festival performance", price: 0, includes: ["Full technical rider", "Stage production consultation", "Press assets", "VIP access"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 980,
      responseRate: 94,
      availability: ["Fri", "Sat", "Sun"],
    },
  },
  {
    user: {
      id: "demo-martingarrix",
      name: "Martin Garrix",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-dj.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-martingarrix",
      userId: "demo-martingarrix",
      category: "DJ",
      city: "Amsterdam",
      bio: "The youngest DJ ever to top the DJ Mag Top 100, Martin Garrix blends melodic progressive house with anthemic builds that ignite stadiums worldwide. Founder of STMPD RCRDS, performer at the 2016 UEFA Euro and the 2021 Tokyo Olympics opening ceremony. His sets are precision-engineered emotional journeys.",
      tags: ["Progressive House", "Big Room", "Melodic House", "Stadium DJ", "STMPD RCRDS"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Olympic Stadium performance" },
        { type: "image", url: "/images/dj-profile.jpg", caption: "Ultra Music Festival" },
      ],
      reviews: [
        { id: "demo-r-5", author: "Amsterdam Dance Event", clientId: "dc-5", rating: 5, comment: "Martin's ADE showcase is always a city-wide highlight. Tens of thousands turned up.", timestamp: "2024-10-18" },
        { id: "demo-r-6", author: "Ultra Music Festival", clientId: "dc-6", rating: 5, comment: "The energy he creates in a crowd is something every other DJ is chasing.", timestamp: "2024-03-25" },
      ],
      servicePlans: [
        { id: "demo-sp-5", title: "Festival Main Stage", description: "Headline festival performance", price: 0, includes: ["Full production rider", "Technical team", "Press package", "Meet & greet"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 870,
      responseRate: 92,
      availability: ["Fri", "Sat", "Sun"],
    },
  },
  {
    user: {
      id: "demo-diplo",
      name: "Diplo",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-dj.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-diplo",
      userId: "demo-diplo",
      category: "DJ",
      city: "Los Angeles",
      bio: "Genre-fluid DJ, producer, and curator who invented his own lane. Diplo is the creative force behind Major Lazer, LSD, and Thomas Wesley (country alter ego). From Jamaican dancehall to Brazilian baile funk to stadium EDM, there is no scene he hasn't influenced. His DJ sets are unpredictable, high-energy, and unlike anything else.",
      tags: ["Bass Music", "Dancehall", "Electronic", "Major Lazer", "Cross-Genre"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Major Lazer live set" },
        { type: "image", url: "/images/dj-profile.jpg", caption: "Burning Man performance" },
      ],
      reviews: [
        { id: "demo-r-7", author: "Burning Man", clientId: "dc-7", rating: 5, comment: "Diplo's playa set was the most talked-about performance of the entire event.", timestamp: "2024-09-02" },
        { id: "demo-r-8", author: "Lollapalooza", clientId: "dc-8", rating: 5, comment: "He brought three times the crowd you'd expect and delivered three times the energy.", timestamp: "2024-08-03" },
      ],
      servicePlans: [
        { id: "demo-sp-6", title: "Festival Headline", description: "Full headline DJ set", price: 0, includes: ["Custom set", "Production rider", "Media package", "VIP experience"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 1100,
      responseRate: 90,
      availability: ["Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    user: {
      id: "demo-djsnake",
      name: "DJ Snake",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-dj.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-djsnake",
      userId: "demo-djsnake",
      category: "DJ",
      city: "Paris",
      bio: "French-Algerian DJ and producer who redefined global bass music with billion-stream anthems. The man behind 'Turn Down for What', 'Lean On', and 'Taki Taki'. DJ Snake's performances are genre-bending spectacles blending trap, moombahton, Eastern influences, and pop-crossover energy that fills arenas worldwide.",
      tags: ["Moombahton", "Trap", "Urban Electronic", "Global Crossover", "Arena DJ"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Paris La Défense Arena" },
        { type: "image", url: "/images/dj-profile.jpg", caption: "Stade de France performance" },
      ],
      reviews: [
        { id: "demo-r-9", author: "Stade de France", clientId: "dc-9", rating: 5, comment: "60,000 fans and every single one was on their feet from start to finish.", timestamp: "2024-07-14" },
        { id: "demo-r-10", author: "Tomorrowland", clientId: "dc-10", rating: 5, comment: "DJ Snake always creates moments. This set was no exception.", timestamp: "2024-07-27" },
      ],
      servicePlans: [
        { id: "demo-sp-7", title: "Arena Performance", description: "Full DJ performance for arenas and stadiums", price: 0, includes: ["Bespoke production", "Full visuals", "Technical advance", "Press assets"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 760,
      responseRate: 93,
      availability: ["Fri", "Sat", "Sun"],
    },
  },

  // ── Producers ─────────────────────────────────────────────────────────────
  {
    user: {
      id: "demo-metrob",
      name: "Metro Boomin",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-producer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-metrob",
      userId: "demo-metrob",
      category: "Producer",
      city: "Atlanta",
      bio: "If Young Metro don't trust you… The most decorated trap producer of his generation, Metro Boomin's signature sound — haunting melodies, thunderous 808s, and impeccable arrangement — has defined a decade of hip-hop. Responsible for landmark albums from Future, 21 Savage, Drake, and The Weeknd. His production credits read like a Museum of Modern Hip-Hop.",
      tags: ["Trap", "Hip-Hop", "808s", "Dark Melodic", "Atlanta Sound"],
      portfolio: [
        { type: "image", url: "/images/studio-card.jpg", caption: "Metro's studio session" },
        { type: "image", url: "/images/hero-studio.jpg", caption: "Mixing console at Stankonia" },
      ],
      reviews: [
        { id: "demo-r-11", author: "Republic Records", clientId: "dc-11", rating: 5, comment: "Every Metro-produced project becomes a cultural moment. He is simply the best at what he does.", timestamp: "2025-01-05" },
        { id: "demo-r-12", author: "Future", clientId: "dc-12", rating: 5, comment: "If you don't have Metro on the beat, you're already behind.", timestamp: "2024-11-30" },
      ],
      servicePlans: [
        { id: "demo-sp-8", title: "Custom Beat", description: "Exclusive produced track with stems", price: 0, includes: ["Custom composition", "Full stems", "Publishing negotiable", "Mix-ready delivery"] },
        { id: "demo-sp-9", title: "Full Album Production", description: "Complete project production", price: 0, includes: ["Project consultation", "Custom beats", "Arrangement", "Mix & master"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 430,
      responseRate: 88,
      availability: ["Mon", "Tue", "Wed", "Thu"],
    },
  },
  {
    user: {
      id: "demo-maxmartin",
      name: "Max Martin",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-producer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-maxmartin",
      userId: "demo-maxmartin",
      category: "Producer",
      city: "Stockholm",
      bio: "The most commercially successful songwriter and producer since Lennon & McCartney. Max Martin has written or co-written over 25 Billboard Hot 100 No.1 singles — from Backstreet Boys to Britney, Katy Perry, Taylor Swift, The Weeknd, and Ariana Grande. His melodic instincts and 'melodic math' production approach are the blueprint for modern pop.",
      tags: ["Pop", "Swedish Pop", "Songwriting", "Radio Production", "Grammy Award"],
      portfolio: [
        { type: "image", url: "/images/hero-studio.jpg", caption: "Maratone Studios Stockholm" },
        { type: "image", url: "/images/studio-card.jpg", caption: "Vocal production session" },
      ],
      reviews: [
        { id: "demo-r-13", author: "Sony Music", clientId: "dc-13", rating: 5, comment: "When Max produces a song, you know it will be a hit. His track record is simply unparalleled.", timestamp: "2024-12-10" },
        { id: "demo-r-14", author: "Universal Music Group", clientId: "dc-14", rating: 5, comment: "His melodic sensibility and production quality define what pop music sounds like to the world.", timestamp: "2024-09-25" },
      ],
      servicePlans: [
        { id: "demo-sp-10", title: "Single Production", description: "Full pop single production from concept to master", price: 0, includes: ["Songwriting collaboration", "Full production", "Vocal direction", "Mix & master"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 380,
      responseRate: 85,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    user: {
      id: "demo-pharrell",
      name: "Pharrell Williams",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-producer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-pharrell",
      userId: "demo-pharrell",
      category: "Producer",
      city: "Los Angeles",
      bio: "Musician, producer, and cultural visionary. As one half of The Neptunes and N.E.R.D, Pharrell Williams has produced some of the most innovative, genre-defying records in music history. From Jay-Z to Justin Timberlake, Beyoncé to Daft Punk's 'Get Lucky'. Winner of multiple Grammy Awards and a singular creative force in music, fashion, and art.",
      tags: ["Hip-Hop", "R&B", "Pop", "The Neptunes", "Funk", "Soulful Production"],
      portfolio: [
        { type: "image", url: "/images/studio-card.jpg", caption: "Sony Music Lab session" },
        { type: "image", url: "/images/live-room-bg.jpg", caption: "Live tracking session" },
      ],
      reviews: [
        { id: "demo-r-15", author: "Columbia Records", clientId: "dc-15", rating: 5, comment: "Pharrell doesn't just produce music, he produces culture. Working with him is a transformative experience.", timestamp: "2024-10-14" },
        { id: "demo-r-16", author: "Adidas Originals", clientId: "dc-16", rating: 5, comment: "His ability to merge music, fashion, and art is unmatched. An absolute genius.", timestamp: "2024-07-22" },
      ],
      servicePlans: [
        { id: "demo-sp-11", title: "Production Session", description: "Single or album production collaboration", price: 0, includes: ["Creative consultation", "Custom production", "Songwriting", "Mix-ready masters"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 510,
      responseRate: 87,
      availability: ["Mon", "Wed", "Fri"],
    },
  },
  {
    user: {
      id: "demo-timbaland",
      name: "Timbaland",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-producer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-timbaland",
      userId: "demo-timbaland",
      category: "Producer",
      city: "Miami",
      bio: "The architect of futuristic R&B. Timbaland's production — built on syncopated African rhythms, pitched vocal chops, and imaginative sound design — revolutionized hip-hop and R&B in the late 90s and 2000s. Responsible for classics with Aaliyah, Missy Elliott, Jay-Z, Justin Timberlake, Beyoncé, and Rihanna. His influence echoes in virtually every modern producer.",
      tags: ["R&B", "Hip-Hop", "Futuristic Beats", "Vocal Chops", "Rhythmic Production"],
      portfolio: [
        { type: "image", url: "/images/hero-studio.jpg", caption: "Studio session in Miami" },
        { type: "image", url: "/images/studio-card.jpg", caption: "Console at Interscope" },
      ],
      reviews: [
        { id: "demo-r-17", author: "Interscope Records", clientId: "dc-17", rating: 5, comment: "Timbaland's rhythm is like nothing else. He hears music differently and it shows in every track.", timestamp: "2024-08-18" },
        { id: "demo-r-18", author: "Atlantic Records", clientId: "dc-18", rating: 5, comment: "A legend who still operates at the very top of his craft. Incredible session.", timestamp: "2024-05-30" },
      ],
      servicePlans: [
        { id: "demo-sp-12", title: "Signature Beat", description: "Exclusive Timbaland-produced track", price: 0, includes: ["Custom production", "Timbaland signature rhythm", "Full stems", "Commercial license"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 620,
      responseRate: 89,
      availability: ["Tue", "Wed", "Thu", "Fri"],
    },
  },

  // ── Sound Engineers ────────────────────────────────────────────────────────
  {
    user: {
      id: "demo-tomelmhirst",
      name: "Tom Elmhirst",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-tomelmhirst",
      userId: "demo-tomelmhirst",
      category: "Sound Engineer",
      city: "London",
      bio: "Multi-Grammy Award-winning mixing engineer behind some of the most acclaimed albums of the 21st century. Tom Elmhirst's discography includes Amy Winehouse's 'Back to Black', David Bowie's 'Blackstar', Adele's '21' and '25', Beck's 'Morning Phase', and records by Taylor Swift, Arctic Monkeys, and Vampire Weekend. His mixes are defined by emotional depth, spatial clarity, and timeless warmth.",
      tags: ["Mixing", "Grammy Award", "Analog Mixing", "Pop", "Rock", "Indie"],
      portfolio: [
        { type: "image", url: "/images/hero-studio.jpg", caption: "Neve 8078 console session" },
        { type: "image", url: "/images/live-room-bg.jpg", caption: "Mixing suite at RAK Studios" },
      ],
      reviews: [
        { id: "demo-r-19", author: "XL Recordings", clientId: "dc-19", rating: 5, comment: "Tom's mix of 'Back to Black' is one of the greatest in music history. He has a gift for translating raw emotion into sound.", timestamp: "2024-11-08" },
        { id: "demo-r-20", author: "Columbia Records UK", clientId: "dc-20", rating: 5, comment: "Our record needed someone who could make it both timeless and contemporary. Tom delivered exactly that.", timestamp: "2024-09-15" },
      ],
      servicePlans: [
        { id: "demo-sp-13", title: "Stereo Mix", description: "Full album or single mix", price: 0, includes: ["Stem mixing", "Analog processing", "Up to 5 revisions", "Mastering-ready delivery"] },
        { id: "demo-sp-14", title: "Mix + Master", description: "Complete mix and master package", price: 0, includes: ["Stem mixing", "Album mastering", "Streaming optimized", "Vinyl preparation"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 340,
      responseRate: 97,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    user: {
      id: "demo-andrewscheps",
      name: "Andrew Scheps",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-andrewscheps",
      userId: "demo-andrewscheps",
      category: "Sound Engineer",
      city: "Los Angeles",
      bio: "Grammy-winning mixing engineer and a pioneer of the in-the-box mixing movement. Andrew Scheps' credits span rock, hip-hop, and pop royalty — Jay-Z's 'The Black Album', Adele's '21', Red Hot Chili Peppers, Metallica, Green Day, and U2. Known for his massive low-end, precision transients, and the ability to make any genre hit with maximum impact.",
      tags: ["Mixing", "In-The-Box", "Rock", "Hip-Hop", "Grammy Award", "Mastering"],
      portfolio: [
        { type: "image", url: "/images/studio-card.jpg", caption: "DAW mixing session" },
        { type: "image", url: "/images/hero-studio.jpg", caption: "Final mix review" },
      ],
      reviews: [
        { id: "demo-r-21", author: "Def Jam Recordings", clientId: "dc-21", rating: 5, comment: "Andrew is in a different league. His mix of 'The Black Album' is what every hip-hop engineer aspires to.", timestamp: "2024-12-01" },
        { id: "demo-r-22", author: "Warner Bros Records", clientId: "dc-22", rating: 5, comment: "Consistent, professional, and always delivers something that sounds better than you expected.", timestamp: "2024-10-22" },
      ],
      servicePlans: [
        { id: "demo-sp-15", title: "Single Mix", description: "Professional mix for single or EP", price: 0, includes: ["Stem import & organization", "Full mix", "3 revisions", "Stems export"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 280,
      responseRate: 95,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    user: {
      id: "demo-davepensado",
      name: "Dave Pensado",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-davepensado",
      userId: "demo-davepensado",
      category: "Sound Engineer",
      city: "Los Angeles",
      bio: "Mix engineer and educator known for pushing the boundaries of modern pop and R&B mixing. Dave Pensado's credits include Christina Aguilera, Beyoncé, Mary J. Blige, Timbaland, and hundreds more. Founder of 'Pensado's Place' — the world's #1 audio production video show — he has mentored an entire generation of engineers while continuing to deliver world-class mixes.",
      tags: ["Mixing", "R&B", "Pop", "Pensado's Place", "Dynamic Processing", "Mastering"],
      portfolio: [
        { type: "image", url: "/images/live-room-bg.jpg", caption: "Control room session" },
        { type: "image", url: "/images/studio-card.jpg", caption: "Digital workstation setup" },
      ],
      reviews: [
        { id: "demo-r-23", author: "RCA Records", clientId: "dc-23", rating: 5, comment: "Dave's instincts for what a mix needs are almost supernatural. Incredible to watch him work.", timestamp: "2024-09-18" },
        { id: "demo-r-24", author: "Island Records", clientId: "dc-24", rating: 5, comment: "When you send tracks to Dave, they come back sounding like hit records. Every time.", timestamp: "2024-07-05" },
      ],
      servicePlans: [
        { id: "demo-sp-16", title: "Mix Session", description: "Full professional mix", price: 0, includes: ["Full mix", "Plug-in processing", "3 rounds of revisions", "Reference-matched output"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 490,
      responseRate: 91,
      availability: ["Mon", "Tue", "Thu", "Fri"],
    },
  },

  // ── Concert Photographers ──────────────────────────────────────────────────
  {
    user: {
      id: "demo-dannyclinch",
      name: "Danny Clinch",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/testimonial-sarah.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-dannyclinch",
      userId: "demo-dannyclinch",
      category: "Concert Photographer",
      city: "New York",
      bio: "One of the most iconic music photographers alive. Danny Clinch's black-and-white concert and portrait work has defined the visual identity of rock and hip-hop for 30 years. His subjects include Tupac, Kurt Cobain, Eddie Vedder, Bruce Springsteen, Dave Matthews, Jay-Z, and countless others. His photographs don't just document — they mythologize.",
      tags: ["Black & White", "Rock Photography", "Portraiture", "Documentary", "Film Photography"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Live performance at MSG" },
        { type: "image", url: "/images/community-card.jpg", caption: "Backstage documentary" },
        { type: "image", url: "/images/academy-card.jpg", caption: "Tour portrait session" },
      ],
      reviews: [
        { id: "demo-r-25", author: "Rolling Stone Magazine", clientId: "dc-25", rating: 5, comment: "Danny captures the soul of an artist in a single frame. There is no one better.", timestamp: "2024-12-12" },
        { id: "demo-r-26", author: "Bruce Springsteen Management", clientId: "dc-26", rating: 5, comment: "Danny has been documenting Bruce's career for decades. His work is irreplaceable.", timestamp: "2024-10-01" },
      ],
      servicePlans: [
        { id: "demo-sp-17", title: "Concert Coverage", description: "Full concert photography session", price: 0, includes: ["Full show coverage", "Film + digital", "100+ selects", "High-res delivery"] },
        { id: "demo-sp-18", title: "Artist Portraits", description: "Studio or location portrait session", price: 0, includes: ["Half-day session", "Multiple setups", "20+ final edits", "Print rights"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 760,
      responseRate: 94,
      availability: ["Mon", "Wed", "Fri", "Sat", "Sun"],
    },
  },
  {
    user: {
      id: "demo-kevinmazur",
      name: "Kevin Mazur",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/testimonial-sarah.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-kevinmazur",
      userId: "demo-kevinmazur",
      category: "Concert Photographer",
      city: "New York",
      bio: "The go-to photographer for the world's biggest music events. Kevin Mazur has photographed every major awards show, festival, and world tour for three decades — from Madonna to Beyoncé, the Grammys, Met Gala, and everything in between. His work has appeared on the cover of every major entertainment publication on earth.",
      tags: ["Red Carpet", "Awards Shows", "World Tours", "Editorial", "Celebrity Portraiture"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Grammy Awards night" },
        { type: "image", url: "/images/community-card.jpg", caption: "World tour documentation" },
      ],
      reviews: [
        { id: "demo-r-27", author: "Recording Academy (GRAMMYs)", clientId: "dc-27", rating: 5, comment: "Kevin is a Grammy institution. His work captures the night perfectly, every single year.", timestamp: "2025-01-15" },
        { id: "demo-r-28", author: "Live Nation Entertainment", clientId: "dc-28", rating: 5, comment: "Reliable, professional, and always delivers editorial-quality work under pressure.", timestamp: "2024-11-10" },
      ],
      servicePlans: [
        { id: "demo-sp-19", title: "Event Coverage", description: "Red carpet and live event photography", price: 0, includes: ["Full event coverage", "Same-day previews", "500+ selects", "Wire-ready delivery"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 1200,
      responseRate: 96,
      availability: ["Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    user: {
      id: "demo-tylermitchell",
      name: "Tyler Mitchell",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/testimonial-sarah.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-tylermitchell",
      userId: "demo-tylermitchell",
      category: "Concert Photographer",
      city: "Atlanta",
      bio: "The first Black photographer to shoot the cover of American Vogue, Tyler Mitchell's work is rooted in Black joy, youth culture, and the intersection of music and art. His editorial work with Beyoncé, Frank Ocean, Tyler the Creator, and Solange challenges traditional aesthetics and creates new visual languages for contemporary music culture.",
      tags: ["Editorial", "Music Culture", "Fashion Photography", "Color Film", "Documentary"],
      portfolio: [
        { type: "image", url: "/images/community-card.jpg", caption: "Editorial shoot with Vogue" },
        { type: "image", url: "/images/hero-concert.jpg", caption: "Music video still shoot" },
      ],
      reviews: [
        { id: "demo-r-29", author: "Condé Nast", clientId: "dc-29", rating: 5, comment: "Tyler brings a fresh, essential perspective to music photography that few others can match.", timestamp: "2024-10-30" },
        { id: "demo-r-30", author: "Columbia Records", clientId: "dc-30", rating: 5, comment: "His work doesn't just capture artists — it creates iconic images that define eras.", timestamp: "2024-08-20" },
      ],
      servicePlans: [
        { id: "demo-sp-20", title: "Editorial Session", description: "Magazine-quality editorial photography", price: 0, includes: ["Concept development", "Full day shoot", "30+ final images", "Print & digital rights"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 190,
      responseRate: 92,
      availability: ["Mon", "Tue", "Wed", "Thu"],
    },
  },

  // ── Videographers / Music Video Directors ─────────────────────────────────
  {
    user: {
      id: "demo-hiromurai",
      name: "Hiro Murai",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-hiromurai",
      userId: "demo-hiromurai",
      category: "Videographer/Editor",
      city: "Los Angeles",
      bio: "The most important music video director of his generation. Hiro Murai created 'This Is America' with Childish Gambino — one of the most dissected and acclaimed music videos in history. His collaboration with Donald Glover extends into television (Atlanta) and his video catalogue includes work with St. Vincent, Flying Lotus, Earl Sweatshirt, and Janelle Monáe. Every frame has intention.",
      tags: ["Narrative Director", "Conceptual", "Cinematic", "Social Commentary", "Award-Winning"],
      portfolio: [
        { type: "image", url: "/images/academy-card.jpg", caption: "'This Is America' behind-the-scenes" },
        { type: "image", url: "/images/studio-card.jpg", caption: "Director's cut session" },
      ],
      reviews: [
        { id: "demo-r-31", author: "RCA Records", clientId: "dc-31", rating: 5, comment: "Hiro doesn't make music videos — he makes films. Working with him changes how you think about visual storytelling.", timestamp: "2024-12-05" },
        { id: "demo-r-32", author: "Childish Gambino Management", clientId: "dc-32", rating: 5, comment: "His ability to translate complex ideas into visceral visual experiences is singular.", timestamp: "2024-09-10" },
      ],
      servicePlans: [
        { id: "demo-sp-21", title: "Concept Video", description: "Narrative-driven music video", price: 0, includes: ["Creative development", "Full production", "Post-production", "Color grade", "3 revision rounds"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 95,
      responseRate: 89,
      availability: ["Mon", "Tue", "Wed"],
    },
  },
  {
    user: {
      id: "demo-davemeyers",
      name: "Dave Meyers",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-davemeyers",
      userId: "demo-davemeyers",
      category: "Videographer/Editor",
      city: "Los Angeles",
      bio: "The most commercially successful music video director working today. Dave Meyers has directed videos for Kendrick Lamar, Dua Lipa, Halsey, P!nk, Missy Elliott, and Harry Styles, accumulating billions of combined views. His style merges high-fashion aesthetics with surreal storytelling — each video is a mini blockbuster.",
      tags: ["Commercial Director", "High-Fashion", "Surrealist", "Billboard Artists", "High-Budget"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Large-scale production" },
        { type: "image", url: "/images/community-card.jpg", caption: "Fashion-forward set design" },
      ],
      reviews: [
        { id: "demo-r-33", author: "Interscope Records", clientId: "dc-33", rating: 5, comment: "Dave's videos are guaranteed to go viral. His production instincts are incredible.", timestamp: "2024-11-22" },
        { id: "demo-r-34", author: "Warner Records", clientId: "dc-34", rating: 5, comment: "He always delivers something that surprises you. A true master of the medium.", timestamp: "2024-08-14" },
      ],
      servicePlans: [
        { id: "demo-sp-22", title: "Full Production Video", description: "Large-scale music video production", price: 0, includes: ["Creative treatment", "Full crew", "High-end equipment", "Post-production", "Color grade"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 180,
      responseRate: 91,
      availability: ["Mon", "Tue", "Wed", "Thu"],
    },
  },
  {
    user: {
      id: "demo-josephkahn",
      name: "Joseph Kahn",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-josephkahn",
      userId: "demo-josephkahn",
      category: "Videographer/Editor",
      city: "Los Angeles",
      bio: "Acclaimed music video director with a filmmaking sensibility and a resume spanning two decades of iconic videos. Joseph Kahn has directed Taylor Swift's 'Bad Blood', Eminem's 'Without Me', Britney Spears, and Linkin Park. Known for complex narratives, high production values, and a cinematic vocabulary that transcends the music video format.",
      tags: ["Cinematic", "Narrative Videos", "High Production", "Action", "Pop & Rock"],
      portfolio: [
        { type: "image", url: "/images/academy-card.jpg", caption: "Production stills from 'Bad Blood'" },
        { type: "image", url: "/images/studio-card.jpg", caption: "Post-production color session" },
      ],
      reviews: [
        { id: "demo-r-35", author: "Big Machine Records", clientId: "dc-35", rating: 5, comment: "'Bad Blood' was a cultural moment. Joseph's vision brought it to life with unbelievable craft.", timestamp: "2024-07-20" },
        { id: "demo-r-36", author: "Aftermath Entertainment", clientId: "dc-36", rating: 5, comment: "He makes every video feel like a film. Impeccable production value from start to finish.", timestamp: "2024-05-12" },
      ],
      servicePlans: [
        { id: "demo-sp-23", title: "Cinematic Video", description: "Film-quality music video production", price: 0, includes: ["Script development", "Full production", "VFX if needed", "Full post-production"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 210,
      responseRate: 88,
      availability: ["Tue", "Wed", "Thu", "Fri"],
    },
  },

  // ── Lighting Technicians ───────────────────────────────────────────────────
  {
    user: {
      id: "demo-esdevlin",
      name: "Es Devlin",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/testimonial-sarah.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-esdevlin",
      userId: "demo-esdevlin",
      category: "Lighting Technician",
      city: "London",
      bio: "The world's preeminent stage and set designer. Es Devlin has created immersive touring productions for Beyoncé, Adele, U2, Kanye West, The Weeknd, and many others. Her work synthesizes architecture, light, LED technology, and poetry into unforgettable spectacles. She also designed the London 2012 Olympic closing ceremony. A true artist who transforms concert spaces into living sculptures.",
      tags: ["Stage Design", "LED Architecture", "Scenic Design", "Concert Production", "Olympic Scale"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "LED stage for world tour" },
        { type: "image", url: "/images/community-card.jpg", caption: "Olympic closing ceremony" },
        { type: "image", url: "/images/academy-card.jpg", caption: "Avant-garde stage concept" },
      ],
      reviews: [
        { id: "demo-r-37", author: "Parkwood Entertainment", clientId: "dc-37", rating: 5, comment: "Es Devlin's stage for the Renaissance tour was a masterwork. Audiences were breathless from the moment the lights came up.", timestamp: "2024-09-22" },
        { id: "demo-r-38", author: "Live Nation UK", clientId: "dc-38", rating: 5, comment: "She doesn't design stages — she creates worlds. The most innovative mind in live production.", timestamp: "2024-06-15" },
      ],
      servicePlans: [
        { id: "demo-sp-24", title: "Tour Stage Design", description: "Full stage and lighting design for a tour", price: 0, includes: ["Concept design", "Technical drawings", "Production supervision", "LED programming"] },
        { id: "demo-sp-25", title: "Venue Installation", description: "Custom lighting installation for a venue or event", price: 0, includes: ["Site survey", "Design concept", "Installation supervision", "Operation training"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 120,
      responseRate: 93,
      availability: ["Mon", "Tue", "Wed", "Thu"],
    },
  },
  {
    user: {
      id: "demo-patrickwoodroffe",
      name: "Patrick Woodroffe",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-patrickwoodroffe",
      userId: "demo-patrickwoodroffe",
      category: "Lighting Technician",
      city: "London",
      bio: "The world's most experienced concert lighting designer. Patrick Woodroffe has lit over 50 world tours for the Rolling Stones, U2, David Bowie, Madonna, and Muse. His work with Woodroffe Bassett Design has defined the visual language of arena and stadium rock. With decades of experience delivering productions seen by hundreds of millions worldwide, he is the gold standard.",
      tags: ["Concert Lighting", "Stadium Production", "DMX Programming", "Arena Rock", "Lighting Design"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Rolling Stones 'A Bigger Bang' tour" },
        { type: "image", url: "/images/community-card.jpg", caption: "U2 360° tour rig" },
      ],
      reviews: [
        { id: "demo-r-39", author: "The Rolling Stones Management", clientId: "dc-39", rating: 5, comment: "Patrick has been the visual architect of some of our biggest tours. Irreplaceable.", timestamp: "2024-10-08" },
        { id: "demo-r-40", author: "U2 Management", clientId: "dc-40", rating: 5, comment: "Nobody understands scale and spectacle in lighting the way Patrick does.", timestamp: "2024-07-30" },
      ],
      servicePlans: [
        { id: "demo-sp-26", title: "Tour Lighting Design", description: "Complete lighting design for a world tour", price: 0, includes: ["Full design", "Preprogramming", "Tour supervision", "Crew training"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 85,
      responseRate: 96,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },

  // ── Session Musicians ──────────────────────────────────────────────────────
  {
    user: {
      id: "demo-gregphillinganes",
      name: "Greg Phillinganes",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-gregphillinganes",
      userId: "demo-gregphillinganes",
      category: "Session Musician",
      city: "Los Angeles",
      bio: "Legendary session keyboardist and musical director responsible for some of the most iconic keyboard parts in pop and R&B history. Greg Phillinganes played on Michael Jackson's 'Thriller', 'Off the Wall', and 'Dangerous', as well as records by Stevie Wonder, Quincy Jones, Paul McCartney, and Eric Clapton. Later served as musical director for Tina Turner and Eric Clapton's world tours.",
      tags: ["Keyboards", "Piano", "Musical Director", "Session Musician", "Pop", "R&B"],
      portfolio: [
        { type: "image", url: "/images/live-room-bg.jpg", caption: "Studio tracking session" },
        { type: "image", url: "/images/studio-card.jpg", caption: "Grand piano recording" },
      ],
      reviews: [
        { id: "demo-r-41", author: "Epic Records", clientId: "dc-41", rating: 5, comment: "Greg is a living legend. His keyboard work on our record elevated every track instantly.", timestamp: "2024-11-14" },
        { id: "demo-r-42", author: "Quincy Jones Productions", clientId: "dc-42", rating: 5, comment: "There is no one more musical or more professional in the session world.", timestamp: "2024-08-25" },
      ],
      servicePlans: [
        { id: "demo-sp-27", title: "Studio Session", description: "Half-day keyboard recording session", price: 0, includes: ["Multiple keyboard parts", "Own instruments", "Arrangement input", "Stems delivery"] },
        { id: "demo-sp-28", title: "Musical Direction", description: "Musical director for live production", price: 0, includes: ["Arrangement", "Band coordination", "Rehearsal direction", "Live performance"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 890,
      responseRate: 97,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    user: {
      id: "demo-nathaneast",
      name: "Nathan East",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-engineer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-nathaneast",
      userId: "demo-nathaneast",
      category: "Session Musician",
      city: "Los Angeles",
      bio: "The most recorded bass player in history, with credits on over 4,000 albums. Nathan East's melodic, soulful bass lines have anchored records for Eric Clapton, Daft Punk ('Get Lucky'), Michael Jackson, Quincy Jones, and Kenny Rogers. A founding member of Fourplay. His playing is the definition of 'right note, right time' — musical, supportive, and unmistakable.",
      tags: ["Bass Guitar", "Electric Bass", "Jazz", "R&B", "Session Musician", "4,000+ Credits"],
      portfolio: [
        { type: "image", url: "/images/live-room-bg.jpg", caption: "Studio bass tracking" },
        { type: "image", url: "/images/hero-concert.jpg", caption: "Live performance with Eric Clapton" },
      ],
      reviews: [
        { id: "demo-r-43", author: "Warner Bros Records", clientId: "dc-43", rating: 5, comment: "Nathan's bass parts are like a second melody. He made our entire record feel alive.", timestamp: "2024-12-18" },
        { id: "demo-r-44", author: "Daft Punk Management", clientId: "dc-44", rating: 5, comment: "The 'Get Lucky' bass line speaks for itself. Nathan is on another level.", timestamp: "2024-09-05" },
      ],
      servicePlans: [
        { id: "demo-sp-29", title: "Remote Session", description: "Remote bass recording from LA studio", price: 0, includes: ["Multiple takes", "3 bass parts", "48h turnaround", "Dry + wet stems"] },
        { id: "demo-sp-30", title: "In-Studio Session", description: "Full day studio bass session", price: 0, includes: ["Own instruments & gear", "All day tracking", "Arrangement input", "Files delivered same day"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 4000,
      responseRate: 98,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    user: {
      id: "demo-sheilae",
      name: "Sheila E.",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/testimonial-sarah.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-sheilae",
      userId: "demo-sheilae",
      category: "Session Musician",
      city: "Los Angeles",
      bio: "Drummer, percussionist, singer, and one of the most influential musicians in pop and R&B history. Sheila E. was Prince's longtime musical collaborator and the powerhouse behind 'The Glamorous Life'. Her percussion work spans jazz, funk, Latin, and pop — and she has performed or recorded with Marvin Gaye, Lionel Richie, George Duke, and Diana Ross. A force of nature behind any kit.",
      tags: ["Drums", "Percussion", "Funk", "R&B", "Latin Percussion", "Musical Director"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Live drum performance" },
        { type: "image", url: "/images/live-room-bg.jpg", caption: "Percussion tracking session" },
      ],
      reviews: [
        { id: "demo-r-45", author: "Paisley Park Records", clientId: "dc-45", rating: 5, comment: "Sheila's drumming has a feel and fire that no machine can replicate. She is the real thing.", timestamp: "2024-11-28" },
        { id: "demo-r-46", author: "Motown Records", clientId: "dc-46", rating: 5, comment: "She walked in, got the feel of the track immediately, and delivered something unforgettable.", timestamp: "2024-08-10" },
      ],
      servicePlans: [
        { id: "demo-sp-31", title: "Drum/Perc Session", description: "Studio drum and percussion session", price: 0, includes: ["Multiple kit configurations", "Percussion overdubs", "Full stems", "3-hour session"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 670,
      responseRate: 95,
      availability: ["Mon", "Wed", "Thu", "Fri", "Sat"],
    },
  },

  // ── Event Promoters ────────────────────────────────────────────────────────
  {
    user: {
      id: "demo-harveygoldsmith",
      name: "Harvey Goldsmith",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-producer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-harveygoldsmith",
      userId: "demo-harveygoldsmith",
      category: "Event Promoter",
      city: "London",
      bio: "The most legendary concert promoter in British history. Harvey Goldsmith produced Live Aid in 1985, one of the most-watched music events in television history. His portfolio spans over 50 years of landmark concerts and tours for Led Zeppelin, The Who, Eric Clapton, Michael Jackson, Frank Sinatra, and Luciano Pavarotti. The gold standard of live event promotion.",
      tags: ["Live Aid", "Stadium Events", "World Tours", "Classic Rock", "Global Production"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Live Aid at Wembley Stadium" },
        { type: "image", url: "/images/community-card.jpg", caption: "Led Zeppelin O2 reunion" },
      ],
      reviews: [
        { id: "demo-r-47", author: "Live Nation UK", clientId: "dc-47", rating: 5, comment: "Harvey set the bar for what a concert can be. His Live Aid remains the greatest event ever staged.", timestamp: "2024-12-22" },
        { id: "demo-r-48", author: "Wembley Stadium", clientId: "dc-48", rating: 5, comment: "Working with Harvey is working with history. Nobody does it at this scale with this level of vision.", timestamp: "2024-09-30" },
      ],
      servicePlans: [
        { id: "demo-sp-32", title: "Concert Promotion", description: "Full event promotion and management", price: 0, includes: ["Venue negotiation", "Artist booking", "Marketing campaign", "Day-of production management"] },
        { id: "demo-sp-33", title: "Stadium Event", description: "Large-scale stadium event production", price: 0, includes: ["Full project management", "Sponsor coordination", "International media", "Broadcast rights"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 380,
      responseRate: 92,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    user: {
      id: "demo-michaelcohl",
      name: "Michael Cohl",
      email: "demo@timeless.app",
      role: UserRole.TALENT,
      avatar: "/images/avatar-producer.jpg",
      status: UserStatus.ACTIVE,
    },
    talent: {
      id: "demo-michaelcohl",
      userId: "demo-michaelcohl",
      category: "Event Promoter",
      city: "Toronto",
      bio: "Revolutionized the concert touring industry as the promoter who introduced the co-venture deal model — where artists receive a percentage of gross revenue. Michael Cohl promoted the Rolling Stones' Steel Wheels Tour, U2's ZooTV, Pink Floyd's Division Bell Tour, Michael Jackson's HIStory Tour, and many others. He changed how the music business approaches live performance.",
      tags: ["Stadium Tours", "Co-Venture Deals", "Rolling Stones", "Event Strategy", "Global Touring"],
      portfolio: [
        { type: "image", url: "/images/hero-concert.jpg", caption: "Steel Wheels Tour stadium" },
        { type: "image", url: "/images/community-card.jpg", caption: "ZooTV Tour production" },
      ],
      reviews: [
        { id: "demo-r-49", author: "The Rolling Stones", clientId: "dc-49", rating: 5, comment: "Michael changed the game for artists and promoters alike. His tours are legendary for a reason.", timestamp: "2024-10-10" },
        { id: "demo-r-50", author: "U2 Management", clientId: "dc-50", rating: 5, comment: "A visionary who sees the full picture — from the business to the fan experience.", timestamp: "2024-07-18" },
      ],
      servicePlans: [
        { id: "demo-sp-34", title: "World Tour Promotion", description: "Full global tour promotion and management", price: 0, includes: ["Global routing", "Venue negotiation", "Sponsor integration", "Revenue optimization"] },
      ],
      isVerified: true,
      isDemo: true,
      jobsCompleted: 220,
      responseRate: 90,
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
];

export const talentCategories = Array.from(new Set(mockTalents.map((t) => t.talent.category)));
export const talentCities = Array.from(new Set(mockTalents.map((t) => t.talent.city)));
