
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Conversation, User, Message, Wallet, Talent, AppSettings, StructuredBrief, AddOn } from '../types';
import { NegotiationStatus, UserRole } from '../types';
import { Card, Button, Input, Modal, EmptyState } from '../components/ui';
import { CheckCircleIcon, ClockIcon, DocumentTextIcon, LockClosedIcon, ShieldCheckIcon, ChevronLeftIcon, MessagesIcon, EditIcon, CubeIcon, PlusCircleIcon } from '../components/icons';
import { LanguageContext } from '../contexts/LanguageContext';

// OfferModal Component
const OfferModal: React.FC<{ isOpen: boolean, onClose: () => void, onSubmit: (amount: number) => void }> = ({ isOpen, onClose, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const { t } = useContext(LanguageContext);
    
    const handleSubmit = () => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            onSubmit(numAmount);
            onClose();
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('messages.offerModal.title')}>
            <div className="space-y-4">
                <Input 
                    label={t('messages.offerModal.label')}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t('messages.offerModal.placeholder')}
                />
                <div className="flex justify-end gap-4">
                    <Button variant="secondary" onClick={onClose}>{t('messages.offerModal.cancel')}</Button>
                    <Button onClick={handleSubmit}>{t('messages.offerModal.submit')}</Button>
                </div>
            </div>
        </Modal>
    );
};

const EditBriefModal: React.FC<{ isOpen: boolean, onClose: () => void, onSubmit: (message: string) => void, conversation: Conversation, talent: Talent | null }> = ({ isOpen, onClose, onSubmit, conversation, talent }) => {
    const { t } = useContext(LanguageContext);
    const [brief, setBrief] = useState(conversation.brief);
    const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        conversation.selectedAddOns?.forEach(a => { initial[a.id] = true });
        return initial;
    });

    const handleAddOnToggle = (addOnId: string) => {
        setSelectedAddOns(prev => ({ ...prev, [addOnId]: !prev[addOnId] }));
    };

    const handleSubmit = () => {
        let proposalText = `${t('messages.system.proposal')}\n`;
        let hasChanges = false;
        
        if(brief?.eventType !== conversation.brief?.eventType) {
            proposalText += `- ${t('messages.proposal.eventType')}: ${brief?.eventType}\n`;
            hasChanges = true;
        }
        
        const allAvailableAddons = talent?.servicePlans.flatMap(p => p.addOns || []) || [];
        const currentAddonIds = conversation.selectedAddOns?.map(a => a.id) || [];
        const newAddonIds = Object.keys(selectedAddOns).filter(id => selectedAddOns[id]);

        const added = newAddonIds.filter(id => !currentAddonIds.includes(id));
        const removed = currentAddonIds.filter(id => !newAddonIds.includes(id));

        if (added.length > 0) {
            hasChanges = true;
            proposalText += `\n${t('messages.proposal.added')}:\n`;
            added.forEach(id => {
                const addon = allAvailableAddons.find(a => a.id === id);
                if(addon) proposalText += `- ${addon.name} ($${addon.price})\n`;
            });
        }
        if (removed.length > 0) {
            hasChanges = true;
            proposalText += `\n${t('messages.proposal.removed')}:\n`;
            removed.forEach(id => {
                const addon = allAvailableAddons.find(a => a.id === id);
                 if(addon) proposalText += `- ${addon.name}\n`;
            });
        }
        
        if (hasChanges) {
            onSubmit(proposalText);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('messages.editBriefModal.title')}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <h4 className="font-bold">{t('messages.editBriefModal.briefTitle')}</h4>
                <Input label={t('messages.editBriefModal.eventTypeLabel')} value={brief?.eventType} onChange={e => setBrief(b => b ? { ...b, eventType: e.target.value } : { eventType: e.target.value, audienceSize: '', vibe: '', budget: '', durationHours: 4, startTime: '18:00' })} />
                
                <h4 className="font-bold pt-4 border-t border-day-border dark:border-night-border">{t('messages.editBriefModal.addOnsTitle')}</h4>
                <div className="space-y-2">
                    {talent?.servicePlans.flatMap(p => p.addOns || []).map(addon => (
                        <label key={addon.id} className="flex items-center justify-between p-3 rounded-lg bg-day-surface dark:bg-night-surface/50 cursor-pointer">
                            <div>
                                <p className="font-semibold">{addon.name} (+${addon.price})</p>
                                <p className="text-sm text-day-text-secondary">{addon.description}</p>
                            </div>
                            <input type="checkbox" checked={!!selectedAddOns[addon.id]} onChange={() => handleAddOnToggle(addon.id)} className="h-5 w-5 rounded text-day-accent focus:ring-day-accent"/>
                        </label>
                    ))}
                </div>
            </div>
             <div className="flex justify-end gap-4 mt-6">
                <Button variant="secondary" onClick={onClose}>{t('messages.offerModal.cancel')}</Button>
                <Button onClick={handleSubmit}>{t('messages.editBriefModal.submitButton')}</Button>
            </div>
        </Modal>
    );
};

// NegotiationPanel Component
const NegotiationPanel: React.FC<{ conv: Conversation; currentUser: User; onAction: (action: string, value?: any) => void; }> = ({ conv, currentUser, onAction }) => {
    const isClient = currentUser.id === conv.negotiation.clientId;
    const { status, clientOffer, talentOffer, lastOfferBy } = conv.negotiation;
    const { t } = useContext(LanguageContext);

    const rentalTotal = conv.rentedItems?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

    const StatusInfo: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-day-text-secondary dark:text-night-text-secondary">{icon}</div>
            <div>
                <p className="font-bold font-serif">{title}</p>
                <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">{children}</div>
            </div>
        </div>
    );

    const renderStatus = () => {
        switch (status) {
            case NegotiationStatus.NEGOTIATING:
                return <StatusInfo icon={<ClockIcon className="w-6 h-6"/>} title={t('messages.status.negotiating.title')}>{t('messages.status.negotiating.desc')}</StatusInfo>;
            case NegotiationStatus.AGREED:
                return <StatusInfo icon={<CheckCircleIcon className="w-6 h-6 text-day-accent dark:text-night-accent"/>} title={t('messages.status.agreed.title')}>{t('messages.status.agreed.desc')}</StatusInfo>;
            case NegotiationStatus.CONTRACT_SENT:
                return <StatusInfo icon={<DocumentTextIcon className="w-6 h-6"/>} title={t('messages.status.contractSent.title')}>{t('messages.status.contractSent.desc')}</StatusInfo>;
            case NegotiationStatus.PAID:
                return <StatusInfo icon={<LockClosedIcon className="w-6 h-6 text-blue-500"/>} title={t('messages.status.paid.title')}>{t('messages.status.paid.desc')}</StatusInfo>;
            case NegotiationStatus.COMPLETED:
                return <StatusInfo icon={<ShieldCheckIcon className="w-6 h-6 text-day-success"/>} title={t('messages.status.completed.title')}>{t('messages.status.completed.desc')}</StatusInfo>;
            default:
                return <p>{status}</p>;
        }
    }
    
    const renderActions = () => {
        const canAccept = isClient ? lastOfferBy === 'talent' : lastOfferBy === 'client';
        const acceptedOffer = isClient ? talentOffer : clientOffer;

        if (status === NegotiationStatus.NEGOTIATING) {
            return <div className="flex items-center gap-2 flex-shrink-0">
                {canAccept && <Button size="sm" onClick={() => onAction('accept')}>{t('messages.actions.accept')} ${acceptedOffer}</Button>}
                <Button size="sm" variant="secondary" onClick={() => onAction('counter')}>{t('messages.actions.counter')}</Button>
                <Button size="sm" variant="secondary" onClick={() => onAction('editBrief')} className="p-2" title={t('messages.actions.proposeChanges')}><EditIcon className="w-4 h-4" /></Button>
            </div>
        }
        if (status === NegotiationStatus.AGREED && !isClient) {
            return <Button onClick={() => onAction('contract')}>{t('messages.actions.generateContract')}</Button>;
        }
        if (status === NegotiationStatus.CONTRACT_SENT && isClient) {
            return <Button onClick={() => onAction('pay')}>{t('messages.actions.pay')} ${talentOffer} {t('messages.actions.securely')}</Button>;
        }
        if (status === NegotiationStatus.PAID && isClient) {
            return <Button onClick={() => onAction('complete')}>{t('messages.actions.markComplete')}</Button>;
        }
        if (status === NegotiationStatus.COMPLETED && isClient && !conv.isReviewed) {
             return <Button variant="secondary" onClick={() => onAction('review')}>{t('messages.actions.leaveReview')}</Button>
        }
        return null;
    }

    return (
        <div className="bg-day-surface/50 dark:bg-night-surface/50 border-b border-day-border/50 dark:border-night-border/50">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {renderStatus()}
                <div className="w-full sm:w-auto flex justify-end">{renderActions()}</div>
            </div>
            {(status === NegotiationStatus.NEGOTIATING || status === NegotiationStatus.AGREED || status === NegotiationStatus.CONTRACT_SENT) && (
                <div className="px-4 pb-4 pt-2 border-t border-day-border/50 dark:border-night-border/50 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-xs text-day-text-secondary mb-1 uppercase tracking-wider font-bold">Talent Fee (Negotiable)</p>
                        <p className="text-xl font-bold font-serif">${talentOffer?.toLocaleString() || '...'}</p>
                    </div>
                    <div>
                         <p className="text-xs text-day-text-secondary mb-1 uppercase tracking-wider font-bold">Equipment (Fixed)</p>
                         <p className="text-xl font-mono font-bold flex items-center justify-center gap-2">
                             ${rentalTotal.toLocaleString()}
                         </p>
                    </div>
                </div>
            )}
             {conv.rentedItems && conv.rentedItems.length > 0 && (
                <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
                    {conv.rentedItems.map(item => (
                        <span key={item.itemId} className="text-xs bg-day-bg dark:bg-night-bg border border-day-border dark:border-night-border px-2 py-1 rounded whitespace-nowrap">
                            {item.quantity}x {item.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};


// Main MessagesScreen Component
interface MessagesScreenProps {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    currentUser: User | null;
    activeConversationId?: string;
    addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
    wallet: Wallet;
    setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
    onCompleteJob: (conversationId: string) => void;
    talents: Talent[];
    appSettings: AppSettings;
    onConfirmBooking: (conversationId: string) => void;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ conversations, setConversations, currentUser, activeConversationId, addNotification, wallet, setWallet, onCompleteJob, talents, appSettings, onConfirmBooking }) => {
    if (!currentUser) {
        return null;
    }
    const { t } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const activeConv = conversations.find(c => c.id === activeConversationId);
    
    useEffect(() => {
        // On desktop, if no active conv, select the first one.
        if (!activeConversationId && conversations.length > 0 && currentUser && window.innerWidth >= 768) {
            const userConversations = conversations.filter(c => c.participants.includes(currentUser.id));
            if (userConversations.length > 0) {
                navigate(`/messages/${userConversations[0].id}`, { replace: true });
            }
        }
    }, [activeConversationId, conversations, navigate, currentUser]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConv?.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !activeConv) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text: message,
            timestamp: new Date().toISOString()
        };

        const updatedConv = {
            ...activeConv,
            messages: [...activeConv.messages, newMessage],
            lastUpdated: new Date().toISOString()
        };

        setConversations(prev => prev.map(c => c.id === activeConv.id ? updatedConv : c));
        setMessage('');
    };

    const handleAction = (action: string, value?: any) => {
        if (!activeConv) return;
        const neg = activeConv.negotiation;
        let updatedNeg = { ...neg };
        let systemMessageText = '';

        if (action === 'accept') {
            updatedNeg.status = NegotiationStatus.AGREED;
            systemMessageText = t('messages.system.agreementReached', { amount: neg.talentOffer });
            addNotification(t('messages.notifications.offerAccepted'), 'success');
        }
        else if (action === 'counter') {
             setIsOfferModalOpen(true);
             return; // Handle in modal callback
        }
        else if (action === 'submitCounter') {
             // value is amount
             if (currentUser.id === neg.clientId) {
                 updatedNeg.clientOffer = value;
                 updatedNeg.lastOfferBy = 'client';
                 // Talent usually matches if they accept, but here we just update offer
             } else {
                 updatedNeg.talentOffer = value;
                 updatedNeg.lastOfferBy = 'talent';
             }
             systemMessageText = t('messages.system.newOffer', { name: currentUser.name, amount: value });
        }
        else if (action === 'contract') {
             updatedNeg.status = NegotiationStatus.CONTRACT_SENT;
             systemMessageText = t('messages.system.contractSent');
             addNotification(t('messages.notifications.contractSent'), 'success');
        }
        else if (action === 'pay') {
             // Check wallet
             if (wallet.balance < (neg.talentOffer || 0)) {
                 addNotification(t('messages.notifications.insufficientBalance'), 'error');
                 return;
             }
             // Deduct from wallet
             const amount = neg.talentOffer || 0;
             setWallet(w => ({
                 ...w,
                 balance: w.balance - amount,
                 escrow: w.escrow + amount,
                 transactions: [...w.transactions, { id: `txn-${Date.now()}`, date: new Date().toISOString(), description: `Escrow deposit for job`, amount: -amount, type: 'payment' }]
             }));
             updatedNeg.status = NegotiationStatus.PAID;
             // Calculate payout details for system message
             const commission = appSettings.commissionRate; 
             const payout = amount * ((100 - commission)/100);
             
             systemMessageText = t('messages.system.paymentConfirmed', { finalPrice: amount, payout: payout.toFixed(2), commission: `${commission}%` });
             addNotification(t('messages.notifications.paymentSuccess'), 'success');
             onConfirmBooking(activeConv.id);
        }
        else if (action === 'complete') {
             onCompleteJob(activeConv.id); // Handles wallet transfer logic in App.tsx
             // System message might be added by parent, or we can add one here for UX
             systemMessageText = t('messages.system.jobCompleted');
        }
        else if (action === 'review') {
            // Navigate to talent profile or handle review
            const talentId = activeConv.negotiation.talentId;
            const talent = talents.find(t => t.userId === talentId);
            if(talent) navigate(`/talent/${talent.id}`);
            return;
        }
        else if (action === 'editBrief') {
             setIsBriefModalOpen(true);
             return;
        }
        else if (action === 'submitBriefChange') {
             // value is message text
             systemMessageText = value;
        }

        if (systemMessageText || action === 'complete') {
            const systemMessage: Message = {
                id: `sys-${Date.now()}`,
                senderId: 'system',
                text: systemMessageText,
                timestamp: new Date().toISOString(),
                isSystem: true
            };
            
            const updatedConversation = {
                ...activeConv,
                negotiation: updatedNeg,
                messages: systemMessageText ? [...activeConv.messages, systemMessage] : activeConv.messages,
                lastUpdated: new Date().toISOString()
            };
            
            setConversations(prev => prev.map(c => c.id === activeConv.id ? updatedConversation : c));
        }
    };

    const activeTalent = activeConv 
        ? talents.find(t => t.userId === activeConv.negotiation.talentId)
        : null;

    return (
        <div className="flex h-[calc(100vh-5rem)] pt-24 max-w-screen-2xl mx-auto overflow-hidden">
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-day-border dark:border-night-border flex flex-col bg-day-bg dark:bg-night-bg ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-day-border dark:border-night-border">
                    <h1 className="text-2xl font-serif font-bold">{t('messages.title')}</h1>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {conversations.filter(c => c.participants.includes(currentUser.id)).length > 0 ? (
                        conversations.filter(c => c.participants.includes(currentUser.id)).map(conv => {
                            const otherParticipant = conv.participantDetails.find(p => p.id !== currentUser.id);
                            const lastMsg = conv.messages[conv.messages.length - 1];
                            return (
                                <Link 
                                    key={conv.id} 
                                    to={`/messages/${conv.id}`}
                                    className={`block p-4 hover:bg-day-surface dark:hover:bg-night-surface transition-colors border-b border-day-border/50 dark:border-night-border/50 ${conv.id === activeConversationId ? 'bg-day-surface dark:bg-night-surface border-l-4 border-l-day-accent dark:border-l-night-accent' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={otherParticipant?.avatar} alt={otherParticipant?.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div className="flex-grow overflow-hidden">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-semibold truncate">{otherParticipant?.name}</h3>
                                                <span className="text-xs text-day-text-secondary dark:text-night-text-secondary whitespace-nowrap ml-2">{new Date(lastMsg?.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-day-text-secondary dark:text-night-text-secondary truncate">{lastMsg?.text}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-day-text-secondary">
                            <MessagesIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>{t('messages.noMessages')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col bg-day-surface/30 dark:bg-night-surface/30 relative ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                {activeConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-day-border dark:border-night-border flex items-center gap-3 bg-day-bg/80 dark:bg-night-bg/80 backdrop-blur-sm sticky top-0 z-10">
                            <Link to="/messages" className="md:hidden p-2 -ml-2 rounded-full hover:bg-day-surface dark:hover:bg-night-surface">
                                <ChevronLeftIcon className="w-6 h-6" />
                            </Link>
                            {(() => {
                                const otherParticipant = activeConv.participantDetails.find(p => p.id !== currentUser.id);
                                return (
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => otherParticipant?.role === UserRole.TALENT && activeTalent ? navigate(`/talent/${activeTalent.id}`) : null}>
                                        <img src={otherParticipant?.avatar} alt={otherParticipant?.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <h2 className="font-bold">{otherParticipant?.name}</h2>
                                            <p className="text-xs text-day-text-secondary dark:text-night-text-secondary capitalize">{otherParticipant?.role.toLowerCase()}</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        
                        {/* Negotiation Panel */}
                        <NegotiationPanel conv={activeConv} currentUser={currentUser} onAction={handleAction} />

                        {/* Messages List */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-24">
                            {activeConv.messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUser.id;
                                const isSystem = msg.isSystem;
                                const showAvatar = !isMe && !isSystem && (index === 0 || activeConv.messages[index - 1].senderId !== msg.senderId);
                                const otherParticipant = activeConv.participantDetails.find(p => p.id !== currentUser.id);

                                if (isSystem) {
                                    return (
                                        <div key={msg.id} className="flex justify-center my-4 animate-fade-in">
                                            <span className="px-4 py-1 rounded-full bg-day-surface dark:bg-night-surface border border-day-border dark:border-night-border text-xs text-day-text-secondary dark:text-night-text-secondary shadow-sm text-center max-w-md">
                                                {msg.text}
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up-fade`}>
                                        {!isMe && (
                                            <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                                                {showAvatar && <img src={otherParticipant?.avatar} className="w-8 h-8 rounded-full object-cover" />}
                                            </div>
                                        )}
                                        <div className={`max-w-[75%] sm:max-w-[60%] p-3 rounded-2xl ${isMe ? 'bg-day-accent text-white rounded-br-none' : 'bg-day-surface dark:bg-night-surface border border-day-border dark:border-night-border rounded-bl-none'}`}>
                                            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-day-text-secondary dark:text-night-text-secondary'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area - Floating Modern Style */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-day-bg dark:from-night-bg via-day-bg/90 dark:via-night-bg/90 to-transparent pt-10">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
                                <input 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    placeholder={t('messages.placeholder')}
                                    className="w-full pl-6 pr-20 py-4 rounded-full bg-day-surface/80 dark:bg-night-surface/80 backdrop-blur-xl border border-day-border dark:border-night-border focus:outline-none focus:ring-2 focus:ring-day-accent dark:focus:ring-night-accent shadow-lg transition-all"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!message.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-day-accent dark:bg-night-accent text-white rounded-full hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeftIcon className="w-5 h-5 rotate-180" /> {/* Using Chevron as send icon for style */}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <EmptyState 
                        icon={<MessagesIcon className="w-16 h-16"/>}
                        title={t('messages.emptyState.title')}
                        description={t('messages.emptyState.description')}
                    />
                )}
            </div>
            
            {isOfferModalOpen && (
                <OfferModal 
                    isOpen={isOfferModalOpen} 
                    onClose={() => setIsOfferModalOpen(false)} 
                    onSubmit={(amount) => handleAction('submitCounter', amount)} 
                />
            )}
            
            {isBriefModalOpen && activeConv && (
                <EditBriefModal 
                    isOpen={isBriefModalOpen} 
                    onClose={() => setIsBriefModalOpen(false)} 
                    onSubmit={(msg) => handleAction('submitBriefChange', msg)}
                    conversation={activeConv}
                    talent={activeTalent}
                />
            )}
        </div>
    );
};

export default MessagesScreen;
