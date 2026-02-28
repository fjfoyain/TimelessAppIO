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
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
  }
): Promise<void> {
  await setDoc(doc(db, "artists", uid), {
    userId: uid,
    ...data,
    createdAt: serverTimestamp(),
  });
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
    portfolioLink?: string;
  }
): Promise<void> {
  await setDoc(doc(db, "talents", uid), {
    userId: uid,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function createVenueProfile(
  uid: string,
  data: {
    venueName: string;
    location: string;
    capacity: number;
    eventTypes: string[];
    equipment?: string;
    websiteLink?: string;
  }
): Promise<void> {
  await setDoc(doc(db, "venues", uid), {
    userId: uid,
    ...data,
    createdAt: serverTimestamp(),
  });
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
}

// ─── Venues (query) ──────────────────────────────────────────────

export async function getVenues(): Promise<Venue[]> {
  const snap = await getDocs(collection(db, "venues"));
  return snap.docs.map((d) => docToData<Venue>(d));
}

// ─── Events ──────────────────────────────────────────────────────

export async function createEvent(data: {
  title: string;
  description: string;
  date: string;
  time: string;
  venueId: string;
  organizerId: string;
  organizer: string;
  services: string[];
}): Promise<string> {
  const ref = await addDoc(collection(db, "events"), {
    ...data,
    status: "published",
    image: "",
    location: "",
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
  await updateDoc(doc(db, "approvals", id), { status });
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
