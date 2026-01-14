// App.tsx
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

// UI Components
import Navbar from '@/components/Navbar';
import BottomNavbar from '@/components/BottomNavbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ToastContainer } from '@/components/ui';
import { LanguageProvider, LanguageContext } from '@/contexts/LanguageContext';
import CommandPalette from '@/components/CommandPalette';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import MarketplaceScreen from '@/screens/MarketplaceScreen';
import TalentProfileScreen from '@/screens/TalentProfileScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import AdminDashboardScreen from '@/screens/AdminDashboardScreen';
import MessagesScreen from '@/screens/MessagesScreen';
import NotFoundScreen from '@/screens/NotFoundScreen';
import { EventsListScreen, EventDetailScreen, TicketWalletScreen, ResaleMarketplaceScreen } from '@/screens/EventsAndTicketsScreens';
import UserSelectionScreen from '@/screens/UserSelectionScreen';

// Data & Types
import type { User, Talent, Venue, Conversation, Wallet, Notification, AppSettings, PurchasedTicket, ResaleTicket, Event, Review, StructuredBrief, ServicePlan, PortfolioItem, Badge, Provider, RentedItem } from '@/types';
import { UserRole, UserStatus, NegotiationStatus } from '@/types';
import { initialUsers, initialTalents, initialConversations, initialEvents, initialWallet, initialPurchasedTickets, mockResaleTickets, initialVenues, initialProviders } from '@/data/mockData';

// Local DB (Persistence)
import { db } from '@/utils/storage';

const MessagesRouteWrapper: React.FC<any> = (props) => {
    const { id } = useParams();
    return <MessagesScreen {...props} activeConversationId={id} />;
};

const safeLoad = <T,>(loader: () => T, fallback: T): T => {
    try {
        return loader();
    } catch (error) {
        console.error("Failed to load data:", error);
        return fallback;
    }
};

const AppContent: React.FC = () => {
    const { theme, t } = useContext(LanguageContext);
    
    // Initialize state from Local DB with error handling
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    const [users, setUsers] = useState<User[]>(() => safeLoad(db.users.get, initialUsers));
    const [talents, setTalents] = useState<Talent[]>(() => safeLoad(db.talents.get, initialTalents));
    const [conversations, setConversations] = useState<Conversation[]>(() => safeLoad(db.conversations.get, initialConversations));
    const [events, setEvents] = useState<Event[]>(() => safeLoad(db.events.get, initialEvents));
    
    // Wallet is now specific to the current user. 
    // Initial state is default, but will update when currentUser changes.
    const [wallet, setWallet] = useState<Wallet>(initialWallet);

    const [notifications, setNotifications] = useState<Notification[]>(() => safeLoad(db.notifications.get, []));
    const [appSettings, setAppSettings] = useState<AppSettings>(() => safeLoad(db.settings.get, { commissionRate: 15, premierCommissionRate: 10, premierTierRequirement: 50, categories: [], tags: [] }));
    const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(() => safeLoad(db.tickets.getPurchased, initialPurchasedTickets));
    const [resaleTickets, setResaleTickets] = useState<ResaleTicket[]>(() => safeLoad(db.tickets.getResale, mockResaleTickets));
    const [venues, setVenues] = useState<Venue[]>(() => safeLoad(db.venues.get, initialVenues));
    const [providers, setProviders] = useState<Provider[]>(() => safeLoad(db.providers.get, initialProviders));
    
    const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const RESERVATION_FEE = 20;

    // Load user's wallet when they log in
    useEffect(() => {
        if (currentUser) {
            const userWallet = db.wallets.get(currentUser.id);
            setWallet(userWallet);
        }
    }, [currentUser]);

    // Persist wallet changes whenever 'wallet' state changes (if user is logged in)
    useEffect(() => {
        if (currentUser) {
            try { db.wallets.set(currentUser.id, wallet); } catch(e) { console.error(e); }
        }
    }, [wallet, currentUser]);

    // Persistence Effects (Auto-save on change)
    useEffect(() => { try { db.users.set(users); } catch(e) { console.error(e); } }, [users]);
    useEffect(() => { try { db.talents.set(talents); } catch(e) { console.error(e); } }, [talents]);
    useEffect(() => { try { db.conversations.set(conversations); } catch(e) { console.error(e); } }, [conversations]);
    useEffect(() => { try { db.events.set(events); } catch(e) { console.error(e); } }, [events]);
    // Wallet persistence is handled by the specific user effect above
    useEffect(() => { try { db.notifications.set(notifications); } catch(e) { console.error(e); } }, [notifications]);
    useEffect(() => { try { db.settings.set(appSettings); } catch(e) { console.error(e); } }, [appSettings]);
    useEffect(() => { try { db.tickets.setPurchased(purchasedTickets); } catch(e) { console.error(e); } }, [purchasedTickets]);
    useEffect(() => { try { db.tickets.setResale(resaleTickets); } catch(e) { console.error(e); } }, [resaleTickets]);
    useEffect(() => { try { db.venues.set(venues); } catch(e) { console.error(e); } }, [venues]);
    useEffect(() => { try { db.providers.set(providers); } catch(e) { console.error(e); } }, [providers]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(isOpen => !isOpen);
            }
             if (e.key === 'Escape') {
                setCommandPaletteOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
        const newNotification: Notification = { 
            id: Date.now(), 
            message, 
            type,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    };

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const onMarkNotificationRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        addNotification("You have been logged out.", "success");
    };

    const handleRegister = (newUser: User, talentProfile?: Omit<Talent, 'id' | 'userId' | 'user'>, venueProfile?: Omit<Venue, 'id' | 'userId' | 'user'>, providerProfile?: Omit<Provider, 'id' | 'userId' | 'user'>) => {
        if (users.some(u => u.email === newUser.email)) {
            addNotification('An account with this email already exists.', 'error');
            return false;
        }
        setUsers(prev => [...prev, newUser]);
        // Initialize an empty wallet for the new user
        db.wallets.set(newUser.id, initialWallet);
        
        if (newUser.role === UserRole.TALENT && talentProfile) {
            const newTalent: Talent = { id: `talent-${Date.now()}`, userId: newUser.id, user: newUser, ...talentProfile };
            setTalents(prev => [...prev, newTalent]);
            addNotification('Application submitted! Our team will review it shortly.', 'success');
        } else if (newUser.role === UserRole.VENUE && venueProfile) {
            const newVenue: Venue = { id: `venue-${Date.now()}`, userId: newUser.id, user: newUser, ...venueProfile };
            setVenues(prev => [...prev, newVenue]);
            addNotification('Application submitted! Our team will review it shortly.', 'success');
        } else if (newUser.role === UserRole.PROVIDER && providerProfile) {
            const newProvider: Provider = { id: `provider-${Date.now()}`, userId: newUser.id, user: newUser, ...providerProfile };
            setProviders(prev => [...prev, newProvider]);
            addNotification('Provider application submitted! Our team will review it shortly.', 'success');
        } else {
            addNotification('Registration successful! Please select your profile to log in.', 'success');
        }
        return true;
    };
    
    const startNewConversation = (
        talentId: string, 
        brief: StructuredBrief, 
        initialMessage: string, 
        plan: any,
        serviceLocation: { lat: number; lng: number; address: string; },
        eventDate: string,
        eventId?: string,
        rentedItems: RentedItem[] = []
    ): string | undefined => {
        if (!currentUser || !plan) return;

        if (wallet.balance < RESERVATION_FEE) {
            addNotification(`Insufficient funds. A $${RESERVATION_FEE} reservation fee is required.`, 'error');
            return;
        }
        
        const talent = talents.find(t => t.id === talentId);
        if (!talent) return;
        
        if (talent.availability?.includes(eventDate)) {
            addNotification('Talent is not available on the selected date.', 'error');
            return;
        }

        // Process reservation fee
        setWallet(w => ({
            ...w,
            balance: w.balance - RESERVATION_FEE,
            transactions: [...w.transactions, { id: `txn-${Date.now()}-res`, date: new Date().toISOString(), description: `Reservation for ${talent.user.name}`, amount: -RESERVATION_FEE, type: 'reservation'}]
        }));
        addNotification(`$${RESERVATION_FEE} reservation fee paid.`, 'success');

        const rentalCost = rentedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const talentBasePrice = plan.price || 0;
        const totalOffer = talentBasePrice + rentalCost;

        const briefMessage = `
--- PROJECT BRIEF ---
Event Date: ${eventDate} (Duration: ${brief.durationHours}h)
Event Type: ${brief.eventType}
Audience Size: ${brief.audienceSize}
Desired Vibe: ${brief.vibe}
Budget: ${brief.budget}

--- ADDITIONAL SERVICES ---
${rentedItems.length > 0 ? rentedItems.map(item => `${item.quantity}x ${item.name} ($${item.totalPrice})`).join('\n') : 'None'}
---------------------
        `;
        
        const fullMessage = `${briefMessage}\n${initialMessage}`;

        const newConversation: Conversation = {
            id: `conv-${Date.now()}`,
            participants: [currentUser.id, talent.userId],
            participantDetails: [
                { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
                { id: talent.userId, name: talent.user.name, avatar: talent.user.avatar, role: talent.user.role }
            ],
            messages: [{ id: `msg-${Date.now()}`, senderId: currentUser.id, text: fullMessage, timestamp: new Date().toISOString() }],
            negotiation: {
                status: NegotiationStatus.NEGOTIATING,
                clientId: currentUser.id,
                talentId: talent.userId,
                clientOffer: totalOffer,
                talentOffer: totalOffer, // Starting point
                downPayment: RESERVATION_FEE,
                lastOfferBy: 'client',
            },
            eventId,
            eventDate,
            brief,
            serviceLocation,
            rentedItems,
            isReviewed: false,
        };
        setConversations(prev => [...prev, newConversation]);
        return newConversation.id;
    };

    const handleConfirmBooking = (conversationId: string) => {
        const conv = conversations.find(c => c.id === conversationId);
        if(!conv || !conv.eventDate) return;
        
        const talent = talents.find(t => t.userId === conv.negotiation.talentId);
        if(!talent) return;

        setTalents(prev => prev.map(t => t.id === talent.id ? { ...t, availability: [...(t.availability || []), conv.eventDate!] } : t));
    };


    const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate) return;
        
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
        
        if (userToUpdate.role === UserRole.TALENT) {
            setTalents(prev => prev.map(t => t.userId === userId ? { ...t, user: { ...t.user, status } } : t));
        }
        if (userToUpdate.role === UserRole.VENUE) {
            setVenues(prev => prev.map(v => v.userId === userId ? { ...v, user: { ...v.user, status } } : v));
        }
        if (userToUpdate.role === UserRole.PROVIDER) {
            setProviders(prev => prev.map(p => p.userId === userId ? { ...p, user: { ...p.user, status } } : p));
        }
        addNotification(`User status updated to ${status}.`, 'success');
    };
    
    const handleToggleTalentCertification = (talentId: string) => {
        setTalents(prev => prev.map(t => t.id === talentId ? { ...t, isCertified: !t.isCertified } : t));
        const talent = talents.find(t => t.id === talentId);
        if (talent) {
             addNotification(`${talent.user.name}'s certified status updated.`, 'success');
        }
    };
    
    const handleUpdateTalentBadges = (talentId: string, badges: Badge[]) => {
        setTalents(prev => prev.map(t => t.id === talentId ? { ...t, badges } : t));
        const talent = talents.find(t => t.id === talentId);
        if (talent) {
             addNotification(`${talent.user.name}'s badges updated.`, 'success');
        }
    };

    const handleUpdateVenueBadges = (venueId: string, badges: Badge[]) => {
        setVenues(prev => prev.map(v => v.id === venueId ? { ...v, badges } : v));
        const venue = venues.find(v => v.id === venueId);
        if (venue) {
             addNotification(`${venue.venueName}'s badges updated.`, 'success');
        }
    };

    const handleUpdateUser = (userId: string, updates: Partial<User>) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...updates } : u));
        
        const userToUpdate = users.find(u => u.id === userId);
        if (userToUpdate?.role === UserRole.TALENT) {
            setTalents(prevTalents => prevTalents.map(t => t.userId === userId ? { ...t, user: { ...t.user, ...updates } } : t));
        }
         if (userToUpdate?.role === UserRole.VENUE) {
            setVenues(prevVenues => prevVenues.map(v => v.userId === userId ? { ...v, user: { ...v.user, ...updates } } : v));
        }
        if (userToUpdate?.role === UserRole.PROVIDER) {
            setProviders(prev => prev.map(p => p.userId === userId ? { ...p, user: { ...p.user, ...updates } } : p));
        }
        addNotification('User details updated successfully.', 'success');
    };


    const handleCompleteJob = (conversationId: string) => {
        const conv = conversations.find(c => c.id === conversationId);
        const talent = talents.find(t => t.userId === conv?.negotiation.talentId);
        if(!conv || !talent || conv.negotiation.status !== NegotiationStatus.PAID) return;

        const finalPrice = conv.negotiation.talentOffer!;
        const commissionRate = talent.loyaltyTier === 'premier' 
            ? (appSettings.premierCommissionRate ?? appSettings.commissionRate) 
            : appSettings.commissionRate;
        const commission = finalPrice * (commissionRate / 100);
        const payout = finalPrice - commission;

        setConversations(convs => convs.map(c => c.id === conversationId ? {...c, negotiation: {...c.negotiation, status: NegotiationStatus.COMPLETED}} : c));
        
        // 1. Update Client Wallet (Release Escrow)
        // Since we are likely the client here marking it complete
        setWallet(w => ({
            ...w,
            escrow: w.escrow - finalPrice,
            transactions: [
                ...w.transactions,
                { id: `txn-${Date.now()}-payout`, date: new Date().toISOString(), description: `Payout for job ${conversationId.slice(-4)}`, amount: 0, type: 'payout' } // Amount 0 because it moves out of escrow view
            ]
        }));

        // 2. Credit Talent Wallet (Direct DB access because talent might not be logged in)
        try {
            const talentWallet = db.wallets.get(talent.userId);
            talentWallet.balance += payout;
            talentWallet.transactions.push({ 
                id: `txn-${Date.now()}-comm`, 
                date: new Date().toISOString(), 
                description: `Job Payment (less ${commissionRate}% comm)`, 
                amount: payout, 
                type: 'deposit' 
            });
            db.wallets.set(talent.userId, talentWallet);
        } catch (e) {
            console.error("Error crediting talent wallet", e);
        }
        
        // Update talent stats and check for loyalty tier upgrade
        const newJobsCompleted = talent.jobsCompleted + 1;
        let loyaltyTier = talent.loyaltyTier;
        if (talent.loyaltyTier === 'standard' && appSettings.premierTierRequirement && newJobsCompleted >= appSettings.premierTierRequirement) {
            loyaltyTier = 'premier';
            addNotification(`Congratulations! You've been promoted to Premier Talent status with lower commission rates!`, 'success');
        }
        setTalents(prev => prev.map(t => t.id === talent.id ? {...t, jobsCompleted: newJobsCompleted, loyaltyTier } : t));


        addNotification("Job marked as complete and funds released!", "success");
    };
    
    const handlePurchaseTicket = (
        eventId: string, 
        tierId: string, 
        quantity: number, 
        products: { productId: string, name: string, quantity: number }[],
        productAssignments?: Record<number, { productId: string, name: string, quantity: number }[]>
    ): boolean => {
        if (!currentUser) return false;
        const event = events.find(e => e.id === eventId);
        const tier = event?.ticketTiers.find(t => t.id === tierId);
        if (!event || !tier) {
            addNotification('Error processing purchase.', 'error');
            return false;
        }
        
        if (tier.sold + quantity > tier.totalQuantity) {
            addNotification('Not enough tickets available for this tier.', 'error');
            return false;
        }

        // Calculate total product price (global sum)
        const productsPrice = products.reduce((acc, p) => {
            const eventProduct = event.products.find(ep => ep.id === p.productId);
            return acc + (eventProduct?.price || 0) * p.quantity;
        }, 0);

        const totalPrice = (tier.price * quantity) + productsPrice;
        if (wallet.balance < totalPrice) {
            addNotification('Insufficient funds. Please top up your wallet.', 'error');
            return false;
        }

        // Generate tickets with correct product assignment
        const newTickets: PurchasedTicket[] = Array.from({ length: quantity }).map((_, index) => ({
            id: `ticket-${Date.now()}-${Math.random()}`,
            eventId,
            tierId,
            ownerId: currentUser.id,
            purchaseDate: new Date().toISOString(),
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-${Date.now()}-${index}`,
            // Logic fix: If assignments exist, use them for this specific ticket index.
            // Fallback: If no assignments (legacy call), ONLY assign products to the first ticket to avoid duplication.
            purchasedProducts: productAssignments 
                ? (productAssignments[index] || []) 
                : (index === 0 ? products : []) 
        }));

        setPurchasedTickets(prev => [...prev, ...newTickets]);
        
        setEvents(prevEvents => prevEvents.map(e => e.id === eventId ? {
            ...e,
            ticketTiers: e.ticketTiers.map(t => t.id === tierId ? {...t, sold: t.sold + quantity} : t)
        } : e));

        setWallet(w => ({
            ...w,
            balance: w.balance - totalPrice,
            transactions: [...w.transactions, { id: `txn-${Date.now()}`, date: new Date().toISOString(), description: `${quantity}x ${tier.name} for ${event.title}`, amount: -totalPrice, type: 'payment'}]
        }));
        addNotification(`${quantity} ticket(s) purchased successfully!`, 'success');
        return true;
    };
    
    const handleListTicketForResale = (ticketId: string, price: number) => {
        const ticket = purchasedTickets.find(t => t.id === ticketId);
        if(!ticket || !currentUser) return;

        const newResaleTicket: ResaleTicket = {
            id: `resale-${Date.now()}`,
            ticketId: ticket.id,
            eventId: ticket.eventId,
            tierId: ticket.tierId,
            sellerId: currentUser.id,
            price,
            listedDate: new Date().toISOString(),
            purchasedProducts: ticket.purchasedProducts
        };
        setResaleTickets(prev => [...prev, newResaleTicket]);
        setPurchasedTickets(prev => prev.filter(t => t.id !== ticketId));
        addNotification('Ticket listed for resale!', 'success');
    };

    const handlePurchaseResaleTicket = (resaleTicketId: string) => {
        if(!currentUser) return;
        const resaleTicket = resaleTickets.find(rt => rt.id === resaleTicketId);
        const originalEvent = events.find(e => e.id === resaleTicket?.eventId);
        if(!resaleTicket || !originalEvent) return;

        if(wallet.balance < resaleTicket.price){
            addNotification('Insufficient funds.', 'error');
            return;
        }

        // 1. Deduct from Buyer (Current User)
        setWallet(w => ({
            ...w,
            balance: w.balance - resaleTicket.price,
            transactions: [...w.transactions, {id: `txn-${Date.now()}`, date: new Date().toISOString(), description: `Resale ticket for ${originalEvent.title}`, amount: -resaleTicket.price, type: 'payment'}]
        }));
        
        addNotification(`$${resaleTicket.price} paid to seller!`, 'success');
        
        // 2. Credit Seller (Access DB Directly)
        try {
            const sellerWallet = db.wallets.get(resaleTicket.sellerId);
            sellerWallet.balance += resaleTicket.price;
            sellerWallet.transactions.push({
                id: `txn-${Date.now()}-sale`,
                date: new Date().toISOString(),
                description: `Sold ticket for ${originalEvent.title}`,
                amount: resaleTicket.price,
                type: 'deposit'
            });
            db.wallets.set(resaleTicket.sellerId, sellerWallet);
        } catch (e) {
            console.error("Failed to credit seller", e);
        }
        
        const purchasedTicket: PurchasedTicket = {
            id: resaleTicket.ticketId,
            eventId: resaleTicket.eventId,
            tierId: resaleTicket.tierId,
            ownerId: currentUser.id,
            purchaseDate: new Date().toISOString(),
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${resaleTicket.ticketId}`,
            purchasedProducts: resaleTicket.purchasedProducts
        };

        setPurchasedTickets(prev => [...prev, purchasedTicket]);
        setResaleTickets(prev => prev.filter(rt => rt.id !== resaleTicketId));
        addNotification('Resale ticket purchased successfully!', 'success');
    };

    const handleTransferTicket = (ticketId: string, recipientEmail: string) => {
        const recipient = users.find(u => u.email.toLowerCase() === recipientEmail.toLowerCase());
        if (!recipient) {
            addNotification('No user found with that email address.', 'error');
            return;
        }
        if (recipient.id === currentUser?.id) {
            addNotification("You can't transfer a ticket to yourself.", 'error');
            return;
        }

        setPurchasedTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ownerId: recipient.id } : t));
        addNotification(`Ticket successfully transferred to ${recipient.name}!`, 'success');
    };
    
    const handleTalentReviewSubmit = (talentId: string, rating: number, comment: string, conversationId: string) => {
        if(!currentUser) return;
        const newReview: Review = { id: `rev-${Date.now()}`, author: currentUser.name, clientId: currentUser.id, rating, comment, timestamp: new Date().toISOString() };
        setTalents(prev => prev.map(t => t.id === talentId ? {...t, reviews: [newReview, ...t.reviews] } : t));
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, isReviewed: true } : c));
        addNotification('Thank you for your review!', 'success');
    };

    const handleEventReviewSubmit = (eventId: string, rating: number, comment: string) => {
        if(!currentUser) return;
        const newReview: Review = { id: `rev-event-${Date.now()}`, author: currentUser.name, clientId: currentUser.id, rating, comment, timestamp: new Date().toISOString() };
        setEvents(prev => prev.map(e => e.id === eventId ? {...e, reviews: [newReview, ...(e.reviews || [])] } : e));
        addNotification('Thank you for reviewing the event!', 'success');
    };

    const handleWithdrawal = (amount: number) => {
        if (!currentUser) return false;

        let availableAmount = 0;
        if (currentUser.role === UserRole.TALENT) {
            const talentPayouts = wallet.transactions.filter(t => t.type === 'deposit' && t.description.startsWith('Job Payment')).reduce((sum,t) => sum+t.amount, 0);
            const talentWithdrawals = wallet.transactions.filter(t => t.type === 'withdrawal').reduce((sum,t) => sum+t.amount, 0);
            availableAmount = wallet.balance; // Simplified for now, just use balance
        } else {
            availableAmount = wallet.balance;
        }

        if (amount > availableAmount) {
            addNotification("Withdrawal amount exceeds available balance.", "error");
            return false;
        }
        
        if (amount <= 0) {
            addNotification("Please enter a valid amount.", "error");
            return false;
        }

        setWallet(w => ({
            ...w,
            balance: w.balance - amount,
            transactions: [...w.transactions, { id: `txn-${Date.now()}`, date: new Date().toISOString(), description: `Withdrawal`, amount: -amount, type: 'withdrawal' }]
        }));
        
        addNotification(`$${amount} withdrawal request processed.`, "success");
        return true;
    };


    const handleCreateEvent = (newEventData: Omit<Event, 'id' | 'organizerId' | 'organizer'>) => {
        if (!currentUser || currentUser.role !== UserRole.VENUE) return;
        const newEvent: Event = { id: `event-${Date.now()}`, ...newEventData, organizer: currentUser.name, organizerId: currentUser.id };
        setEvents(prev => [newEvent, ...prev]);
        addNotification("Event created successfully!", "success");
    };

    const handleUpdateEvent = (eventId: string, updates: Partial<Event>) => {
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updates } : e));
        addNotification("Event updated successfully!", "success");
    };

    const handleUpdateTalentProfile = (talentId: string, updates: Partial<Talent>) => {
        setTalents(prev => prev.map(t => t.id === talentId ? { ...t, ...updates } : t));
        addNotification("Profile updated successfully!", "success");
    };

    const handleUpdateTalentPortfolioImages = (talentId: string, newPortfolio: PortfolioItem[]) => {
        setTalents(prev => prev.map(t => t.id === talentId ? { ...t, portfolio: newPortfolio } : t));
        addNotification("Portfolio updated successfully!", "success");
    };
    
    const handleUpdateTalentServicePlans = (talentId: string, newPlans: ServicePlan[]) => {
        setTalents(prev => prev.map(t => t.id === talentId ? { ...t, servicePlans: newPlans } : t));
        addNotification("Service plans updated successfully!", "success");
    };
    
    const userTickets = useMemo(() => {
        if (!currentUser) return [];
        return purchasedTickets.filter(t => t.ownerId === currentUser.id);
    }, [purchasedTickets, currentUser]);

    const userConversations = useMemo(() => {
        if (!currentUser) return [];
        return conversations.filter(c => c.participants.includes(currentUser.id));
    }, [conversations, currentUser]);
    
    const userOrganizedEvents = useMemo(() => {
        if (!currentUser) return [];
        return events.filter(e => e.organizerId === currentUser.id);
    }, [events, currentUser]);


    return (
        <div className={`min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300`}>
            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setCommandPaletteOpen} talents={talents.filter(t=>t.user.status === UserStatus.ACTIVE)} />
            <ToastContainer notifications={notifications} dismissNotification={dismissNotification} />
            <Navbar user={currentUser} onLogout={handleLogout} notifications={notifications} onMarkNotificationRead={onMarkNotificationRead} />
            <main
                className={`transition-all duration-300 pb-20 md:pb-0`}
                style={{ paddingLeft: 'clamp(1rem, 5vw, 3rem)', paddingRight: 'clamp(1rem, 5vw, 3rem)' }}
            >
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <RegisterScreen onRegisterSuccess={handleRegister} />} />

                    <Route path="/login" element={<UserSelectionScreen allUsers={users} onLoginSuccess={handleLogin} addNotification={addNotification} />} />
                    <Route path="/login-form" element={<LoginScreen allUsers={users} onLoginSuccess={handleLogin} addNotification={addNotification} />} />

                    <Route path="/marketplace" element={<MarketplaceScreen talents={talents.filter(t=>t.user.status === UserStatus.ACTIVE)} />} />
                    <Route path="/talent/:id" element={<TalentProfileScreen talents={talents} providers={providers} currentUser={currentUser} conversations={conversations} startNewConversation={startNewConversation} userEvents={events.filter(e => e.organizerId === currentUser?.id)} onReviewSubmit={handleTalentReviewSubmit} wallet={wallet} />} />
                    <Route path="/events" element={<EventsListScreen events={events} />} />
                    <Route path="/events/:id" element={<EventDetailScreen events={events} resaleTickets={resaleTickets} onPurchase={handlePurchaseTicket} onPurchaseResale={handlePurchaseResaleTicket} currentUser={currentUser} onReviewSubmit={handleEventReviewSubmit} userTickets={userTickets} />} />
                    <Route path="/tickets/wallet" element={<ProtectedRoute user={currentUser}><TicketWalletScreen tickets={userTickets} allEvents={events} onListForResale={handleListTicketForResale} onTransfer={handleTransferTicket} /></ProtectedRoute>} />
                    <Route path="/tickets/resale" element={<ResaleMarketplaceScreen resaleTickets={resaleTickets} allEvents={events} onPurchase={handlePurchaseResaleTicket} />} />

                    <Route path="/dashboard" element={<ProtectedRoute user={currentUser}><DashboardScreen user={currentUser} wallet={wallet} setWallet={setWallet} addNotification={addNotification} tickets={userTickets} events={userOrganizedEvents} onCreateEvent={handleCreateEvent} onUpdateEvent={handleUpdateEvent} conversations={userConversations} onUpdateTalentProfile={handleUpdateTalentProfile} talents={talents} allEvents={events} onWithdrawal={handleWithdrawal} onUpdateTalentServicePlans={handleUpdateTalentServicePlans} onUpdateTalentPortfolioImages={handleUpdateTalentPortfolioImages} /></ProtectedRoute>} />
                    <Route path="/messages" element={<ProtectedRoute user={currentUser}><MessagesScreen conversations={userConversations} setConversations={setConversations} currentUser={currentUser} addNotification={addNotification} wallet={wallet} setWallet={setWallet} onCompleteJob={handleCompleteJob} talents={talents} appSettings={appSettings} onConfirmBooking={handleConfirmBooking} /></ProtectedRoute>} />
                    <Route path="/messages/:id" element={<ProtectedRoute user={currentUser}><MessagesRouteWrapper conversations={userConversations} setConversations={setConversations} currentUser={currentUser} addNotification={addNotification} wallet={wallet} setWallet={setWallet} onCompleteJob={handleCompleteJob} talents={talents} appSettings={appSettings} onConfirmBooking={handleConfirmBooking} /></ProtectedRoute>} />

                    <Route path="/admin" element={<ProtectedRoute user={currentUser} adminOnly><AdminDashboardScreen users={users} talents={talents} venues={venues} onUpdateUserStatus={handleUpdateUserStatus} onToggleTalentCertification={handleToggleTalentCertification} onUpdateVenueBadges={handleUpdateVenueBadges} onUpdateUser={handleUpdateUser} appSettings={appSettings} setAppSettings={setAppSettings} wallet={wallet} addNotification={addNotification} onUpdateTalentBadges={handleUpdateTalentBadges} /></ProtectedRoute>} />

                    <Route path="*" element={<NotFoundScreen />} />
                </Routes>
            </main>
            <BottomNavbar user={currentUser} />
        </div>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);


export default App;
