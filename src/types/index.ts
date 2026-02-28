export enum UserRole {
  ADMIN = "ADMIN",
  ARTIST = "ARTIST",
  CLIENT = "CLIENT",
  TALENT = "TALENT",
  VENUE = "VENUE",
  PROVIDER = "PROVIDER",
}

export enum UserStatus {
  ACTIVE = "Active",
  PENDING = "Pending",
  SUSPENDED = "Suspended",
  REJECTED = "Rejected",
}

export enum NegotiationStatus {
  NEGOTIATING = "Negotiating",
  AGREED = "Agreement Reached",
  CONTRACT_SENT = "Contract Sent",
  PAID = "Paid & Confirmed",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  IN_DISPUTE = "In Dispute",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: UserStatus;
  jobTitle?: string;
  bio?: string;
  portfolioLink?: string;
  createdAt?: string;
  // Web3-ready (future)
  walletAddress?: string;
  chainId?: number;
  did?: string; // Decentralized Identifier
}

export interface PortfolioItem {
  type: "image" | "video";
  url: string;
  caption?: string;
}

export interface Review {
  id: string;
  author: string;
  clientId: string;
  rating: number;
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
  icon: string;
  tier?: "bronze" | "silver" | "gold";
  // Web3-ready (future) — soulbound NFT badges
  nftContractAddress?: string;
  tokenId?: string;
  chainId?: number;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  spotify?: string;
  appleMusic?: string;
  soundcloud?: string;
}

export interface Talent {
  id: string;
  userId: string;
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
  badges?: Badge[];
  socials?: SocialLinks;
}

export interface Venue {
  id: string;
  userId: string;
  venueName: string;
  address: string;
  capacity: number;
  eventTypes?: string[];
  equipment?: string;
  website?: string;
  badges?: Badge[];
}

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  lat: number;
  lng: number;
  description: string;
  organizer: string;
  organizerId: string;
  image: string;
  venueId?: string;
  services?: string[];
  status?: EventStatus;
  ticketTiers: TicketTier[];
  products: EventProduct[];
  reviews?: Review[];
  createdAt?: string;
  // Web3-ready (future)
  isTokenGated?: boolean;
  requiredTokenAddress?: string;
  requiredChainId?: number;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  totalQuantity: number;
  sold: number;
  // Web3-ready (future)
  nftContractAddress?: string;
  chainId?: number;
  isNFTTicket?: boolean;
}

export interface EventProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "deposit" | "withdrawal" | "payment" | "payout" | "refund" | "commission";
  // Web3-ready (future)
  txHash?: string;
  chainId?: number;
  tokenAddress?: string;
  isOnChain?: boolean;
}

export interface Wallet {
  balance: number;
  escrow: number;
  transactions: Transaction[];
  // Web3-ready (future)
  connectedWallets?: ConnectedWallet[];
  cryptoBalances?: CryptoBalance[];
}

// ─── Firestore Collection Types ───────────────────────────────────

export type NotificationType = "contract" | "message" | "payment" | "security" | "draft";

export interface Booking {
  id: string;
  userId: string;
  title: string;
  day: string;
  hour: number;
  duration: number;
  color: string;
  createdAt?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
  lastMessageTime: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  isNew: boolean;
  actions?: { label: string; primary?: boolean }[];
  createdAt?: string;
}

export interface Service {
  id: string;
  userId: string;
  name: string;
  category: string;
  description: string;
  hourlyRate: number;
  availability: string[];
  image?: string;
  createdAt?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  eventName: string;
  date: string;
  venue: string;
  type: "VIP" | "General" | "Backstage";
  status: "ACTIVE" | "USED" | "EXPIRED";
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  parent: string;
  itemCount: number;
  icon: string;
}

export type LogLevel = "Info" | "Warning" | "Error";

export interface AuditLog {
  id: string;
  userId?: string;
  userName: string;
  action: string;
  ipAddress: string;
  level: LogLevel;
  timestamp: string;
}

export type ApprovalType = "Venue" | "Talent" | "Event";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  id: string;
  name: string;
  type: ApprovalType;
  submittedDate: string;
  avatar: string;
  description: string;
  status: ApprovalStatus;
  createdAt?: string;
}

// Web3 types (future use — not implemented yet)

export interface ConnectedWallet {
  address: string;
  chainId: number;
  provider: "metamask" | "walletconnect" | "coinbase" | "phantom" | string;
  isPrimary: boolean;
}

export interface CryptoBalance {
  tokenAddress: string;
  symbol: string;
  balance: string; // BigNumber as string
  chainId: number;
}

export interface NFTTicket {
  contractAddress: string;
  tokenId: string;
  chainId: number;
  metadataUri: string;
  ownerAddress: string;
  eventId: string;
  tierId: string;
  isUsed: boolean;
}

export interface CreatorToken {
  contractAddress: string;
  symbol: string;
  chainId: number;
  totalSupply: string;
  creatorId: string;
}
