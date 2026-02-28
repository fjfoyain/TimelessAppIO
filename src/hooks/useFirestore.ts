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
} from "@/lib/firestore";
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
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
}

// ─── Admin: Approvals ────────────────────────────────────────────

export function useApprovals(statusFilter?: ApprovalStatus) {
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

  const approve = async (id: string) => {
    await updateApprovalStatus(id, "approved");
    await refresh();
  };

  const reject = async (id: string) => {
    await updateApprovalStatus(id, "rejected");
    await refresh();
  };

  return { approvals, loading, approve, reject, refresh };
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
    getAuditLogs(maxResults).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, [maxResults]);

  return { logs, loading };
}
