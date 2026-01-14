
// screens/DashboardScreen.tsx
import React, { useState, useMemo, useContext } from 'react';
import type { User, Wallet, PurchasedTicket, Event, Conversation, Talent, ServicePlan, PortfolioItem, AddOn, Notification } from '../types';
import { UserRole } from '../types';
import { Card, Button, Input, Modal, Tag } from '../components/ui';
import { useNavigate, Link } from 'react-router-dom';
import { CalendarIcon, PlusCircleIcon, TicketIcon, WalletIcon, MessagesIcon, EditIcon, ChevronLeftIcon, ChevronRightIcon, BriefcaseIcon, UsersIcon, HomeIcon, TrashIcon, CameraIcon, MapPinIcon } from '../components/icons';
import { LocationPicker } from './EventsAndTicketsScreens';
import { LanguageContext } from '../contexts/LanguageContext';

// EditEventModal
const EditEventModal: React.FC<{ isOpen: boolean, onClose: () => void, onUpdateEvent: (eventId: string, updates: Partial<Event>) => void, event: Event }> = ({ isOpen, onClose, onUpdateEvent, event }) => {
    const [title, setTitle] = useState(event.title);
    const [date, setDate] = useState(event.date.substring(0, 16));
    const [location, setLocation] = useState(event.location);
    const [description, setDescription] = useState(event.description);
    const [image, setImage] = useState(event.image);
    const [coords, setCoords] = useState<{lat: number, lng: number}>({lat: event.lat, lng: event.lng});
    const { t } = useContext(LanguageContext);

    const handleSubmit = () => {
        const eventUpdates = { title, date, location, description, image, lat: coords.lat, lng: coords.lng };
        onUpdateEvent(event.id, eventUpdates);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('dashboard.modals.editEvent.title')}: ${event.title}`}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <Input label={t('dashboard.modals.eventForm.titleLabel')} value={title} onChange={e => setTitle(e.target.value)} />
                <Input label={t('dashboard.modals.eventForm.dateLabel')} type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
                <Input label={t('dashboard.modals.eventForm.locationLabel')} value={location} onChange={e => setLocation(e.target.value)} />
                <Input label={t('dashboard.modals.eventForm.imageLabel')} value={image} onChange={e => setImage(e.target.value)} />
                <textarea placeholder={t('dashboard.modals.eventForm.descriptionPlaceholder')} className="w-full p-3 bg-day-bg/50 dark:bg-night-bg/50 border border-day-border dark:border-night-border rounded-lg" rows={4} value={description} onChange={e=>setDescription(e.target.value)} />
                 <div>
                    <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-1">{t('dashboard.modals.eventForm.mapLabel')}</label>
                    <LocationPicker 
                        initialLat={coords.lat}
                        initialLng={coords.lng}
                        onLocationSelect={(lat, lng) => setCoords({lat, lng})}
                        className="h-64 border border-day-border dark:border-night-border"
                    />
                     <p className="text-xs text-day-text-secondary mt-1"><MapPinIcon className="inline w-3 h-3"/> Selected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
                </div>
            </div>
             <div className="flex justify-end gap-4 mt-6">
                <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                <Button onClick={handleSubmit}>{t('common.saveChanges')}</Button>
            </div>
        </Modal>
    );
};


// CreateEventModal
const CreateEventModal: React.FC<{ isOpen: boolean, onClose: () => void, onCreateEvent: (eventData: any) => void }> = ({ isOpen, onClose, onCreateEvent }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [locationName, setLocationName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [tiers, setTiers] = useState([{ name: '', price: '', totalQuantity: '' }]);
    const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
    const { t } = useContext(LanguageContext);

    const handleAddTier = () => setTiers([...tiers, { name: '', price: '', totalQuantity: '' }]);
    const handleTierChange = (index: number, field: string, value: string) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setTiers(newTiers);
    };

    const handleSubmit = () => {
        if(!coords) {
            alert(t('dashboard.modals.createEvent.mapError'));
            return;
        }
        const eventData = {
            title, date, location: locationName, description,
            image: image || 'https://picsum.photos/seed/newevent/800/400',
            lat: coords.lat, lng: coords.lng,
            ticketTiers: tiers.map(t => ({...t, price: parseFloat(t.price), totalQuantity: parseInt(t.totalQuantity), sold: 0, id: `tier-${Math.random()}`})),
            products: [],
        };
        onCreateEvent(eventData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('dashboard.modals.createEvent.title')}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <Input label={t('dashboard.modals.eventForm.titleLabel')} value={title} onChange={e => setTitle(e.target.value)} />
                <Input label={t('dashboard.modals.eventForm.dateLabel')} type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
                <Input label={t('dashboard.modals.eventForm.locationLabel')} placeholder={t('dashboard.modals.eventForm.locationPlaceholder')} value={locationName} onChange={e => setLocationName(e.target.value)} />
                <Input label={t('dashboard.modals.eventForm.imageLabelOptional')} value={image} onChange={e => setImage(e.target.value)} />
                <textarea placeholder={t('dashboard.modals.eventForm.descriptionPlaceholder')} className="w-full p-3 bg-day-bg/50 dark:bg-night-bg/50 border border-day-border dark:border-night-border rounded-lg" rows={4} value={description} onChange={e=>setDescription(e.target.value)} />
                <div>
                    <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-1">{t('dashboard.modals.eventForm.mapLabel')}</label>
                    <LocationPicker 
                        onLocationSelect={(lat, lng) => setCoords({lat, lng})}
                        className="h-64 border border-day-border dark:border-night-border"
                    />
                    {coords ? <p className="text-xs text-day-success mt-1"><MapPinIcon className="inline w-3 h-3"/> Location Set</p> : <p className="text-xs text-day-text-secondary mt-1">Click map to set location</p>}
                </div>
                <h4 className="font-bold pt-4 border-t border-day-border dark:border-night-border">{t('dashboard.modals.eventForm.tiersTitle')}</h4>
                {tiers.map((tier, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 p-2 border border-day-border dark:border-night-border rounded-lg">
                        <Input placeholder={t('dashboard.modals.eventForm.tierNamePlaceholder')} value={tier.name} onChange={e => handleTierChange(index, 'name', e.target.value)} />
                        <Input placeholder={t('dashboard.modals.eventForm.pricePlaceholder')} type="number" value={tier.price} onChange={e => handleTierChange(index, 'price', e.target.value)} />
                        <Input placeholder={t('dashboard.modals.eventForm.quantityPlaceholder')} type="number" value={tier.totalQuantity} onChange={e => handleTierChange(index, 'totalQuantity', e.target.value)} />
                    </div>
                ))}
                <Button variant="secondary" onClick={handleAddTier}>{t('dashboard.modals.eventForm.addTierButton')}</Button>
            </div>
             <div className="flex justify-end gap-4 mt-6">
                <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                <Button onClick={handleSubmit}>{t('dashboard.modals.createEvent.createButton')}</Button>
            </div>
        </Modal>
    );
};

// EditProfileModal for Talent
const EditProfileModal: React.FC<{ isOpen: boolean, onClose: () => void, talent: Talent, onUpdate: (talentId: string, updates: Partial<Talent>) => void }> = ({ isOpen, onClose, talent, onUpdate }) => {
    const [bio, setBio] = useState(talent.bio);
    const [tags, setTags] = useState(talent.tags.join(', '));
    const [hourlyRate, setHourlyRate] = useState(talent.hourlyRate || 0);
    const { t } = useContext(LanguageContext);

    const handleSubmit = () => {
        onUpdate(talent.id, { bio, tags: tags.split(',').map(t => t.trim()), hourlyRate });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('dashboard.modals.editProfile.title')}>
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-1">{t('dashboard.modals.editProfile.bioLabel')}</label>
                    <textarea className="w-full p-3 bg-day-bg/50 dark:bg-night-bg/50 border border-day-border dark:border-night-border rounded-lg" rows={5} value={bio} onChange={e => setBio(e.target.value)} />
                 </div>
                 <Input label={t('dashboard.modals.editProfile.tagsLabel')} value={tags} onChange={e => setTags(e.target.value)} />
                 <Input label={t('dashboard.modals.editProfile.rateLabel')} type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} />
                 <Button fullWidth onClick={handleSubmit}>{t('common.saveChanges')}</Button>
            </div>
        </Modal>
    );
}

// WithdrawalModal
const WithdrawalModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: (amount: number) => void, maxAmount: number, userRole: UserRole }> = ({ isOpen, onClose, onConfirm, maxAmount, userRole }) => {
    const [amount, setAmount] = useState('');
    const { t } = useContext(LanguageContext);
    const title = userRole === UserRole.TALENT ? t('dashboard.modals.withdraw.titleTalent') : t('dashboard.modals.withdraw.titleClient');
    const availableText = userRole === UserRole.TALENT ? t('dashboard.modals.withdraw.availableTalent') : t('dashboard.modals.withdraw.availableClient');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="mb-4 text-day-text-secondary">{availableText}: ${maxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <div className="space-y-4">
                <Input label={t('dashboard.modals.withdraw.amountLabel')} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`e.g., ${maxAmount}`} max={maxAmount} />
                <Button fullWidth onClick={() => onConfirm(parseFloat(amount))}>{t('dashboard.modals.withdraw.confirmButton')}</Button>
            </div>
        </Modal>
    );
};

// TalentAvailabilityManager Widget
const TalentAvailabilityManager: React.FC<{ talent: Talent, onUpdate: (id: string, updates: Partial<Talent>) => void }> = ({ talent, onUpdate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { t } = useContext(LanguageContext);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const handleDayClick = (day: number) => {
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentAvailability = talent.availability || [];
        const newAvailability = currentAvailability.includes(dateString)
            ? currentAvailability.filter(d => d !== dateString)
            : [...currentAvailability, dateString];
        onUpdate(talent.id, { availability: newAvailability });
    };

    const daysOfWeek = t('dashboard.talent.availability.daysOfWeek').split(',');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-serif font-bold">{t('dashboard.talent.availability.title')}</h3>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => changeMonth(-1)}><ChevronLeftIcon className="w-4 h-4" /></Button>
                    <span className="w-32 text-center font-semibold">{currentDate.toLocaleString(t('locale'), { month: 'long', year: 'numeric' })}</span>
                    <Button variant="secondary" size="sm" onClick={() => changeMonth(1)}><ChevronRightIcon className="w-4 h-4" /></Button>
                </div>
            </div>
            <p className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-4">{t('dashboard.talent.availability.subtitle')}</p>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-day-text-secondary">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm mt-2 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const date = day + 1;
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const isBooked = talent.availability?.includes(dateString);
                    return (
                        <div key={date} className="p-1 flex items-center justify-center">
                            <button onClick={() => handleDayClick(date)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isBooked ? 'bg-day-error/80 text-white' : 'hover:bg-day-accent/20'}`}>
                                {date}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

const ServicePlanManager: React.FC<{talent: Talent, onUpdate: (id: string, plans: ServicePlan[]) => void}> = ({ talent, onUpdate }) => {
    const [plans, setPlans] = useState<ServicePlan[]>(talent.servicePlans);
    const [editingPlan, setEditingPlan] = useState<ServicePlan | null>(null);
    const { t } = useContext(LanguageContext);
    
    const handleAddNewPlan = () => {
        const newPlan: ServicePlan = { id: `plan-${Date.now()}`, title: 'New Plan', description: '', price: 0, includes: [], addOns: [] };
        setEditingPlan(newPlan);
    }
    
    const handleSavePlan = (planToSave: ServicePlan) => {
        const index = plans.findIndex(p => p.id === planToSave.id);
        let newPlans;
        if (index > -1) {
            newPlans = plans.map(p => p.id === planToSave.id ? planToSave : p);
        } else {
            newPlans = [...plans, planToSave];
        }
        setPlans(newPlans);
        onUpdate(talent.id, newPlans);
        setEditingPlan(null);
    };

    const handleDeletePlan = (planId: string) => {
        const newPlans = plans.filter(p => p.id !== planId);
        setPlans(newPlans);
        onUpdate(talent.id, newPlans);
        setEditingPlan(null);
    }
    
    return (
    <>
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-serif font-bold">{t('dashboard.talent.plans.title')}</h3>
            </div>
            <p className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-4">{t('dashboard.talent.plans.subtitle')}</p>

            <div className="space-y-4">
                {plans.map((plan) => (
                    <Card key={plan.id} className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{plan.title} - ${plan.price}</p>
                                <p className="text-sm text-day-text-secondary">{plan.description}</p>
                            </div>
                             <Button size="sm" variant="secondary" onClick={() => setEditingPlan(plan)}>{t('common.edit')}</Button>
                        </div>
                    </Card>
                ))}
                <Button onClick={handleAddNewPlan}>{t('dashboard.talent.plans.createButton')}</Button>
            </div>
        </Card>
        {editingPlan && <EditPlanModal isOpen={!!editingPlan} onClose={() => setEditingPlan(null)} plan={editingPlan} onSave={handleSavePlan} onDelete={handleDeletePlan} />}
    </>
    );
};

const EditPlanModal: React.FC<{ isOpen: boolean, onClose: () => void, plan: ServicePlan, onSave: (plan: ServicePlan) => void, onDelete: (planId: string) => void }> = ({ isOpen, onClose, plan, onSave, onDelete }) => {
    const [currentPlan, setCurrentPlan] = useState(plan);
    const [newAddOn, setNewAddOn] = useState({ name: '', description: '', price: '' });
    const { t } = useContext(LanguageContext);

    const handleFieldChange = (field: keyof ServicePlan, value: any) => {
        setCurrentPlan(p => ({...p, [field]: value}));
    };
    
    const handleAddOn = () => {
        if(!newAddOn.name || !newAddOn.price) return;
        const addOn: AddOn = { id: `addon-${Date.now()}`, name: newAddOn.name, description: newAddOn.description, price: Number(newAddOn.price) };
        setCurrentPlan(p => ({...p, addOns: [...(p.addOns || []), addOn]}));
        setNewAddOn({ name: '', description: '', price: '' });
    };

    const handleRemoveAddOn = (id: string) => {
        setCurrentPlan(p => ({...p, addOns: p.addOns?.filter(a => a.id !== id)}));
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('dashboard.modals.editPlan.title')}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <Input label={t('dashboard.modals.editPlan.planTitleLabel')} value={currentPlan.title} onChange={e => handleFieldChange('title', e.target.value)} />
                <Input label={t('dashboard.modals.editPlan.priceLabel')} type="number" value={currentPlan.price} onChange={e => handleFieldChange('price', Number(e.target.value))} />
                <div>
                    <label>{t('dashboard.modals.editPlan.descriptionLabel')}</label>
                    <textarea className="w-full p-2 bg-day-bg/50 dark:bg-night-bg/50 border border-day-border dark:border-night-border rounded" value={currentPlan.description} onChange={e => handleFieldChange('description', e.target.value)} />
                </div>
                 <div>
                    <label>{t('dashboard.modals.editPlan.includesLabel')}</label>
                    <textarea className="w-full p-2 bg-day-bg/50 dark:bg-night-bg/50 border border-day-border dark:border-night-border rounded" placeholder={t('dashboard.modals.editPlan.includesPlaceholder')} value={currentPlan.includes.join('\n')} onChange={e => handleFieldChange('includes', e.target.value.split('\n'))} />
                </div>
                 
                 <div className="pt-4 border-t border-day-border dark:border-night-border">
                    <h4 className="font-bold">{t('dashboard.modals.editPlan.addOnsTitle')}</h4>
                    <div className="space-y-2 mt-2">
                        {currentPlan.addOns?.map(addon => (
                            <div key={addon.id} className="flex items-center justify-between p-2 bg-day-surface dark:bg-night-surface/50 rounded">
                                <span>{addon.name} - ${addon.price}</span>
                                <Button size="sm" variant="secondary" onClick={() => handleRemoveAddOn(addon.id)}><TrashIcon className="w-4 h-4"/></Button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-2 border border-day-border dark:border-night-border rounded-lg space-y-2">
                        <Input placeholder={t('dashboard.modals.editPlan.addOnNamePlaceholder')} value={newAddOn.name} onChange={e => setNewAddOn({...newAddOn, name: e.target.value})} />
                        <Input placeholder={t('dashboard.modals.editPlan.addOnDescPlaceholder')} value={newAddOn.description} onChange={e => setNewAddOn({...newAddOn, description: e.target.value})} />
                        <div className="flex gap-2">
                            <Input placeholder={t('dashboard.modals.eventForm.pricePlaceholder')} type="number" value={newAddOn.price} onChange={e => setNewAddOn({...newAddOn, price: e.target.value})} />
                            <Button onClick={handleAddOn}>{t('dashboard.modals.editPlan.addButton')}</Button>
                        </div>
                    </div>
                 </div>

            </div>
             <div className="flex justify-between items-center mt-6">
                <Button variant="secondary" className="text-day-error" onClick={() => onDelete(currentPlan.id)}>{t('common.delete')}</Button>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button onClick={() => onSave(currentPlan)}>{t('common.save')}</Button>
                </div>
            </div>
        </Modal>
    );
};


const PortfolioManager: React.FC<{ talent: Talent, onUpdate: (talentId: string, portfolio: PortfolioItem[]) => void }> = ({ talent, onUpdate }) => {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>(talent.portfolio);
    const [newImageUrl, setNewImageUrl] = useState('');
    const { t } = useContext(LanguageContext);
    
    const handleAddImage = () => {
        if(!newImageUrl.trim()) return;
        const newImage: PortfolioItem = { type: 'image', url: newImageUrl, caption: 'New Image'};
        const updatedPortfolio = [...portfolio, newImage];
        setPortfolio(updatedPortfolio);
        onUpdate(talent.id, updatedPortfolio);
        setNewImageUrl('');
    };
    
    const handleRemoveImage = (url: string) => {
        const updatedPortfolio = portfolio.filter(item => item.url !== url);
        setPortfolio(updatedPortfolio);
        onUpdate(talent.id, updatedPortfolio);
    };
    
    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('dashboard.talent.portfolio.title')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {portfolio.map((item, index) => (
                    <div key={index} className="relative group">
                        <img src={item.url} alt={`Portfolio item ${index+1}`} className="w-full h-full object-cover rounded-lg aspect-square"/>
                        <button onClick={() => handleRemoveImage(item.url)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder={t('dashboard.talent.portfolio.placeholder')} />
                <Button onClick={handleAddImage}>{t('dashboard.talent.portfolio.addButton')}</Button>
            </div>
        </Card>
    );
};

// WalletSummary Widget
const WalletSummary: React.FC<{ wallet: Wallet, setWallet: React.Dispatch<React.SetStateAction<Wallet>>, addNotification: (message: string, type: 'success' | 'error') => void, onWithdrawal: (amount: number) => boolean, user: User }> = ({ wallet, setWallet, addNotification, onWithdrawal, user }) => {
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const { t } = useContext(LanguageContext);

    const handleTopUp = () => {
        const topUpAmount = parseFloat(amount);
        if(isNaN(topUpAmount) || topUpAmount <= 0) {
            addNotification(t('dashboard.notifications.invalidAmount'), 'error');
            return;
        };
        
        setWallet(w => ({
            ...w,
            balance: w.balance + topUpAmount,
            transactions: [...w.transactions, {id: `txn-${Date.now()}`, date: new Date().toISOString(), description: 'Deposit', amount: topUpAmount, type: 'deposit'}]
        }));
        addNotification(t('dashboard.notifications.topUpSuccess', { amount: topUpAmount }), 'success');
        setIsTopUpOpen(false);
        setAmount('');
    };
    
    const availableForWithdrawal = user.role === UserRole.TALENT
        ? wallet.transactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0) + wallet.transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0)
        : wallet.balance;

    const handleConfirmWithdrawal = (withdrawAmount: number) => {
        const success = onWithdrawal(withdrawAmount);
        if (success) {
            setIsWithdrawModalOpen(false);
        }
    };


    return (
        <>
            <Card className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-semibold text-day-text-secondary dark:text-night-text-secondary">{t('dashboard.wallet.availableBalance')}</h3>
                        <p className="text-4xl font-serif font-bold">${wallet.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                     <div className="flex flex-col items-end gap-2">
                        <Button onClick={() => setIsTopUpOpen(true)}><PlusCircleIcon className="w-5 h-5 mr-2" />{t('dashboard.wallet.topUpButton')}</Button>
                        <Button variant="secondary" size="sm" onClick={() => setIsWithdrawModalOpen(true)} disabled={availableForWithdrawal <= 0}>{t('dashboard.wallet.withdrawButton')}</Button>
                     </div>
                </div>
                 {wallet.escrow > 0 && <p className="text-sm mt-2 text-day-text-secondary">{t('dashboard.wallet.escrowInfo', { amount: wallet.escrow.toLocaleString() })}</p>}
            </Card>
            <Modal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} title={t('dashboard.modals.topUp.title')}>
                <div className="space-y-4">
                    <Input label={t('dashboard.modals.topUp.amountLabel')} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="500" />
                    <Button fullWidth onClick={handleTopUp}>{t('dashboard.modals.topUp.addButton')}</Button>
                </div>
            </Modal>
            <WithdrawalModal 
                isOpen={isWithdrawModalOpen} 
                onClose={() => setIsWithdrawModalOpen(false)}
                onConfirm={handleConfirmWithdrawal}
                maxAmount={availableForWithdrawal}
                userRole={user.role}
            />
        </>
    );
};

// QuickActions Widget
const QuickActions: React.FC<{ user: User, onAction: (action: string) => void }> = ({ user, onAction }) => {
    const navigate = useNavigate();
    const { t } = useContext(LanguageContext);
    const actionsMap = {
        [UserRole.CLIENT]: [
            { label: t('dashboard.actions.browseTalent'), icon: <CalendarIcon className="w-6 h-6"/>, action: () => navigate('/marketplace') },
            { label: t('dashboard.actions.viewEvents'), icon: <TicketIcon className="w-6 h-6"/>, action: () => navigate('/events') },
        ],
        [UserRole.TALENT]: [
            { label: t('dashboard.actions.editProfile'), icon: <EditIcon className="w-6 h-6"/>, action: () => onAction('editProfile') },
            { label: t('dashboard.actions.viewMessages'), icon: <MessagesIcon className="w-6 h-6"/>, action: () => navigate('/messages') },
        ],
        [UserRole.VENUE]: [
            { label: t('dashboard.actions.createEvent'), icon: <PlusCircleIcon className="w-6 h-6"/>, action: () => onAction('createEvent') },
            { label: t('dashboard.actions.browseTalent'), icon: <CalendarIcon className="w-6 h-6"/>, action: () => navigate('/marketplace') },
        ],
        [UserRole.ADMIN]: []
    };
    const actions = actionsMap[user.role] || [];
    return (
        <div className="grid grid-cols-2 gap-4">
            {actions.map(action => (
                <Card key={action.label} isHoverable className="p-6 text-center cursor-pointer flex flex-col items-center justify-center aspect-square" onClick={action.action}>
                    <div className="text-day-accent dark:text-night-accent mx-auto w-fit">{action.icon}</div>
                    <p className="mt-2 font-semibold">{action.label}</p>
                </Card>
            ))}
        </div>
    );
};

// MyUpcomingTickets Widget (for Clients)
const MyUpcomingTickets: React.FC<{ tickets: PurchasedTicket[], allEvents: Event[] }> = ({ tickets, allEvents }) => {
    const { t } = useContext(LanguageContext);
    return (
    <Card className="p-6">
        <h3 className="text-2xl font-serif font-bold mb-4">{t('dashboard.client.upcoming.title')}</h3>
        {tickets.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {tickets.map(ticket => {
                    const event = allEvents.find(e => e.id === ticket.eventId);
                    if (!event) return null;
                    return (
                        <Link to={`/events/${event.id}`} key={ticket.id}>
                            <Card className="p-4 flex justify-between items-center" isHoverable>
                                <div>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-day-text-secondary">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <Tag>{event.ticketTiers.find(t=>t.id === ticket.tierId)?.name}</Tag>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        ) : <p className="text-day-text-secondary">{t('dashboard.client.upcoming.empty')}</p>}
    </Card>
    );
};


// MyEvents Widget (for Venues)
const MyEvents: React.FC<{ events: Event[], onManageClick: (event: Event) => void }> = ({ events, onManageClick }) => {
    const { t } = useContext(LanguageContext);
    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('dashboard.venue.myEvents.title')}</h3>
            {events.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events.map(event => (
                        <Card key={event.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-day-text-secondary">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => onManageClick(event)}>{t('dashboard.venue.myEvents.manageButton')}</Button>
                        </Card>
                    ))}
                </div>
            ) : <p className="text-day-text-secondary">{t('dashboard.venue.myEvents.empty')}</p>}
        </Card>
    );
};

// RecentConversations Widget
const RecentConversations: React.FC<{ conversations: Conversation[], currentUser: User }> = ({ conversations, currentUser }) => {
    const navigate = useNavigate();
    const { t } = useContext(LanguageContext);
    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('dashboard.common.conversations.title')}</h3>
            <div className="space-y-3">
                {conversations.slice(0, 4).map(conv => {
                    const otherUser = conv.participantDetails.find(p => p.id !== currentUser.id);
                    return (
                        <Card key={conv.id} className="p-3 flex items-center gap-4 cursor-pointer" isHoverable onClick={() => navigate(`/messages/${conv.id}`)}>
                            <img src={otherUser?.avatar} alt={otherUser?.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold">{otherUser?.name}</p>
                                <p className="text-sm text-day-text-secondary truncate">{conv.messages.slice(-1)[0]?.text}</p>
                            </div>
                        </Card>
                    )
                })}
                 {conversations.length === 0 && <p className="text-day-text-secondary">{t('dashboard.common.conversations.empty')}</p>}
            </div>
        </Card>
    )
}

// Finance Widget for Talent/Venue
const FinanceWidget: React.FC<{ wallet: Wallet, conversations: Conversation[], onWithdrawal: (amount: number) => boolean, userRole: UserRole }> = ({ wallet, conversations, onWithdrawal, userRole }) => {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const { t } = useContext(LanguageContext);
    
    const providerEscrow = useMemo(() => {
        return conversations
            .filter(c => c.negotiation.status === 'Paid & Confirmed')
            .reduce((sum, c) => sum + (c.negotiation.talentOffer || 0), 0);
    }, [conversations]);
    
    const availableBalance = useMemo(() => {
        const payouts = wallet.transactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0);
        const withdrawals = wallet.transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0);
        return payouts + withdrawals; // withdrawals are negative
    }, [wallet.transactions]);
    
    const handleConfirmWithdrawal = (amount: number) => {
        const success = onWithdrawal(amount);
        if (success) {
            setIsWithdrawModalOpen(false);
        }
    };

    return (
        <>
            <Card className="p-6">
                <h3 className="text-2xl font-serif font-bold mb-4">{t('dashboard.common.finance.title')}</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-day-text-secondary">{t('dashboard.common.finance.availableLabel')}</p>
                        <p className="text-3xl font-serif font-bold">${availableBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                     <div>
                        <p className="text-sm text-day-text-secondary">{t('dashboard.common.finance.escrowLabel')}</p>
                        <p className="text-3xl font-serif font-bold">${providerEscrow.toLocaleString()}</p>
                    </div>
                    <Button fullWidth onClick={() => setIsWithdrawModalOpen(true)} disabled={availableBalance <= 0}>{t('dashboard.common.finance.withdrawButton')}</Button>
                </div>
            </Card>
            <WithdrawalModal 
                isOpen={isWithdrawModalOpen} 
                onClose={() => setIsWithdrawModalOpen(false)}
                onConfirm={handleConfirmWithdrawal}
                maxAmount={availableBalance}
                userRole={userRole}
            />
        </>
    );
};

// Stats Widget for Talent
const TalentStatsWidget: React.FC<{talent: Talent}> = ({ talent }) => {
    const { t } = useContext(LanguageContext);
    const profileViews = talent.jobsCompleted * 137 + 50;
    const bookingRequests = talent.reviews.length + talent.jobsCompleted;
    const conversionRate = bookingRequests > 0 ? ((talent.jobsCompleted / bookingRequests) * 100).toFixed(1) : "0.0";


    return (
        <Card className="p-6">
             <h3 className="text-2xl font-serif font-bold mb-4">{t('dashboard.talent.analytics.title')}</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <p className="text-day-text-secondary">{t('dashboard.talent.analytics.views')}</p>
                    <p className="text-2xl font-bold">{profileViews.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-baseline">
                    <p className="text-day-text-secondary">{t('dashboard.talent.analytics.requests')}</p>
                    <p className="text-2xl font-bold">{bookingRequests}</p>
                </div>
                <div className="flex justify-between items-baseline">
                    <p className="text-day-text-secondary">{t('dashboard.talent.analytics.conversion')}</p>
                    <p className="text-2xl font-bold">{conversionRate}%</p>
                </div>
                 <div className="flex justify-between items-baseline">
                    <p className="text-day-text-secondary">{t('dashboard.talent.analytics.response')}</p>
                    <p className="text-2xl font-bold">{talent.responseRate}%</p>
                </div>
             </div>
        </Card>
    )
};

// Stats Widget for Venues
const VenueStatsWidget: React.FC<{events: Event[]}> = ({ events }) => {
    const { t } = useContext(LanguageContext);
    const totalTicketsSold = useMemo(() => events.reduce((sum, event) => sum + event.ticketTiers.reduce((tierSum, tier) => tierSum + tier.sold, 0), 0), [events]);
    const totalRevenue = useMemo(() => events.reduce((sum, event) => sum + event.ticketTiers.reduce((tierSum, tier) => tierSum + (tier.sold * tier.price), 0), 0), [events]);
    
    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('dashboard.venue.performance.title')}</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <p className="text-day-text-secondary">{t('dashboard.venue.performance.ticketsSold')}</p>
                    <p className="text-2xl font-bold">{totalTicketsSold.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-baseline">
                    <p className="text-day-text-secondary">{t('dashboard.venue.performance.totalRevenue')}</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-baseline">
                    <p className="text-day-text-secondary">{t('dashboard.venue.performance.activeEvents')}</p>
                    <p className="text-2xl font-bold">{events.length}</p>
                </div>
            </div>
        </Card>
    );
};


interface DashboardScreenProps {
    user: User | null;
    wallet: Wallet;
    setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
    addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
    tickets: PurchasedTicket[];
    events: Event[];
    onCreateEvent: (eventData: any) => void;
    onUpdateEvent: (eventId: string, updates: Partial<Event>) => void;
    conversations: Conversation[];
    onUpdateTalentProfile: (talentId: string, updates: Partial<Talent>) => void;
    talents: Talent[];
    allEvents: Event[];
    onWithdrawal: (amount: number) => boolean;
    onUpdateTalentServicePlans: (talentId: string, newPlans: ServicePlan[]) => void;
    onUpdateTalentPortfolioImages: (talentId: string, newPortfolio: PortfolioItem[]) => void;
}

type TalentDashboardTab = 'overview' | 'availability' | 'plans' | 'portfolio';


const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, wallet, setWallet, addNotification, tickets, events, onCreateEvent, onUpdateEvent, conversations, onUpdateTalentProfile, talents, allEvents, onWithdrawal, onUpdateTalentServicePlans, onUpdateTalentPortfolioImages }) => {
    const [isCreateEventModalOpen, setCreateEventModalOpen] = useState(false);
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [talentTab, setTalentTab] = useState<TalentDashboardTab>('overview');
    const { t } = useContext(LanguageContext);
    
    const currentUserTalentProfile = useMemo(() => {
        if (user?.role === UserRole.TALENT) {
            return talents.find(t => t.userId === user.id);
        }
        return null;
    }, [user, talents]);

    if (!user) {
        return <div className="text-center py-20">Loading user data...</div>;
    }

    const handleQuickAction = (action: string) => {
        if (action === 'createEvent') setCreateEventModalOpen(true);
        if (action === 'editProfile') setEditProfileModalOpen(true);
    }
    
    const handleManageEvent = (event: Event) => {
        setEventToEdit(event);
    }

    const renderClientDashboard = () => (
        <>
            <div className="lg:col-span-2 space-y-8">
                <WalletSummary wallet={wallet} setWallet={setWallet} addNotification={addNotification} onWithdrawal={onWithdrawal} user={user} />
                <MyUpcomingTickets tickets={tickets} allEvents={allEvents} />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <QuickActions user={user} onAction={handleQuickAction} />
                <RecentConversations conversations={conversations} currentUser={user} />
            </div>
        </>
    );

    const renderTalentDashboard = () => {
        const talentTabs = [
            { id: 'overview', label: t('dashboard.talent.tabs.overview'), icon: <HomeIcon className="w-5 h-5 mr-2" /> },
            { id: 'availability', label: t('dashboard.talent.tabs.availability'), icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
            { id: 'portfolio', label: t('dashboard.talent.tabs.portfolio'), icon: <CameraIcon className="w-5 h-5 mr-2" /> },
            { id: 'plans', label: t('dashboard.talent.tabs.services'), icon: <PlusCircleIcon className="w-5 h-5 mr-2" /> },
        ];
        
        return (
            <>
            <div className="lg:col-span-3">
                <div className="flex border-b border-day-border dark:border-night-border mb-6 overflow-x-auto">
                    {talentTabs.map(tab => (
                         <button key={tab.id} onClick={() => setTalentTab(tab.id as TalentDashboardTab)} className={`flex items-center px-6 py-3 font-semibold transition-colors flex-shrink-0 ${talentTab === tab.id ? 'border-b-2 border-day-accent dark:border-night-accent text-day-accent dark:text-night-accent' : 'text-day-text-secondary dark:text-night-text-secondary'}`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {talentTab === 'overview' && (
                <>
                <div className="lg:col-span-2 space-y-8">
                     <FinanceWidget wallet={wallet} conversations={conversations} onWithdrawal={onWithdrawal} userRole={user.role} />
                     <RecentConversations conversations={conversations} currentUser={user} />
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <QuickActions user={user} onAction={handleQuickAction} />
                     {currentUserTalentProfile && <TalentStatsWidget talent={currentUserTalentProfile} />}
                </div>
                </>
            )}

            {talentTab === 'availability' && currentUserTalentProfile && (
                <div className="lg:col-span-3"><TalentAvailabilityManager talent={currentUserTalentProfile} onUpdate={onUpdateTalentProfile} /></div>
            )}
             {talentTab === 'portfolio' && currentUserTalentProfile && (
                <div className="lg:col-span-3"><PortfolioManager talent={currentUserTalentProfile} onUpdate={onUpdateTalentPortfolioImages} /></div>
            )}
            
            {talentTab === 'plans' && currentUserTalentProfile && (
                <div className="lg:col-span-3"><ServicePlanManager talent={currentUserTalentProfile} onUpdate={onUpdateTalentServicePlans} /></div>
            )}

            {currentUserTalentProfile && <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setEditProfileModalOpen(false)} talent={currentUserTalentProfile} onUpdate={onUpdateTalentProfile} />}
            </>
        )
    };

     const renderVenueDashboard = () => (
        <>
            <div className="lg:col-span-2 space-y-8">
                 <WalletSummary wallet={wallet} setWallet={setWallet} addNotification={addNotification} onWithdrawal={onWithdrawal} user={user}/>
                 <MyEvents events={events} onManageClick={handleManageEvent} />
            </div>
            <div className="lg:col-span-1 space-y-8">
                 <QuickActions user={user} onAction={handleQuickAction} />
                 <VenueStatsWidget events={events} />
            </div>
            <CreateEventModal isOpen={isCreateEventModalOpen} onClose={() => setCreateEventModalOpen(false)} onCreateEvent={onCreateEvent} />
            {eventToEdit && <EditEventModal event={eventToEdit} isOpen={!!eventToEdit} onClose={() => setEventToEdit(null)} onUpdateEvent={onUpdateEvent} />}
        </>
    );


    return (
        <div className="max-w-screen-xl mx-auto pt-24 pb-12">
            <div className="animate-fade-in mb-8">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-2">{t('dashboard.welcome')}, {user.name.split(' ')[0]}</h1>
                <p className="text-xl text-day-text-secondary dark:text-night-text-secondary">{t('dashboard.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {user.role === UserRole.CLIENT && renderClientDashboard()}
                {user.role === UserRole.TALENT && renderTalentDashboard()}
                {user.role === UserRole.VENUE && renderVenueDashboard()}
            </div>
        </div>
    );
};

export default DashboardScreen;
