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
