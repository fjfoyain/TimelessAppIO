
// utils/storage.ts
import { 
    initialUsers, 
    initialTalents, 
    initialConversations, 
    initialEvents, 
    initialWallet, 
    initialPurchasedTickets, 
    mockResaleTickets, 
    initialVenues,
    initialProviders
} from '../data/mockData';

const KEYS = {
    USERS: 'timeless_db_users',
    TALENTS: 'timeless_db_talents',
    VENUES: 'timeless_db_venues',
    PROVIDERS: 'timeless_db_providers',
    CONVERSATIONS: 'timeless_db_conversations',
    EVENTS: 'timeless_db_events',
    WALLETS: 'timeless_db_wallets', // Changed to store a map of wallets
    PURCHASED_TICKETS: 'timeless_db_purchased_tickets',
    RESALE_TICKETS: 'timeless_db_resale_tickets',
    SETTINGS: 'timeless_db_settings',
    NOTIFICATIONS: 'timeless_db_notifications'
};

// Generic loader
function load<T>(key: string, initialData: T): T {
    try {
        const serialized = localStorage.getItem(key);
        if (!serialized) return initialData;
        const loaded = JSON.parse(serialized);
        if (Array.isArray(initialData)) {
             return (Array.isArray(loaded) && loaded.length > 0) ? loaded as T : initialData;
        }
        return { ...initialData, ...loaded };
    } catch (e) {
        console.error(`Error loading key ${key}`, e);
        return initialData;
    }
}

// Generic saver
function save<T>(key: string, data: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving key ${key}`, e);
    }
}

// API-like interface for our "Local Backend"
export const db = {
    users: {
        get: () => {
            const users = load(KEYS.USERS, initialUsers);
            if (users.length <= initialUsers.length) {
                 const uniqueUsers = new Map();
                 [...initialUsers, ...initialTalents.map(t => t.user), ...initialVenues.map(v => v.user), ...initialProviders.map(p => p.user), ...users].forEach(u => {
                    uniqueUsers.set(u.id, u);
                 });
                 return Array.from(uniqueUsers.values());
            }
            return users;
        },
        set: (data: any[]) => save(KEYS.USERS, data),
    },
    talents: {
        get: () => load(KEYS.TALENTS, initialTalents),
        set: (data: any[]) => save(KEYS.TALENTS, data),
    },
    venues: {
        get: () => load(KEYS.VENUES, initialVenues),
        set: (data: any[]) => save(KEYS.VENUES, data),
    },
    providers: {
        get: () => load(KEYS.PROVIDERS, initialProviders),
        set: (data: any[]) => save(KEYS.PROVIDERS, data),
    },
    conversations: {
        get: () => load(KEYS.CONVERSATIONS, initialConversations),
        set: (data: any[]) => save(KEYS.CONVERSATIONS, data),
    },
    events: {
        get: () => load(KEYS.EVENTS, initialEvents),
        set: (data: any[]) => save(KEYS.EVENTS, data),
    },
    wallets: {
        getAll: () => load(KEYS.WALLETS, {}), // Returns Record<userId, Wallet>
        get: (userId: string) => {
            const allWallets = load(KEYS.WALLETS, {});
            // Return user wallet or default initial wallet if not found
            return allWallets[userId] || initialWallet;
        },
        set: (userId: string, walletData: any) => {
            const allWallets = load(KEYS.WALLETS, {});
            allWallets[userId] = walletData;
            save(KEYS.WALLETS, allWallets);
        }
    },
    tickets: {
        getPurchased: () => load(KEYS.PURCHASED_TICKETS, initialPurchasedTickets),
        setPurchased: (data: any[]) => save(KEYS.PURCHASED_TICKETS, data),
        getResale: () => load(KEYS.RESALE_TICKETS, mockResaleTickets),
        setResale: (data: any[]) => save(KEYS.RESALE_TICKETS, data),
    },
    settings: {
        get: () => load(KEYS.SETTINGS, { commissionRate: 15, premierCommissionRate: 10, premierTierRequirement: 50, categories: [], tags: [] }),
        set: (data: any) => save(KEYS.SETTINGS, data),
    },
    notifications: {
        get: () => load(KEYS.NOTIFICATIONS, []),
        set: (data: any[]) => save(KEYS.NOTIFICATIONS, data),
    }
};
