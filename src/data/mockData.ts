
// data/mockData.ts
import type { User, Talent, Conversation, Event, ResaleTicket, Wallet, ServicePlan, Venue, TicketTier, EventProduct, Review, PurchasedTicket, AddOn, Badge, Provider } from '../types';
import { UserRole, UserStatus, NegotiationStatus } from '../types';

// USERS
const adminUser: User = { id: 'user-0', name: 'Admin', email: 'admin@timeless.com', password: 'password', role: UserRole.ADMIN, avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const clientUser1: User = { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', password: 'password', role: UserRole.CLIENT, avatar: 'https://images.pexels.com/photos/3762804/pexels-photo-3762804.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE, portfolio: [{title: "Annual Gala 2023", url: "https://i.ibb.co/F82xYyP/gala-event.webp"}] };
const clientUser2: User = { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', password: 'password', role: UserRole.CLIENT, avatar: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE, portfolio: [{title: "Product Launch Event", url: "https://i.ibb.co/3k5g7b7/product-launch.webp"}]};
const talentUser1: User = { id: 'user-3', name: 'Clara Rodriguez', email: 'clara@example.com', password: 'password', role: UserRole.TALENT, avatar: 'https://images.pexels.com/photos/4119831/pexels-photo-4119831.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const talentUser2: User = { id: 'user-4', name: 'David Lee', email: 'david@example.com', password: 'password', role: UserRole.TALENT, avatar: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const pendingTalentUser: User = { id: 'user-5', name: 'Pending Pete', email: 'pete@example.com', password: 'password', role: UserRole.TALENT, avatar: 'https://images.pexels.com/photos/4252136/pexels-photo-4252136.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.PENDING };
const talentUser3: User = { id: 'user-6', name: 'Chef Antoine', email: 'antoine@example.com', password: 'password', role: UserRole.TALENT, avatar: 'https://images.pexels.com/photos/3771111/pexels-photo-3771111.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const talentUser4: User = { id: 'user-7', name: 'The Velvet Tones', email: 'velvet@example.com', password: 'password', role: UserRole.TALENT, avatar: 'https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const talentUser5: User = { id: 'user-8', name: 'Mixologist Mike', email: 'mike@example.com', password: 'password', role: UserRole.TALENT, avatar: 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const venueUser1: User = { id: 'user-9', name: 'Soho House MGMT', email: 'soho@example.com', password: 'password', role: UserRole.VENUE, avatar: 'https://images.pexels.com/photos/3184429/pexels-photo-3184429.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const venueUser2: User = { id: 'user-10', name: 'The Plaza Hotel', email: 'plaza@example.com', password: 'password', role: UserRole.VENUE, avatar: 'https://images.pexels.com/photos/7821915/pexels-photo-7821915.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const providerUser1: User = { id: 'user-11', name: 'Sonic Boom Rentals', email: 'sonic@example.com', password: 'password', role: UserRole.PROVIDER, avatar: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };
const providerUser2: User = { id: 'user-12', name: 'Luxe Decor & Stage', email: 'decor@example.com', password: 'password', role: UserRole.PROVIDER, avatar: 'https://images.pexels.com/photos/1571730/pexels-photo-1571730.jpeg?auto=compress&cs=tinysrgb&w=800', status: UserStatus.ACTIVE };


export const initialUsers: User[] = [adminUser, clientUser1, clientUser2, providerUser1, providerUser2];

const photoAddOns: AddOn[] = [
    { id: 'addon-1', name: 'Drone Footage', description: 'Stunning aerial shots of your event.', price: 600 },
    { id: 'addon-2', name: 'Second Shooter', description: 'Ensures every angle is captured.', price: 800 },
    { id: 'addon-3', name: 'Expedited Delivery', description: 'Receive your final photos in 7 days.', price: 400 },
];

const djAddOns: AddOn[] = [
    { id: 'addon-4', name: 'Premium Lighting Package', description: 'Uplighting and dance floor effects.', price: 500 },
    { id: 'addon-5', name: 'Ceremony Audio System', description: 'Separate sound system for wedding ceremonies.', price: 350 },
    { id: 'addon-6', name: 'MC Services', description: 'Professional hosting and announcements.', price: 300 },
];

const chefAddOns: AddOn[] = [
    { id: 'addon-7', name: 'Wine Pairing', description: 'Expertly selected wines for each course.', price: 150 },
    { id: 'addon-8', name: 'Canapés Hour', description: 'A selection of 4 custom canapés for guests upon arrival.', price: 50 },
];

// TALENTS
const defaultServicePlans: ServicePlan[] = [
    { id: 'plan-1', title: 'Bronze Package', description: 'Basic coverage for small events.', price: 500, includes: ['2 hours of service', 'Basic equipment', '50 deliverables'] },
    { id: 'plan-2', title: 'Silver Package', description: 'Standard package for medium-sized events.', price: 1200, includes: ['4 hours of service', 'Professional equipment', '150 deliverables', '1 consultation call'] },
    { id: 'plan-3', title: 'Gold Package', description: 'Premium all-inclusive package.', price: 2500, includes: ['8 hours of service', 'Top-tier equipment', '300+ deliverables', 'Unlimited consultations', 'Custom requests'] },
];

const getCurrentMonthBookedDates = (seed: number) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const bookedDates = new Set<string>();
    const numBooked = 5 + (seed % 5); // 5-9 booked days

    for (let i = 0; i < numBooked; i++) {
        const day = (Math.floor(Math.random() * daysInMonth) + 1);
        bookedDates.add(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
    return Array.from(bookedDates);
}

const talentBadges: Record<string, Badge[]> = {
    'talent-1': [
        { id: 'badge-2', name: 'Fast Responder', description: 'Replies to messages quickly.', icon: 'FastResponder', tier: 'gold' },
        { id: 'badge-4', name: 'Rising Star', description: 'A promising new talent on the platform.', icon: 'RisingStar' },
    ],
    'talent-2': [
        { id: 'badge-1', name: 'Top Rated', description: 'Consistently receives 5-star reviews.', icon: 'TopRated', tier: 'gold' },
        { id: 'badge-3', name: 'Highly Booked', description: 'A popular and frequently booked talent.', icon: 'HighlyBooked', tier: 'silver' },
    ],
    'talent-4': [
        { id: 'badge-5', name: 'Community Pick', description: 'Recognized for outstanding contributions and service.', icon: 'CommunityPick', tier: 'gold' },
    ],
    'talent-6': [
         { id: 'badge-3', name: 'Highly Booked', description: 'A popular and frequently booked talent.', icon: 'HighlyBooked', tier: 'gold' },
         { id: 'badge-1', name: 'Top Rated', description: 'Consistently receives 5-star reviews.', icon: 'TopRated', tier: 'silver' },
    ]
};


export const initialTalents: Talent[] = [
    { 
        id: 'talent-1', userId: 'user-3', user: talentUser1, category: 'DJ', city: 'Miami', 
        bio: 'A globally-renowned DJ with a decade of experience, Clara Rodriguez curates unforgettable soundscapes, from the deep grooves of house to the timeless allure of classic funk. Her intuitive ability to read a room guarantees an elevated atmosphere for the most exclusive events.',
        tags: ['House', 'Techno', 'Weddings', 'Corporate Events', 'Luxury'],
        portfolio: [
            { type: 'image', url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Vibrant concert set' },
            { type: 'image', url: 'https://images.pexels.com/photos/3784566/pexels-photo-3784566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Intimate club atmosphere' },
            { type: 'image', url: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Luxury wedding reception' },
        ],
        reviews: [
            { id: 'review-1', author: 'Alice Johnson', clientId: 'user-1', rating: 5, comment: 'Clara was incredible! She read the room perfectly and kept the dance floor packed all night. Truly a professional.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        servicePlans: defaultServicePlans.map(p => ({ ...p, id: `plan-1-${p.id}`, addOns: djAddOns })),
        isVerified: true,
        hourlyRate: 150,
        jobsCompleted: 25,
        responseRate: 98,
        availability: getCurrentMonthBookedDates(1),
        contractUrl: 'sample-contract.pdf',
        riderUrl: 'sample-rider.pdf',
        badges: talentBadges['talent-1'],
        loyaltyTier: 'standard',
        socials: {
            spotify: '#',
            appleMusic: '#',
            soundcloud: '#',
            mixcloud: '#',
            instagram: '#',
        }
    },
    { 
        id: 'talent-2', userId: 'user-4', user: talentUser2, category: 'Photographer', city: 'New York', 
        bio: 'Specializing in luxury event and portrait photography, David Lee captures timeless moments with an editorial flair. His work is a blend of authentic emotion and meticulous composition, telling a unique story with every frame.',
        tags: ['Fashion', 'Portraits', 'Luxury Weddings', 'Product Photography'],
        portfolio: [
            { type: 'image', url: 'https://images.pexels.com/photos/3765113/pexels-photo-3765113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Editorial street style' },
            { type: 'image', url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Candid portrait' },
            { type: 'image', url: 'https://images.pexels.com/photos/3290068/pexels-photo-3290068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Elegant wedding details' },
        ],
        reviews: [
             { id: 'review-2', author: 'Bob Williams', clientId: 'user-2', rating: 5, comment: 'David\'s photos were breathtaking. He is a true artist and a pleasure to work with. He captured our event perfectly.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        servicePlans: defaultServicePlans.map(p => ({...p, id: `plan-2-${p.id}`, price: p.price * 1.5, addOns: photoAddOns })),
        isVerified: true,
        isCertified: true,
        hourlyRate: 250,
        jobsCompleted: 42,
        responseRate: 100,
        availability: getCurrentMonthBookedDates(2),
        collectiveId: 'collective-1',
        collectiveName: 'Aperture Artists',
        badges: talentBadges['talent-2'],
        loyaltyTier: 'premier',
        socials: {
            flickr: '#',
            behance: '#',
            instagram: '#',
        }
    },
     { 
        id: 'talent-3', userId: 'user-5', user: pendingTalentUser, category: 'Chef', city: 'Los Angeles', 
        bio: 'Michelin-trained chef specializing in farm-to-table tasting menus for intimate gatherings.',
        tags: ['Private Dining', 'Tasting Menu', 'Molecular Gastronomy'],
        portfolio: [{ type: 'image', url: 'https://i.ibb.co/9v0z58B/chef-portfolio-1.webp', caption: 'Plated masterpiece' }],
        reviews: [],
        servicePlans: defaultServicePlans.map(p => ({...p, id: `plan-3-${p.id}`, price: p.price * 2})),
        isVerified: false,
        hourlyRate: 400,
        jobsCompleted: 0,
        responseRate: 0,
        availability: [],
        loyaltyTier: 'standard',
    },
    { 
        id: 'talent-4', userId: 'user-6', user: talentUser3, category: 'Private Chef', city: 'Paris', 
        bio: 'Trained under the legendary Joël Robuchon, Chef Antoine brings the art of French haute cuisine to your private dining experience. Each menu is a masterpiece of flavor, technique, and seasonal ingredients.',
        tags: ['French Cuisine', 'Private Dining', 'Tasting Menu', 'Wine Pairing'],
        portfolio: [
            { type: 'image', url: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Meticulous plating' }, 
            { type: 'image', url: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Exquisite dessert creation' }
        ],
        reviews: [], 
        servicePlans: defaultServicePlans.map(p => ({...p, id: `plan-4-${p.id}`, price: p.price * 2.5, addOns: chefAddOns })), 
        isVerified: true, 
        isCertified: true,
        hourlyRate: 350,
        jobsCompleted: 15,
        responseRate: 95,
        availability: getCurrentMonthBookedDates(3),
        badges: talentBadges['talent-4'],
        loyaltyTier: 'standard',
        socials: {
            instagram: '#',
            youtube: '#',
        }
    },
    { 
        id: 'talent-5', userId: 'user-7', user: talentUser4, category: 'Live Band', city: 'Nashville', 
        bio: 'The Velvet Tones are a premier 4-piece jazz and soul band, delivering sophisticated and vibrant performances. Their rich sound is perfect for galas, weddings, and upscale lounges.',
        tags: ['Jazz', 'Soul', 'Funk', 'Cover Band', 'Corporate'],
        portfolio: [
            { type: 'image', url: 'https://images.pexels.com/photos/3774903/pexels-photo-3774903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Energetic live performance' }, 
            { type: 'image', url: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Sophisticated stage presence' }
        ],
        reviews: [], 
        servicePlans: defaultServicePlans.map(p => ({...p, id: `plan-5-${p.id}`, price: p.price * 4})), 
        isVerified: true, 
        hourlyRate: 800,
        jobsCompleted: 30,
        responseRate: 99,
        availability: getCurrentMonthBookedDates(4),
        loyaltyTier: 'standard',
        socials: {
            youtube: '#',
            facebook: '#',
        }
    },
    { 
        id: 'talent-6', userId: 'user-8', user: talentUser5, category: 'Mixologist', city: 'London', 
        bio: 'An award-winning mixologist who crafts bespoke cocktails with artisanal ingredients. Mike creates unique bar experiences tailored to your event\'s theme, delighting guests with both classic and innovative creations.',
        tags: ['Cocktails', 'Bartending', 'Flair', 'Corporate Events', 'Bespoke'],
        portfolio: [
            { type: 'image', url: 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Artisanal craft cocktail' }, 
            { type: 'image', url: 'https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', caption: 'Elegant bar setup' }
        ],
        reviews: [], 
        servicePlans: defaultServicePlans.map(p => ({...p, id: `plan-6-${p.id}`, price: p.price * 0.8, addOns: chefAddOns.slice(1)})), 
        isVerified: true, 
        hourlyRate: 120,
        jobsCompleted: 55,
        responseRate: 97,
        availability: getCurrentMonthBookedDates(5),
        collectiveId: 'collective-1',
        collectiveName: 'Aperture Artists',
        badges: talentBadges['talent-6'],
        loyaltyTier: 'premier',
        socials: {
            instagram: '#',
            tiktok: '#',
        }
    }
];


// VENUES
export const initialVenues: Venue[] = [
    { id: 'venue-1', userId: 'user-9', user: venueUser1, venueName: 'Soho House', address: 'Miami Beach, FL', capacity: 300, badges: [{ id: 'vbadge-1', name: 'Top Venue', description: 'A highly sought-after venue.', icon: 'TopVenue' }, {id: 'vbadge-4', name: 'Luxury Pick', description: 'Recognized for its luxurious amenities.', icon: 'LuxuryPick'}] },
    { id: 'venue-2', userId: 'user-10', user: venueUser2, venueName: 'The Plaza', address: 'New York, NY', capacity: 800, badges: [{ id: 'vbadge-2', name: 'Community Hub', description: 'Hosts frequent community events.', icon: 'CommunityHub' }, {id: 'vbadge-3', name: 'Highly Rated', description: 'Consistently receives high ratings.', icon: 'HighlyRatedVenue'}, {id: 'vbadge-5', name: 'Best Ambiance', description: 'Known for its exceptional atmosphere.', icon: 'BestAmbiance'}] },
];

// PROVIDERS
export const initialProviders: Provider[] = [
    {
        id: 'provider-1', userId: 'user-11', user: providerUser1, companyName: 'Sonic Boom Rentals', category: 'Audio & Sound', city: 'Miami',
        items: [
            { id: 'pi-1', providerId: 'provider-1', name: 'PA System (2x Speakers + Sub)', description: 'Perfect for parties up to 100 people.', category: 'Audio & Sound', pricePerHour: 50, image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: 5 },
            { id: 'pi-2', providerId: 'provider-1', name: 'Wireless Mic Kit', description: '2 Handheld Shure Microphones.', category: 'Audio & Sound', pricePerHour: 20, image: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: 10 },
            { id: 'pi-3', providerId: 'provider-1', name: 'Pioneer DJ Mixer', description: 'Industry standard DJ mixer.', category: 'Audio & Sound', pricePerHour: 40, image: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: 3 },
        ]
    },
    {
        id: 'provider-2', userId: 'user-12', user: providerUser2, companyName: 'Luxe Decor & Stage', category: 'Furniture & Decor', city: 'New York',
        items: [
            { id: 'pi-4', providerId: 'provider-2', name: 'Red Carpet (20ft)', description: 'Premium velvet red carpet.', category: 'Furniture & Decor', pricePerHour: 30, image: 'https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: 2 },
            { id: 'pi-5', providerId: 'provider-2', name: 'Stage Module (4x4)', description: 'Sturdy modular stage platform.', category: 'Stage & Structure', pricePerHour: 45, image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: 12 },
            { id: 'pi-6', providerId: 'provider-2', name: 'LED Moving Head Light', description: 'Professional stage lighting fixture.', category: 'Lighting', pricePerHour: 25, image: 'https://images.pexels.com/photos/5066347/pexels-photo-5066347.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: 20 },
             { id: 'pi-7', providerId: 'provider-2', name: 'Fog Machine', description: 'High-output fog machine for atmospheric effects.', category: 'Special FX', pricePerHour: 15, image: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=400', inStock: 5 },
        ]
    }
];

const allMockUsers = [
    adminUser, clientUser1, clientUser2, talentUser1, talentUser2, 
    pendingTalentUser, talentUser3, talentUser4, talentUser5, venueUser1, venueUser2, providerUser1, providerUser2
];

const getParticipantDetails = (participantIds: string[]) => {
    return participantIds.map(id => {
        const user = allMockUsers.find(u => u.id === id);
        return { id: user!.id, name: user!.name, avatar: user!.avatar, role: user!.role };
    });
};


// CONVERSATIONS
export const initialConversations: Conversation[] = [
    {
        id: 'conv-1',
        participants: ['user-1', 'user-3'],
        participantDetails: getParticipantDetails(['user-1', 'user-3']),
        messages: [
            { id: 'msg-1', senderId: 'user-1', text: 'Hi Clara, interested in booking you for a corporate event on Dec 15th. Your Silver Package looks perfect.', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'msg-2', senderId: 'user-3', text: 'Hi Alice, thanks for reaching out! I am available. The price for the Silver Package is $1200. Shall I send over the contract?', timestamp: new Date(Date.now() - 3500000).toISOString() }
        ],
        negotiation: {
            status: NegotiationStatus.NEGOTIATING,
            clientId: 'user-1',
            talentId: 'user-3',
            clientOffer: 1200,
            talentOffer: 1200,
            lastOfferBy: 'talent',
        },
        isReviewed: false,
    },
     {
        id: 'conv-2',
        participants: ['user-2', 'user-4'],
        participantDetails: getParticipantDetails(['user-2', 'user-4']),
        messages: [
            { id: 'msg-3', senderId: 'user-2', text: 'Hi David, your work is stunning. We have a wedding next June and would love to discuss a custom package.', timestamp: new Date(Date.now() - 86400000).toISOString() }
        ],
        negotiation: {
            status: NegotiationStatus.NEGOTIATING,
            clientId: 'user-2',
            talentId: 'user-4',
            clientOffer: null,
            talentOffer: null,
            lastOfferBy: 'client',
        },
        isReviewed: false,
    }
];

// EVENTS
const defaultTicketTiers: TicketTier[] = [
    { id: 'tier-1', name: 'General Admission', price: 250, totalQuantity: 100, sold: 20 },
    { id: 'tier-2', name: 'VIP Access', price: 500, totalQuantity: 25, sold: 5 },
];
const defaultEventProducts: EventProduct[] = [
    { id: 'prod-1', name: 'Signature Cocktail', price: 18, image: 'https://images.pexels.com/photos/9793284/pexels-photo-9793284.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'prod-2', name: 'Champagne Bottle', price: 150, image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'prod-3', name: 'Event T-Shirt', price: 45, image: 'https://images.pexels.com/photos/40662/fashion-men-s-fashion-shirt-collar-40662.jpeg?auto=compress&cs=tinysrgb&w=400' },
];


export const initialEvents: Event[] = [
    { 
        id: 'event-1', 
        title: 'Art Basel Afterparty', 
        date: '2024-12-05T22:00:00Z', 
        location: 'Soho House, Miami', 
        lat: 25.793, 
        lng: -80.141, 
        description: 'An exclusive afterparty for Art Basel featuring top international DJs, live art installations, and a premium open bar for VIPs.', 
        organizer: 'Soho House', 
        organizerId: 'user-9', 
        image: 'https://images.pexels.com/photos/2747600/pexels-photo-2747600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
        ticketTiers: defaultTicketTiers,
        products: defaultEventProducts,
        reviews: [
            { id: 'rev-event-1', author: 'Alice Johnson', clientId: 'user-1', rating: 5, comment: 'Incredible atmosphere and music. Best party of the year!', timestamp: new Date().toISOString() }
        ],
    },
    { 
        id: 'event-2', 
        title: 'NYFW Gala', 
        date: '2025-02-12T19:00:00Z', 
        location: 'The Plaza, New York', 
        lat: 40.764, 
        lng: -73.974, 
        description: 'The official closing gala for New York Fashion Week. A night of high fashion, celebrity appearances, and world-class entertainment.', 
        organizer: 'The Plaza', 
        organizerId: 'user-10', 
        image: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
        ticketTiers: [
            { id: 'tier-3', name: 'Standard Entry', price: 500, totalQuantity: 200, sold: 80 },
            { id: 'tier-4', name: 'Front Row VIP', price: 1500, totalQuantity: 50, sold: 49 },
        ],
        products: defaultEventProducts,
        reviews: [],
    },
];

// PURCHASED TICKETS
export const initialPurchasedTickets: PurchasedTicket[] = [
    { id: 'purch-1', eventId: 'event-1', tierId: 'tier-1', ownerId: 'user-1', purchaseDate: new Date().toISOString(), qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=purch-1`, purchasedProducts: [{productId: 'prod-1', name: 'Signature Cocktail', quantity: 2}] },
    { id: 'purch-2', eventId: 'event-2', tierId: 'tier-4', ownerId: 'user-1', purchaseDate: new Date().toISOString(), qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=purch-2` },
    { id: 'purch-3', eventId: 'event-2', tierId: 'tier-3', ownerId: 'user-2', purchaseDate: new Date().toISOString(), qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=purch-3` }
];


// RESALE TICKETS
export const mockResaleTickets: ResaleTicket[] = [
    { id: 'resale-1', ticketId: 'purch-4-resale', eventId: 'event-1', tierId: 'tier-1', sellerId: 'user-2', price: 300, listedDate: new Date().toISOString() },
];

// WALLET
export const initialWallet: Wallet = {
    balance: 5000,
    escrow: 0,
    transactions: [
        { id: 'txn-1', date: new Date(Date.now() - 86400000 * 7).toISOString(), description: 'Initial Deposit', amount: 5000, type: 'deposit' }
    ],
};
