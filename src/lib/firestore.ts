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
  writeBatch,
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
  ServicePlan,
  PayoutMethod,
  TalentReview,
  AdminActor,
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
    city: string;
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
    city: data.city,
    bio: "",
    tags: [],
    portfolio: [],
    reviews: [],
    servicePlans: [],
    isVerified: false,
    // Listed in the marketplace only once an admin approves the account.
    isApproved: false,
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
    // Only approved accounts are listed. `isApproved` is written by admins
    // alone (see firestore.rules), mirroring the private `users.status`.
    const talentsSnap = await getDocs(
      query(collection(db, "talents"), where("isApproved", "==", true))
    );

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
// Returns the 1:1 conversation between two users, creating it if needed.
export async function getOrCreateConversation(
  currentUserId: string,
  currentUserName: string,
  otherUserId: string,
  otherUserName: string
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
  if (existing) return existing.id;

  const ref = await addDoc(collection(db, "conversations"), {
    participants: [currentUserId, otherUserId],
    participantNames: {
      [currentUserId]: currentUserName,
      [otherUserId]: otherUserName,
    },
    lastMessage: "",
    lastMessageTime: serverTimestamp(),
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

// Audit entries are written in the same batch/transaction as the admin
// action they describe, so an action can never succeed without its record.
// The client cannot know its own IP; a trustworthy one needs a server.
export function auditEntry(actor: AdminActor, action: string, level: AuditLog["level"] = "Info") {
  return {
    ref: doc(collection(db, "auditLogs")),
    data: {
      userId: actor.id,
      userName: actor.name,
      action,
      ipAddress: "",
      level,
      timestamp: serverTimestamp(),
    },
  };
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

export async function updateApprovalStatus(
  id: string,
  status: ApprovalStatus,
  actor: AdminActor
): Promise<void> {
  const ref = doc(db, "approvals", id);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  const batch = writeBatch(db);
  batch.update(ref, { status });

  // If this approval is tied to a user (identity verification), resolving it
  // also flips the user's account status: approved → active, rejected → rejected.
  const userId = data.userId as string | undefined;
  if (userId && status !== "pending") {
    const userStatus = status === "approved" ? UserStatus.ACTIVE : UserStatus.REJECTED;
    batch.update(doc(db, "users", userId), { status: userStatus });
    await syncTalentListing(batch, userId, userStatus);
  }

  const log = auditEntry(actor, `Approval ${status}: ${data.type ?? "request"} — ${data.name ?? id}`);
  batch.set(log.ref, log.data);
  await batch.commit();
}

// Mirrors the private account status onto the public talent doc, which is
// what the marketplace query filters on.
async function syncTalentListing(
  batch: ReturnType<typeof writeBatch>,
  userId: string,
  status: UserStatus
): Promise<void> {
  const talentRef = doc(db, "talents", userId);
  if ((await getDoc(talentRef)).exists()) {
    batch.update(talentRef, { isApproved: status === UserStatus.ACTIVE });
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
  pendingAccounts: number;
  pendingPayments: number;
}> {
  const [usersSnap, venuesSnap, paymentsSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "venues")),
    getDocs(query(collection(db, "transactions"), where("status", "==", "processing"))),
  ]);
  const users = usersSnap.docs.map((d) => d.data());
  return {
    totalUsers: users.length,
    activeArtists: users.filter(
      (u) => u.role === UserRole.ARTIST && u.status === UserStatus.ACTIVE
    ).length,
    venues: venuesSnap.size,
    // Same source as the Accounts page, so the two numbers always agree.
    pendingAccounts: users.filter((u) => u.status === UserStatus.PENDING).length,
    pendingPayments: paymentsSnap.size,
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

// Deposits and withdrawals are REQUESTS: the user records the movement as
// `processing` and the balance only changes when an admin verifies it
// (`resolveTransaction`). The security rules enforce both halves.

export async function recordDeposit(data: {
  userId: string;
  amount: number;
  source: TransactionSource;
  description: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, "transactions"), {
    userId: data.userId,
    description: data.description,
    amount: data.amount,
    type: "deposit",
    source: data.source,
    status: "processing" as TransactionStatus,
    createdAt: serverTimestamp(),
  });
  await notifySelf(data.userId, "Deposit received for review",
    `Your $${data.amount.toFixed(2)} deposit will be added to your balance once it is verified.`);
  return ref.id;
}

export async function recordWithdrawal(data: {
  userId: string;
  amount: number;
  description: string;
}): Promise<string> {
  const [walletSnap, payoutSnap, pendingSnap] = await Promise.all([
    getDoc(doc(db, "wallets", data.userId)),
    getDoc(doc(db, "payoutMethods", data.userId)),
    getDocs(
      query(
        collection(db, "transactions"),
        where("userId", "==", data.userId),
        where("status", "==", "processing")
      )
    ),
  ]);

  if (!payoutSnap.exists()) {
    throw new Error("Add a payout method before requesting a withdrawal.");
  }
  const balance = walletSnap.exists() ? walletSnap.data().balance || 0 : 0;
  const alreadyRequested = pendingSnap.docs
    .map((d) => d.data())
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + Math.abs(t.amount as number), 0);
  if (balance - alreadyRequested < data.amount) {
    throw new Error("Insufficient available balance for this withdrawal.");
  }

  const ref = await addDoc(collection(db, "transactions"), {
    userId: data.userId,
    description: data.description,
    amount: -data.amount,
    type: "withdrawal",
    source: "manual_transfer" as TransactionSource,
    status: "processing" as TransactionStatus,
    createdAt: serverTimestamp(),
  });
  await notifySelf(data.userId, "Withdrawal requested",
    `Your $${data.amount.toFixed(2)} withdrawal is being reviewed.`);
  return ref.id;
}

// A notification is a courtesy: failing to write it must not undo the
// movement it describes.
async function notifySelf(userId: string, title: string, description: string) {
  try {
    await createNotification({ userId, type: "payment", title, description });
  } catch {
    // ignored on purpose
  }
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

// What decides whether, and where, a talent is listed in the marketplace.
export async function updateTalentListing(uid: string, data: { category: string; city: string }): Promise<void> {
  await updateDoc(doc(db, "talents", uid), data);
}

// The plans a client can request from the talent's profile. Prices are whole
// dollars: the hiring flow's split depends on it and the rules check it.
export async function updateTalentPlans(uid: string, servicePlans: ServicePlan[]): Promise<void> {
  await updateDoc(doc(db, "talents", uid), { servicePlans });
}

// ─── Admin: accounts & manual credit ────────────────────────────

// Lists every user (admin-only; the security rules gate the reads). Sorted in
// memory so accounts without a `createdAt` field aren't dropped by `orderBy`.
export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs
    .map((d) => docToData<User>(d))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

// Admin sets an account's status directly (approve / suspend / reactivate).
export async function setUserStatus(
  uid: string,
  status: UserStatus,
  actor: AdminActor,
  userName = uid
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, "users", uid), { status });
  await syncTalentListing(batch, uid, status);
  const log = auditEntry(
    actor,
    `Account set to ${status}: ${userName}`,
    status === UserStatus.SUSPENDED ? "Warning" : "Info"
  );
  batch.set(log.ref, log.data);
  await batch.commit();
}

// Read-only wallet fetch (does not create the doc) — for showing a balance.
export async function getWallet(uid: string): Promise<WalletDoc | null> {
  const snap = await getDoc(doc(db, "wallets", uid));
  return snap.exists() ? docToData<WalletDoc>(snap) : null;
}

// Admin manually credits funds to a user's wallet (interim flow before Skrill).
export async function adminCreditWallet(
  data: { userId: string; amount: number; description: string; userName?: string },
  actor: AdminActor
): Promise<void> {
  if (data.amount <= 0) throw new Error("Amount must be greater than zero.");
  const walletRef = doc(db, "wallets", data.userId);
  const txRef = doc(collection(db, "transactions"));
  const log = auditEntry(
    actor,
    `Manual credit of $${data.amount.toFixed(2)} to ${data.userName ?? data.userId}`,
    "Warning"
  );
  await runTransaction(db, async (transaction) => {
    const walletSnap = await transaction.get(walletRef);
    transaction.set(txRef, {
      userId: data.userId,
      description: data.description || "Admin credit",
      amount: data.amount,
      type: "deposit",
      source: "manual_transfer" as TransactionSource,
      status: "completed" as TransactionStatus,
      createdAt: serverTimestamp(),
    });
    applyToBalance(transaction, walletRef, walletSnap, data.userId, data.amount);
    transaction.set(log.ref, log.data);
  });
}

export function applyToBalance(
  transaction: Parameters<Parameters<typeof runTransaction>[1]>[0],
  walletRef: ReturnType<typeof doc>,
  walletSnap: { exists(): boolean; data(): Record<string, unknown> | undefined },
  userId: string,
  delta: number
) {
  const current = walletSnap.exists() ? Number(walletSnap.data()?.balance) || 0 : 0;
  const next = Math.round((current + delta) * 100) / 100;
  if (next < 0) throw new Error("The wallet balance does not cover this movement.");
  if (walletSnap.exists()) {
    transaction.update(walletRef, { balance: next, updatedAt: serverTimestamp() });
  } else {
    transaction.set(walletRef, {
      userId,
      balance: next,
      escrow: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

// ─── Admin: payment verification ────────────────────────────────

// Every deposit/withdrawal waiting for an admin, oldest first.
export async function getPendingTransactions(): Promise<Transaction[]> {
  const snap = await getDocs(
    query(collection(db, "transactions"), where("status", "==", "processing"))
  );
  return snap.docs
    .map((d) => docToData<Transaction>(d))
    .sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
}

// The only place a user-requested movement reaches the balance. Verifying
// applies the amount (negative for withdrawals); rejecting leaves the balance
// untouched. Either way the request is closed and cannot be resolved twice.
export async function resolveTransaction(
  txId: string,
  decision: "completed" | "rejected",
  actor: AdminActor
): Promise<void> {
  const txRef = doc(db, "transactions", txId);
  let owner = "";
  let amount = 0;
  let type = "";
  await runTransaction(db, async (transaction) => {
    const txSnap = await transaction.get(txRef);
    if (!txSnap.exists()) throw new Error("Transaction not found.");
    const tx = txSnap.data();
    if (tx.status !== "processing") throw new Error("This movement was already resolved.");
    // Movements of a hiring are settled together with the hiring's own step
    // (see contrataciones.ts); resolving one here would skip that step.
    if (tx.contratacionId) throw new Error("This movement belongs to a booking; settle it from the bookings queue.");
    owner = tx.userId as string;
    amount = tx.amount as number;
    type = tx.type as string;

    const walletRef = doc(db, "wallets", owner);
    const walletSnap = await transaction.get(walletRef);
    if (decision === "completed") {
      applyToBalance(transaction, walletRef, walletSnap, owner, amount);
    }
    transaction.update(txRef, {
      status: decision,
      resolvedBy: actor.id,
      resolvedAt: serverTimestamp(),
    });
    const log = auditEntry(
      actor,
      `${type} of $${Math.abs(amount).toFixed(2)} ${decision === "completed" ? "verified" : "rejected"} (tx ${txId})`,
      decision === "completed" ? "Info" : "Warning"
    );
    transaction.set(log.ref, log.data);
  });

  try {
    await createNotification({
      userId: owner,
      type: "payment",
      title: decision === "completed" ? `Your ${type} was verified` : `Your ${type} was rejected`,
      description:
        decision === "completed"
          ? `$${Math.abs(amount).toFixed(2)} is now reflected in your balance.`
          : `Your $${Math.abs(amount).toFixed(2)} ${type} could not be verified. Your balance was not changed.`,
    });
  } catch {
    // The movement is already resolved; the notification is a courtesy.
  }
}

// ─── Talent payout methods ──────────────────────────────────────

export async function getPayoutMethod(uid: string): Promise<PayoutMethod | null> {
  const snap = await getDoc(doc(db, "payoutMethods", uid));
  return snap.exists() ? docToData<PayoutMethod>(snap) : null;
}

export async function savePayoutMethod(
  uid: string,
  data: Omit<PayoutMethod, "userId" | "updatedAt">
): Promise<void> {
  const ref = doc(db, "payoutMethods", uid);
  await setDoc(
    ref,
    { userId: uid, ...data, updatedAt: serverTimestamp() },
    { merge: false }
  );
}

// ─── Reviews ────────────────────────────────────────────────────

export async function getTalentReviews(talentId: string): Promise<TalentReview[]> {
  const snap = await getDocs(
    query(collection(db, "reviews"), where("talentId", "==", talentId))
  );
  const items = snap.docs.map((d) => docToData<TalentReview>(d));
  items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return items;
}
