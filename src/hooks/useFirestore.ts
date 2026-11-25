"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getEvents,
  getUserBookings,
  createBooking as fbCreateBooking,
  deleteBooking as fbDeleteBooking,
  subscribeToConversations,
  subscribeToMessages,
  sendMessage as fbSendMessage,
  subscribeToNotifications,
  markNotificationRead as fbMarkRead,
  markAllNotificationsRead as fbMarkAllRead,
  getUserTickets,
  getUserServices,
  getAdminStats,
  getApprovals,
  updateApprovalStatus,
  getCategories,
  createCategory as fbCreateCategory,
  updateCategory as fbUpdateCategory,
  deleteCategory as fbDeleteCategory,
  getAuditLogs,
  getOrCreateWallet,
  subscribeToWallet,
  subscribeToTransactions,
  recordDeposit as fbRecordDeposit,
  recordWithdrawal as fbRecordWithdrawal,
  getAllTalents,
  getTalentWithUser,
  getTalentByUserId,
  getVenueByUserId,
  getCourses,
  getAnalyticsMetrics,
  getMonthlyRevenue,
  getTopCategories,
  getMonthlyUserSignups,
  getUserProjects,
  createProject as fbCreateProject,
  updateProjectStatus as fbUpdateProjectStatus,
  deleteProject as fbDeleteProject,
} from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeContratacion,
  subscribeContrataciones,
  subscribeMovimientos,
  subscribeTransiciones,
  type Movimiento,
  type MovimientoTipo,
} from "@/lib/contrataciones";
import type { Contratacion, Transicion } from "@/lib/contratacion";
import type {
  Event as AppEvent,
  Booking,
  Conversation,
  Message,
  AppNotification,
  Ticket,
  Service,
  Category,
  AuditLog,
  Approval,
  ApprovalStatus,
  WalletDoc,
  Transaction,
  TransactionSource,
  Talent,
  TalentWithUser,
  Venue,
  Course,
  Project,
  ProjectStatus,
} from "@/types";

// ─── Events ──────────────────────────────────────────────────────

export function useEvents(organizerId?: string) {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEvents(organizerId);
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }, [organizerId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { events, loading, refresh };
}

// ─── Bookings ────────────────────────────────────────────────────

export function useBookings(userId: string | undefined) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserBookings(userId);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const createBooking = async (data: Omit<Booking, "id" | "createdAt">) => {
    await fbCreateBooking(data);
    await refresh();
  };

  const deleteBooking = async (id: string) => {
    await fbDeleteBooking(id);
    await refresh();
  };

  return { bookings, loading, createBooking, deleteBooking, refresh };
}

// ─── Conversations (Realtime) ────────────────────────────────────

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToConversations(userId, (convos) => {
      setConversations(convos);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  return { conversations, loading };
}

// ─── Messages (Realtime) ─────────────────────────────────────────

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    const unsub = subscribeToMessages(conversationId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return () => unsub();
  }, [conversationId]);

  const sendMessage = async (senderId: string, text: string) => {
    if (!conversationId) return;
    await fbSendMessage(conversationId, senderId, text);
  };

  return { messages, loading, sendMessage };
}

// ─── Notifications (Realtime) ────────────────────────────────────

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToNotifications(userId, (notifs) => {
      setNotifications(notifs);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  const markRead = async (id: string) => {
    await fbMarkRead(id);
  };

  const markAllRead = async () => {
    if (!userId) return;
    await fbMarkAllRead(userId);
  };

  const unreadCount = notifications.filter((n) => n.isNew).length;

  return { notifications, loading, markRead, markAllRead, unreadCount };
}

// ─── Tickets ─────────────────────────────────────────────────────

export function useTickets(userId: string | undefined) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getUserTickets(userId).then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, [userId]);

  return { tickets, loading };
}

// ─── Services ────────────────────────────────────────────────────

export function useServices(userId: string | undefined) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getUserServices(userId).then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, [userId]);

  return { services, loading };
}

// ─── Admin: Stats ────────────────────────────────────────────────

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeArtists: 0,
    venues: 0,
    pendingAccounts: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

// ─── Admin: Approvals ────────────────────────────────────────────

export function useApprovals(statusFilter?: ApprovalStatus) {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getApprovals(statusFilter);
      setApprovals(data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { refresh(); }, [refresh]);

  const [error, setError] = useState("");

  const resolve = async (id: string, status: ApprovalStatus) => {
    if (!user) return;
    setError("");
    try {
      await updateApprovalStatus(id, status, { id: user.id, name: user.name });
      await refresh();
    } catch {
      setError("The request could not be updated. Nothing was changed.");
    }
  };

  const approve = (id: string) => resolve(id, "approved");
  const reject = (id: string) => resolve(id, "rejected");

  return { approvals, loading, error, approve, reject, refresh };
}

// ─── Admin: Categories ───────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (data: Omit<Category, "id">) => {
    await fbCreateCategory(data);
    await refresh();
  };

  const update = async (id: string, data: Partial<Omit<Category, "id">>) => {
    await fbUpdateCategory(id, data);
    await refresh();
  };

  const remove = async (id: string) => {
    await fbDeleteCategory(id);
    await refresh();
  };

  return { categories, loading, create, update, remove, refresh };
}

// ─── Admin: Audit Logs ───────────────────────────────────────────

export function useAuditLogs(maxResults = 50) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs(maxResults)
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [maxResults]);

  return { logs, loading };
}

// ─── Marketplace (Talents) ───────────────────────────────────────

export function useMarketplace() {
  const [talents, setTalents] = useState<TalentWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTalents();
      setTalents(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { talents, loading, refresh };
}

export function useTalentProfile(talentId: string | undefined) {
  const [data, setData] = useState<TalentWithUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!talentId) return;
    getTalentWithUser(talentId).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [talentId]);

  return { data, loading };
}

// ─── Wallet (Realtime) ──────────────────────────────────────────

export function useWallet(userId: string | undefined) {
  const [wallet, setWallet] = useState<WalletDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let unsub: (() => void) | undefined;

    getOrCreateWallet(userId)
      .then((initial) => {
        setWallet(initial);
        setLoading(false);
        unsub = subscribeToWallet(userId, (w) => {
          setWallet(w);
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load wallet");
        setLoading(false);
      });

    return () => {
      if (unsub) unsub();
    };
  }, [userId]);

  const addFunds = async (amount: number, source: TransactionSource, description: string) => {
    if (!userId) throw new Error("Not authenticated");
    setError(null);
    try {
      await fbRecordDeposit({ userId, amount, source, description });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add funds";
      setError(msg);
      throw err;
    }
  };

  const withdraw = async (amount: number, description: string) => {
    if (!userId) throw new Error("Not authenticated");
    setError(null);
    try {
      await fbRecordWithdrawal({ userId, amount, description });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to withdraw";
      setError(msg);
      throw err;
    }
  };

  return { wallet, loading, error, addFunds, withdraw };
}

// ─── Transactions (Realtime) ────────────────────────────────────

export function useTransactions(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToTransactions(userId, (txs) => {
      setTransactions(txs);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  return { transactions, loading };
}

// ─── Courses (Studio Classes) ──────────────────────────────────

export function useCourses(category?: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCourses(category);
      setCourses(data);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { refresh(); }, [refresh]);

  return { courses, loading, refresh };
}

// ─── Admin Analytics ───────────────────────────────────────────

export function useAnalyticsMetrics() {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    newUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAnalyticsMetrics()
      .then(setMetrics)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading, error };
}

export function useMonthlyRevenue() {
  const [data, setData] = useState<{ month: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonthlyRevenue()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useTopCategories() {
  const [categories, setCategories] = useState<{ name: string; bookings: number; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

// ─── Talent by userId (Dashboard) ───────────────────────────────

export function useTalentByUserId(userId: string | undefined) {
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getTalentByUserId(userId).then((data) => {
      setTalent(data);
      setLoading(false);
    });
  }, [userId]);

  return { talent, loading };
}

// ─── Venue by userId (Dashboard) ────────────────────────────────

export function useVenueByUserId(userId: string | undefined) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getVenueByUserId(userId).then((data) => {
      setVenue(data);
      setLoading(false);
    });
  }, [userId]);

  return { venue, loading };
}

// ─── Monthly User Signups (Admin Chart) ─────────────────────────

export function useMonthlyUserSignups() {
  const [data, setData] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonthlyUserSignups().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

// ─── Projects (Kanban) ──────────────────────────────────────────

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setProjects(await getUserProjects(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  const createProject = async (data: {
    title: string;
    client?: string;
    notes?: string;
    status?: ProjectStatus;
  }) => {
    if (!userId) return;
    await fbCreateProject({ userId, ...data });
    await refresh();
  };

  const moveProject = async (id: string, status: ProjectStatus) => {
    await fbUpdateProjectStatus(id, status);
    await refresh();
  };

  const deleteProject = async (id: string) => {
    await fbDeleteProject(id);
    await refresh();
  };

  return { projects, loading, createProject, moveProject, deleteProject, refresh };
}

// ─── Hiring flow (contrataciones) ───────────────────────────────

export function useContrataciones(userId: string | undefined) {
  const [items, setItems] = useState<Contratacion[]>([]);
  const [loading, setLoading] = useState(true);
  // Hirings whose deposit this user reported and an admin has not resolved.
  const [waitingDeposit, setWaitingDeposit] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const unsubs = [
      subscribeContrataciones(userId, (data) => {
        setItems(data);
        setLoading(false);
      }),
      subscribeToTransactions(userId, (txs) => {
        setWaitingDeposit(
          new Set(
            txs
              .filter((t) => t.type === "payment" && t.status === "processing" && t.contratacionId)
              .map((t) => t.contratacionId as string)
          )
        );
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [userId]);

  return { items, loading, waitingDeposit };
}

// One hiring with its history and money movements, all live.
export function useContratacion(cid: string | undefined) {
  const [item, setItem] = useState<Contratacion | null>(null);
  const [transiciones, setTransiciones] = useState<Transicion[]>([]);
  const [movimientos, setMovimientos] = useState<Partial<Record<MovimientoTipo, Movimiento>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cid) return;
    setLoading(true);
    const unsubs = [
      subscribeContratacion(
        cid,
        (data) => {
          setItem(data);
          setLoading(false);
        },
        () => {
          setItem(null);
          setLoading(false);
        }
      ),
      subscribeTransiciones(cid, setTransiciones),
      subscribeMovimientos(cid, setMovimientos),
    ];
    return () => unsubs.forEach((u) => u());
  }, [cid]);

  return { item, transiciones, movimientos, loading };
}
