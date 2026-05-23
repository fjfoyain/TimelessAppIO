import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  UserRole,
  UserStatus,
  User,
  Event as AppEvent,
  Booking,
  Conversation,
  PlanContext,
  Message,
  AppNotification,
  Service,
  Ticket,
  Category,
  AuditLog,
  Approval,
  ApprovalStatus,
  Venue,
  Talent,
  TalentWithUser,
  WalletDoc,
  Transaction,
  TransactionSource,
  TransactionStatus,
  Course,
  Project,
  ProjectStatus,
  PortfolioItem,
} from "@/types";

interface CreateUserProfileData {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function createUserProfile(
  data: CreateUserProfileData
): Promise<void> {
  await setDoc(doc(db, "users", data.uid), {
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: "",
    status: UserStatus.PENDING,
    createdAt: serverTimestamp(),
  });
}

export async function createArtistProfile(
  uid: string,
  data: {
    stageName: string;
    genre: string;
    bio: string;
    eventTypes: string[];
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
  }
): Promise<void> {
  // Build the doc explicitly so we never write `undefined` (Firestore rejects it).
  const profileData: Record<string, unknown> = {
    userId: uid,
    stageName: data.stageName,
    genre: data.genre,
    bio: data.bio,
    eventTypes: data.eventTypes,
    createdAt: serverTimestamp(),
  };
  if (data.instagram) profileData.instagram = data.instagram;
  if (data.spotify) profileData.spotify = data.spotify;
  if (data.soundcloud) profileData.soundcloud = data.soundcloud;

  await setDoc(doc(db, "artists", uid), profileData);
}

export async function createClientProfile(
  uid: string,
  data: {
    clientType: "individual" | "organization";
    fullName?: string;
    company?: string;
    role?: string;
    interest: string;
    budget: string;
    phone?: string;
  }
): Promise<void> {
  const profileData: Record<string, unknown> = {
    userId: uid,
    clientType: data.clientType,
    interest: data.interest,
    budget: data.budget,
    createdAt: serverTimestamp(),
  };
  if (data.fullName) profileData.fullName = data.fullName;
  if (data.company) profileData.company = data.company;
  if (data.role) profileData.role = data.role;
  if (data.phone) profileData.phone = data.phone;

  await setDoc(doc(db, "clients", uid), profileData);
}

export async function createTalentProfile(
  uid: string,
  data: {
    fullName: string;
    category: string;
    experience: string;
    baseRate: number;
    ratePer: string;
    eventTypes: string[];
    portfolioLink?: string;
  }
): Promise<void> {
  // Build a doc shaped like the `Talent` type so the talent shows up
  // correctly in the marketplace (rate, defaults for arrays, etc.).
  const profileData: Record<string, unknown> = {
    userId: uid,
    // Denormalized public fields — see S3 in ACTION_PLAN.md. Lets the
    // marketplace render talent cards without reading the private user doc.
    name: data.fullName,
    avatar: "",
    category: data.category,
    experience: data.experience,
    baseRate: data.baseRate,
    ratePer: data.ratePer,
    hourlyRate: data.baseRate,
    eventTypes: data.eventTypes,
    city: "",
    bio: "",
    tags: [],
    portfolio: [],
    reviews: [],
    servicePlans: [],
    isVerified: false,
    jobsCompleted: 0,
    responseRate: 0,
    createdAt: serverTimestamp(),
  };
  if (data.portfolioLink) profileData.portfolioLink = data.portfolioLink;

  await setDoc(doc(db, "talents", uid), profileData);
}

export async function createVenueProfile(
  uid: string,
  data: {
    venueName: string;
    address: string;
    capacity: number;
    eventTypes: string[];
    equipment?: string;
    website?: string;
  }
): Promise<void> {
  // Build the doc explicitly so it matches the `Venue` type and so we never
  // write `undefined` field values (Firestore rejects them).
  const profileData: Record<string, unknown> = {
    userId: uid,
    venueName: data.venueName,
    address: data.address,
    capacity: data.capacity,
    eventTypes: data.eventTypes,
    createdAt: serverTimestamp(),
  };
  if (data.equipment) profileData.equipment = data.equipment;
  if (data.website) profileData.website = data.website;

  await setDoc(doc(db, "venues", uid), profileData);
}

export interface VenueProfileInput {
  venueName: string;
  address: string;
  capacity: number;
  eventTypes: string[];
  equipment?: string;
  website?: string;
}

// Create the venue doc if it doesn't exist yet, otherwise update it.
// Lets any authenticated user own a single venue (`venues/{uid}`).
export async function saveVenueProfile(
  uid: string,
  data: VenueProfileInput
): Promise<void> {
  const ref = doc(db, "venues", uid);
  const snap = await getDoc(ref);
  const base: Record<string, unknown> = {
    userId: uid,
    venueName: data.venueName,
    address: data.address,
    capacity: data.capacity,
    eventTypes: data.eventTypes,
    equipment: data.equipment || "",
    website: data.website || "",
    updatedAt: serverTimestamp(),
  };
  if (snap.exists()) {
    await updateDoc(ref, base);
  } else {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() });
  }
}

// ─── Helper: convert Firestore Timestamps to ISO strings ────────

function docToData<T>(docSnap: { id: string; data: () => Record<string, unknown> | undefined }): T {
  const raw = docSnap.data() || {};
  const cleaned: Record<string, unknown> = { id: docSnap.id };
  for (const [key, val] of Object.entries(raw)) {
    cleaned[key] = val instanceof Timestamp ? val.toDate().toISOString() : val;
  }
  return cleaned as T;
}

// ─── User Profile ────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? docToData<User>(snap) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<User, "name" | "avatar" | "jobTitle" | "bio" | "portfolioLink">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);

  // Keep the denormalized public copy on the talent profile (if any) in sync,
  // so the marketplace doesn't show a stale name/avatar.
  if (data.name !== undefined || data.avatar !== undefined) {
    try {
      const talentRef = doc(db, "talents", uid);
      const talentSnap = await getDoc(talentRef);
      if (talentSnap.exists()) {
        const sync: Record<string, unknown> = {};
        if (data.name !== undefined) sync.name = data.name;
        if (data.avatar !== undefined) sync.avatar = data.avatar;
        await updateDoc(talentRef, sync);
      }
    } catch {
      // Non-fatal: the user doc was already updated.
    }
  }
}

// ─── Venues (query) ──────────────────────────────────────────────

export async function getVenues(): Promise<Venue[]> {
  const snap = await getDocs(collection(db, "venues"));
  return snap.docs.map((d) => docToData<Venue>(d));
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const snap = await getDoc(doc(db, "venues", id));
  return snap.exists() ? docToData<Venue>(snap) : null;
}

// ─── Talents (marketplace) ───────────────────────────────────────

export async function getAllTalents(): Promise<TalentWithUser[]> {
  try {
    const talentsSnap = await getDocs(collection(db, "talents"));

    // Build cards purely from the public `talents` docs — the private
    // `users` collection is no longer read here (see S3 in ACTION_PLAN.md).
    return talentsSnap.docs
      .map((talentDoc) => {
        try {
          const talentData = docToData<Talent>(talentDoc);
          return {
            talent: {
              ...talentData,
              portfolio: talentData.portfolio ?? [],
              reviews: talentData.reviews ?? [],
              servicePlans: talentData.servicePlans ?? [],
              tags: talentData.tags ?? [],
              city: talentData.city || "",
              bio: talentData.bio || "",
              isVerified: talentData.isVerified ?? false,
              jobsCompleted: talentData.jobsCompleted ?? 0,
              responseRate: talentData.responseRate ?? 0,
            },
            user: talentToPublicUser(talentData),
          } as TalentWithUser;
        } catch {
          // Skip individual talent if its data can't be read
          return null;
        }
      })
      .filter((r): r is TalentWithUser => r !== null);
  } catch {
    return [];
  }
}

// Builds the minimal, public-safe `User` object the marketplace needs from a
// talent's denormalized fields. Never exposes email or other private data.
function talentToPublicUser(talentData: Talent): User {
  return {
    id: talentData.userId,
    name: talentData.name || "Talent",
    avatar: talentData.avatar || "",
    email: "",
    role: UserRole.TALENT,
    status: UserStatus.ACTIVE,
  };
}

export async function getTalentWithUser(talentId: string): Promise<TalentWithUser | null> {
  try {
    const talentSnap = await getDoc(doc(db, "talents", talentId));
    if (!talentSnap.exists()) return null;

    const talentData = docToData<Talent>(talentSnap);

    return {
      talent: {
        ...talentData,
        portfolio: talentData.portfolio ?? [],
        reviews: talentData.reviews ?? [],
        servicePlans: talentData.servicePlans ?? [],
        tags: talentData.tags ?? [],
        city: talentData.city || "",
        bio: talentData.bio || "",
        isVerified: talentData.isVerified ?? false,
        jobsCompleted: talentData.jobsCompleted ?? 0,
        responseRate: talentData.responseRate ?? 0,
      },
      user: talentToPublicUser(talentData),
    };
  } catch {
    return null;
  }
}

// ─── Talent / Venue by userId ────────────────────────────────────

export async function getTalentByUserId(userId: string): Promise<Talent | null> {
  const q = query(collection(db, "talents"), where("userId", "==", userId), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return docToData<Talent>(snap.docs[0]);
}

export async function getVenueByUserId(userId: string): Promise<Venue | null> {
  const q = query(collection(db, "venues"), where("userId", "==", userId), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return docToData<Venue>(snap.docs[0]);
}

// ─── Events ──────────────────────────────────────────────────────

export async function createEvent(data: {
  title: string;
  description: string;
  date: string;
  time: string;
  venueId: string;
  location: string;
  organizerId: string;
  organizer: string;
  services: string[];
}): Promise<string> {
  const ref = await addDoc(collection(db, "events"), {
    ...data,
    status: "published",
    image: "",
    lat: 0,
    lng: 0,
    ticketTiers: [],
    products: [],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getEvents(organizerId?: string): Promise<AppEvent[]> {
  const q = organizerId
    ? query(collection(db, "events"), where("organizerId", "==", organizerId), orderBy("createdAt", "desc"))
    : query(collection(db, "events"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<AppEvent>(d));
}

export async function getEventById(id: string): Promise<AppEvent | null> {
  const snap = await getDoc(doc(db, "events", id));
  return snap.exists() ? docToData<AppEvent>(snap) : null;
}

// ─── Bookings ────────────────────────────────────────────────────

export async function createBooking(data: {
  userId: string;
  title: string;
  day: string;
  hour: number;
  duration: number;
  color: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<Booking>(d));
}

export async function deleteBooking(id: string): Promise<void> {
  await deleteDoc(doc(db, "bookings", id));
}

// ─── Conversations & Messages ────────────────────────────────────

export async function createConversation(
  participants: string[],
  participantNames: Record<string, string>
): Promise<string> {
  const ref = await addDoc(collection(db, "conversations"), {
    participants,
    participantNames,
    lastMessage: "",
    lastMessageTime: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Returns the existing 1:1 conversation between two users, or creates one.
// Optionally attaches the service-plan context that started the conversation.
export async function getOrCreateConversation(
  currentUserId: string,
  currentUserName: string,
  otherUserId: string,
  otherUserName: string,
  planContext?: PlanContext
): Promise<string> {
  const snap = await getDocs(
    query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUserId)
    )
  );
  const existing = snap.docs.find((d) => {
    const parts = (d.data().participants as string[] | undefined) ?? [];
    return parts.includes(otherUserId);
  });

  if (existing) {
    // Attach plan context if the conversation doesn't already have one.
    if (planContext && !existing.data().planContext) {
      await updateDoc(existing.ref, { planContext });
    }
    return existing.id;
  }

  const ref = await addDoc(collection(db, "conversations"), {
    participants: [currentUserId, otherUserId],
    participantNames: {
      [currentUserId]: currentUserName,
      [otherUserId]: otherUserName,
    },
    lastMessage: "",
    lastMessageTime: serverTimestamp(),
    ...(planContext ? { planContext } : {}),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToConversations(
  userId: string,
  callback: (convos: Conversation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
    orderBy("lastMessageTime", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToData<Conversation>(d)));
  });
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<void> {
  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
  });
}

export function subscribeToMessages(
  conversationId: string,
  callback: (msgs: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToData<Message>(d)));
  });
}

// ─── Notifications ───────────────────────────────────────────────

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  description: string;
  actions?: { label: string; primary?: boolean }[];
}): Promise<string> {
  const ref = await addDoc(collection(db, "notifications"), {
    ...data,
    isNew: true,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifs: AppNotification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToData<AppNotification>(d)));
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, "notifications", id), { isNew: false });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("isNew", "==", true)
  );
  const snap = await getDocs(q);
  const updates = snap.docs.map((d) => updateDoc(d.ref, { isNew: false }));
  await Promise.all(updates);
}

// ─── Services ────────────────────────────────────────────────────

export async function createService(data: {
  userId: string;
  name: string;
  category: string;
  description: string;
  hourlyRate: number;
  availability: string[];
  image?: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, "services"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserServices(userId: string): Promise<Service[]> {
  const q = query(collection(db, "services"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<Service>(d));
}

// ─── Tickets ─────────────────────────────────────────────────────

export async function createTicket(data: {
  userId: string;
  eventId: string;
  eventName: string;
  date: string;
  venue: string;
  type: "VIP" | "General" | "Backstage";
}): Promise<string> {
  const ref = await addDoc(collection(db, "tickets"), {
    ...data,
    status: "ACTIVE",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  const q = query(collection(db, "tickets"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<Ticket>(d));
}

// ─── Admin: Categories ───────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((d) => docToData<Category>(d));
}

export async function createCategory(data: Omit<Category, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "categories"), data);
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Omit<Category, "id">>): Promise<void> {
  await updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

// ─── Admin: Audit Logs ───────────────────────────────────────────

export async function createAuditLog(data: {
  userId?: string;
  userName: string;
  action: string;
  ipAddress: string;
  level: "Info" | "Warning" | "Error";
}): Promise<void> {
  await addDoc(collection(db, "auditLogs"), {
    ...data,
    timestamp: serverTimestamp(),
  });
}

export async function getAuditLogs(maxResults = 50): Promise<AuditLog[]> {
  const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"), limit(maxResults));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<AuditLog>(d));
}

// ─── Admin: Approvals ────────────────────────────────────────────

export async function getApprovals(status?: ApprovalStatus): Promise<Approval[]> {
  const q = status
    ? query(collection(db, "approvals"), where("status", "==", status), orderBy("createdAt", "desc"))
    : query(collection(db, "approvals"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<Approval>(d));
}

export async function updateApprovalStatus(id: string, status: ApprovalStatus): Promise<void> {
  const ref = doc(db, "approvals", id);
  const snap = await getDoc(ref);
  await updateDoc(ref, { status });

  // If this approval is tied to a user (identity verification), resolving it
  // also flips the user's account status: approved → active, rejected → rejected.
  const userId = snap.exists() ? (snap.data().userId as string | undefined) : undefined;
  if (userId) {
    if (status === "approved") {
      await updateDoc(doc(db, "users", userId), { status: UserStatus.ACTIVE });
    } else if (status === "rejected") {
      await updateDoc(doc(db, "users", userId), { status: UserStatus.REJECTED });
    }
  }
}

// ─── Account / Identity Verification ─────────────────────────────

// Creates a pending verification request that admins review. The uploaded
// document lives in Storage; only its URL is stored here.
export async function submitIdentityVerification(data: {
  userId: string;
  name: string;
  idType: string;
  documentUrl: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, "approvals"), {
    userId: data.userId,
    name: data.name,
    type: "Identity",
    status: "pending",
    documentUrl: data.documentUrl,
    description: `Identity verification — ${data.idType} submitted for review.`,
    avatar: data.name.charAt(0).toUpperCase(),
    submittedDate: new Date().toISOString().slice(0, 10),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Returns the user's most recent verification request, if any.
export async function getUserVerification(userId: string): Promise<Approval | null> {
  const snap = await getDocs(
    query(collection(db, "approvals"), where("userId", "==", userId))
  );
  if (snap.empty) return null;
  const items = snap.docs.map((d) => docToData<Approval>(d));
  items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return items[0];
}

// ─── Update Helpers (for post-upload doc updates) ────────────────

export async function updateEvent(
  id: string,
  data: Partial<Pick<AppEvent, "image" | "title" | "description" | "status">>
): Promise<void> {
  await updateDoc(doc(db, "events", id), data);
}

export async function updateArtistProfile(
  uid: string,
  data: Record<string, unknown>
): Promise<void> {
  await updateDoc(doc(db, "artists", uid), data);
}

// ─── Admin: Stats ────────────────────────────────────────────────

export async function getAdminStats(): Promise<{
  totalUsers: number;
  activeArtists: number;
  venues: number;
  pendingApprovals: number;
}> {
  const [usersSnap, artistsSnap, venuesSnap, approvalsSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(query(collection(db, "users"), where("role", "==", UserRole.ARTIST))),
    getDocs(collection(db, "venues")),
    getDocs(query(collection(db, "approvals"), where("status", "==", "pending"))),
  ]);
  return {
    totalUsers: usersSnap.size,
    activeArtists: artistsSnap.size,
    venues: venuesSnap.size,
    pendingApprovals: approvalsSnap.size,
  };
}

// ─── Wallet & Transactions ──────────────────────────────────────

export async function getOrCreateWallet(userId: string): Promise<WalletDoc> {
  const ref = doc(db, "wallets", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return docToData<WalletDoc>(snap);
  }
  const initial = {
    userId,
    balance: 0,
    escrow: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, initial);
  const newSnap = await getDoc(ref);
  return docToData<WalletDoc>(newSnap);
}

export function subscribeToWallet(
  userId: string,
  callback: (wallet: WalletDoc) => void
): Unsubscribe {
  const ref = doc(db, "wallets", userId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(docToData<WalletDoc>(snap));
    }
  });
}

export async function recordDeposit(data: {
  userId: string;
  amount: number;
  source: TransactionSource;
  description: string;
}): Promise<string> {
  const walletRef = doc(db, "wallets", data.userId);
  const txRef = doc(collection(db, "transactions"));

  await runTransaction(db, async (transaction) => {
    const walletSnap = await transaction.get(walletRef);
    let currentBalance = 0;
    if (walletSnap.exists()) {
      currentBalance = walletSnap.data().balance || 0;
    }

    transaction.set(txRef, {
      userId: data.userId,
      description: data.description,
      amount: data.amount,
      type: "deposit",
      source: data.source,
      status: data.source === "cash" ? "completed" : "processing",
      createdAt: serverTimestamp(),
    });

    if (walletSnap.exists()) {
      transaction.update(walletRef, {
        balance: currentBalance + data.amount,
        updatedAt: serverTimestamp(),
      });
    } else {
      transaction.set(walletRef, {
        userId: data.userId,
        balance: data.amount,
        escrow: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  });

  return txRef.id;
}

export async function recordWithdrawal(data: {
  userId: string;
  amount: number;
  description: string;
}): Promise<string> {
  const walletRef = doc(db, "wallets", data.userId);
  const txRef = doc(collection(db, "transactions"));

  await runTransaction(db, async (transaction) => {
    const walletSnap = await transaction.get(walletRef);

    if (!walletSnap.exists()) {
      throw new Error("Wallet not found. Please add funds first.");
    }

    const currentBalance = walletSnap.data().balance || 0;
    if (currentBalance < data.amount) {
      throw new Error("Insufficient balance for this withdrawal.");
    }

    transaction.set(txRef, {
      userId: data.userId,
      description: data.description,
      amount: -data.amount,
      type: "withdrawal",
      source: "manual_transfer" as TransactionSource,
      status: "processing" as TransactionStatus,
      createdAt: serverTimestamp(),
    });

    transaction.update(walletRef, {
      balance: currentBalance - data.amount,
      updatedAt: serverTimestamp(),
    });
  });

  return txRef.id;
}

export function subscribeToTransactions(
  userId: string,
  callback: (txs: Transaction[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToData<Transaction>(d)));
  });
}

export async function getUserTransactions(
  userId: string,
  maxResults = 50
): Promise<Transaction[]> {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<Transaction>(d));
}

export async function updateTransactionStatus(
  txId: string,
  status: TransactionStatus
): Promise<void> {
  await updateDoc(doc(db, "transactions", txId), { status });
}

// ─── Courses (Studio Classes) ───────────────────────────────────

export async function getCourses(category?: string): Promise<Course[]> {
  let q;
  if (category && category !== "All") {
    q = query(
      collection(db, "courses"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToData<Course>(d));
}

export async function createCourse(
  data: Omit<Course, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "courses"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Admin Analytics ────────────────────────────────────────────

export async function getAnalyticsMetrics(): Promise<{
  revenue: number;
  newUsers: number;
  totalEvents: number;
  totalBookings: number;
}> {
  const [txSnap, usersSnap, eventsSnap, bookingsSnap] = await Promise.all([
    getDocs(collection(db, "transactions")),
    getDocs(collection(db, "users")),
    getDocs(collection(db, "events")),
    getDocs(collection(db, "bookings")),
  ]);

  let revenue = 0;
  txSnap.docs.forEach((d) => {
    const data = d.data();
    if (data.type === "deposit" && data.status === "completed") {
      revenue += Math.abs(data.amount || 0);
    }
  });

  return {
    revenue,
    newUsers: usersSnap.size,
    totalEvents: eventsSnap.size,
    totalBookings: bookingsSnap.size,
  };
}

export async function getMonthlyRevenue(): Promise<{ month: string; amount: number }[]> {
  const snap = await getDocs(collection(db, "transactions"));
  const monthMap: Record<string, number> = {};

  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.type === "deposit" && data.status === "completed" && data.createdAt) {
      const ts = data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt);
      const key = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = (monthMap[key] || 0) + Math.abs(data.amount || 0);
    }
  });

  const months = Object.keys(monthMap).sort();
  // Keep last 6 months
  const recent = months.slice(-6);
  return recent.map((m) => ({ month: m, amount: monthMap[m] }));
}

export async function getTopCategories(): Promise<
  { name: string; bookings: number; revenue: number }[]
> {
  const [servicesSnap, bookingsSnap] = await Promise.all([
    getDocs(collection(db, "services")),
    getDocs(collection(db, "bookings")),
  ]);

  const categoryMap: Record<string, { bookings: number; revenue: number }> = {};

  servicesSnap.docs.forEach((d) => {
    const data = d.data();
    const cat = data.category || "Other";
    if (!categoryMap[cat]) categoryMap[cat] = { bookings: 0, revenue: 0 };
    categoryMap[cat].revenue += data.hourlyRate || 0;
  });

  bookingsSnap.docs.forEach(() => {
    // Count all bookings — we can refine when bookings store category
    if (!categoryMap["Sessions"]) categoryMap["Sessions"] = { bookings: 0, revenue: 0 };
    categoryMap["Sessions"].bookings += 1;
  });

  return Object.entries(categoryMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
}

// ─── Monthly User Signups (Admin Chart) ─────────────────────────

export async function getMonthlyUserSignups(): Promise<{ month: string; count: number }[]> {
  const snap = await getDocs(collection(db, "users"));
  const monthMap: Record<string, number> = {};

  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.createdAt) {
      const ts = data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt);
      const key = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    }
  });

  const months = Object.keys(monthMap).sort();
  const recent = months.slice(-6);
  return recent.map((m) => ({ month: m, count: monthMap[m] }));
}

// ─── Contact / Support Requests ─────────────────────────────────

export async function submitContactRequest(data: {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, "contactRequests"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Waitlist ───────────────────────────────────────────────────

export async function addToWaitlist(email: string): Promise<string> {
  const ref = await addDoc(collection(db, "waitlist"), {
    email,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── User Settings (Preferences) ───────────────────────────────

export async function updateUserSettings(
  userId: string,
  settings: Record<string, boolean | string>
): Promise<void> {
  await setDoc(doc(db, "userSettings", userId), settings, { merge: true });
}

export async function getUserSettings(
  userId: string
): Promise<Record<string, boolean | string> | null> {
  const snap = await getDoc(doc(db, "userSettings", userId));
  if (!snap.exists()) return null;
  return snap.data() as Record<string, boolean | string>;
}

// ─── Events Management ──────────────────────────────────────────

export async function deleteEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(db, "events", eventId));
}

export async function updateEventStatus(
  eventId: string,
  status: string
): Promise<void> {
  await updateDoc(doc(db, "events", eventId), { status });
}

// ─── Projects (Kanban) ──────────────────────────────────────────

export async function createProject(data: {
  userId: string;
  title: string;
  client?: string;
  notes?: string;
  status?: ProjectStatus;
}): Promise<string> {
  const docData: Record<string, unknown> = {
    userId: data.userId,
    title: data.title,
    status: data.status || "inquiry",
    createdAt: serverTimestamp(),
  };
  if (data.client) docData.client = data.client;
  if (data.notes) docData.notes = data.notes;

  const ref = await addDoc(collection(db, "projects"), docData);
  return ref.id;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const snap = await getDocs(
    query(collection(db, "projects"), where("userId", "==", userId))
  );
  const items = snap.docs.map((d) => docToData<Project>(d));
  // Sort newest first without needing a composite index.
  items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return items;
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<void> {
  await updateDoc(doc(db, "projects", id), { status });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

// ─── Talent Portfolio ───────────────────────────────────────────

export async function updateTalentPortfolio(
  uid: string,
  portfolio: PortfolioItem[]
): Promise<void> {
  await updateDoc(doc(db, "talents", uid), { portfolio });
}
