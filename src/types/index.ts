
// types.ts

export enum UserRole {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
    TALENT = 'TALENT',
    VENUE = 'VENUE',
    PROVIDER = 'PROVIDER',
}

export enum UserStatus {
    ACTIVE = 'Active',
    PENDING = 'Pending',
    SUSPENDED = 'Suspended',
    REJECTED = 'Rejected',
}

export enum NegotiationStatus {
    NEGOTIATING = 'Negotiating',
    AGREED = 'Agreement Reached',
    CONTRACT_SENT = 'Contract Sent',
    PAID = 'Paid & Confirmed',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
    IN_DISPUTE = 'In Dispute',
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    avatar: string;
    status: UserStatus;
    portfolio?: { title: string, url: string }[];
}

export interface PortfolioItem {
    type: 'image' | 'video';
    url: string;
    caption?: string;
}

export interface Review {
    id: string;
    author: string;
    clientId: string;
    rating: number; // 1-5
    comment: string;
    timestamp: string;
}

export interface AddOn {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface ServicePlan {
    id: string;
    title: string;
    description: string;
    price: number;
    includes: string[];
    addOns?: AddOn[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: 'TopRated' | 'HighlyBooked' | 'FastResponder' | 'RisingStar' | 'CommunityPick' | 'TopVenue' | 'HighlyRatedVenue' | 'CommunityHub' | 'LuxuryPick' | 'BestAmbiance';
    tier?: 'bronze' | 'silver' | 'gold';
}

export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    spotify?: string;
    appleMusic?: string;
    deezer?: string;
    youtubeMusic?: string;
    tidal?: string;
    mixcloud?: string;
    soundcloud?: string;
    flickr?: string;
    behance?: string;
    fiveHundredPx?: string;
}

export interface Talent {
    id:string;
    userId: string;
    user: User;
    category: string;
    city: string;
    bio: string;
    tags: string[];
    portfolio: PortfolioItem[];
    reviews: Review[];
    servicePlans: ServicePlan[];
    isVerified: boolean;
    isCertified?: boolean;
    hourlyRate?: number;
    jobsCompleted: number;
    responseRate: number;
    availability?: string[];
    contractUrl?: string;
    riderUrl?: string;
    collectiveId?: string;
    collectiveName?: string;
    badges?: Badge[];
    loyaltyTier?: 'standard' | 'premier';
    socials?: SocialLinks;
}

export interface Venue {
    id: string;
    userId: string;
    user: User;
    venueName: string;
    address: string;
    capacity: number;
    badges?: Badge[];
}

export type ProviderCategory = 
    | 'Audio & Sound' 
    | 'Lighting' 
    | 'Stage & Structure' 
    | 'Video & Multimedia' 
    | 'Furniture & Decor' 
    | 'Production Services' 
    | 'Power & Security' 
    | 'Catering Equipment' 
    | 'Transport & Logistics' 
    | 'Special FX';

export interface ProviderItem {
    id: string;
    providerId: string;
    name: string;
    description: string;
    category: ProviderCategory;
    pricePerHour: number;
    image: string;
    inStock: number;
}

export interface Provider {
    id: string;
    userId: string;
    user: User;
    companyName: string;
    category: ProviderCategory;
    items: ProviderItem[];
    city: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isSystem?: boolean;
}

export interface ParticipantDetails {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
}

export interface Negotiation {
    status: NegotiationStatus;
    clientId: string;
    talentId: string;
    clientOffer: number | null;
    talentOffer: number | null;
    contractDetails?: string;
    finalPrice?: number;
    downPayment?: number;
    lastOfferBy?: 'client' | 'talent';
}

export interface StructuredBrief {
    eventType: string;
    audienceSize: string;
    vibe: string;
    budget: string;
    durationHours: number;
    startTime: string;
}

export interface RentedItem {
    itemId: string;
    name: string;
    quantity: number;
    pricePerHour: number;
    totalPrice: number;
}

export interface Conversation {
    id: string;
    participants: string[];
    participantDetails: ParticipantDetails[];
    messages: Message[];
    negotiation: Negotiation;
    lastUpdated?: string;
    eventId?: string;
    brief?: StructuredBrief;
    editableBrief?: StructuredBrief;
    selectedAddOns?: AddOn[];
    rentedItems?: RentedItem[]; // Items from Providers
    serviceLocation?: { lat: number; lng: number; address: string; };
    eventDate?: string;
    isReviewed?: boolean;
}

export interface TicketTier {
    id: string;
    name: string;
    price: number;
    totalQuantity: number;
    sold: number;
}

export interface EventProduct {
    id: string;
    name: string;
    price: number;
    image: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    lat: number;
    lng: number;
    description: string;
    organizer: string;
    organizerId: string;
    image: string;
    ticketTiers: TicketTier[];
    products: EventProduct[];
    reviews?: Review[];
}

export interface PurchasedTicket {
    id: string;
    eventId: string;
    tierId: string;
    ownerId: string;
    purchaseDate: string;
    qrCodeUrl?: string;
    resalePrice?: number;
    purchasedProducts?: { productId: string, name: string, quantity: number }[];
}

export interface ResaleTicket {
    id: string;
    ticketId: string;
    eventId: string;
    tierId: string;
    sellerId: string;
    price: number;
    listedDate: string;
    purchasedProducts?: { productId: string, name: string, quantity: number }[];
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'payment' | 'payout' | 'refund' | 'commission' | 'reservation';
}

export interface Wallet {
    balance: number;
    escrow: number;
    transactions: Transaction[];
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'message';
    link?: string;
    timestamp: string;
    read: boolean;
}

export interface AppSettings {
    commissionRate: number;
    premierCommissionRate?: number;
    premierTierRequirement?: number;
    categories: string[];
    tags: string[];
}
