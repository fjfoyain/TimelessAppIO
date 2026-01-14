// screens/AdminDashboardScreen.tsx
import React, { useState, useMemo, useEffect, useContext } from 'react';
import type { User, Talent, AppSettings, Wallet, Venue, Badge } from '../types';
import { UserStatus, UserRole } from '../types';
import { Card, Button, Tag, Input, Modal } from '../components/ui';
import { UsersIcon, CheckCircleIcon, SettingsIcon, DollarSignIcon, HomeIcon, AdminIcon, CertifiedIcon, TopVenueIcon, HighlyRatedVenueIcon, CommunityHubIcon, TopRatedIcon, HighlyBookedIcon, FastResponderIcon, RisingStarIcon, CommunityPickIcon, LuxuryPickIcon, BestAmbianceIcon } from '../components/icons';
import { LanguageContext } from '../contexts/LanguageContext';

const EditUserModal: React.FC<{ isOpen: boolean, onClose: () => void, user: User, onUpdate: (userId: string, updates: Partial<User>) => void }> = ({ isOpen, onClose, user, onUpdate }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const { t } = useContext(LanguageContext);
    
    useEffect(() => {
        if(user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = () => {
        onUpdate(user.id, { name, email });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('admin.modals.editUser.title')} ${user.name}`}>
            <div className="space-y-4">
                <Input label={t('admin.modals.editUser.nameLabel')} value={name} onChange={e => setName(e.target.value)} />
                <Input label={t('admin.modals.editUser.emailLabel')} type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button onClick={handleSubmit}>{t('common.saveChanges')}</Button>
                </div>
            </div>
        </Modal>
    );
};


const UserManagement: React.FC<{ users: User[], onUpdateUserStatus: (userId: string, status: UserStatus) => void, onUpdateUser: (userId: string, updates: Partial<User>) => void }> = ({ users, onUpdateUserStatus, onUpdateUser }) => {
    const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const { t } = useContext(LanguageContext);

    const confirmSuspend = () => {
        if (userToSuspend) {
            const newStatus = userToSuspend.status === UserStatus.SUSPENDED ? UserStatus.ACTIVE : UserStatus.SUSPENDED;
            onUpdateUserStatus(userToSuspend.id, newStatus);
            setUserToSuspend(null);
        }
    };

    return (
        <>
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('admin.users.title')}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-day-border dark:border-night-border">
                            <th className="p-2">{t('admin.users.table.user')}</th>
                            <th className="p-2">{t('admin.users.table.role')}</th>
                            <th className="p-2">{t('admin.users.table.status')}</th>
                            <th className="p-2">{t('admin.users.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-day-border dark:border-night-border last:border-b-0">
                                <td className="p-2 flex items-center gap-3">
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                    <span>{user.name}</span>
                                </td>
                                <td className="p-2">{user.role}</td>
                                <td className="p-2"><Tag>{user.status}</Tag></td>
                                <td className="p-2 space-x-2">
                                    <Button size="sm" variant="secondary" onClick={() => setUserToEdit(user)}>{t('common.edit')}</Button>
                                    <Button size="sm" variant="secondary" className={user.status === UserStatus.SUSPENDED ? 'text-day-success' : 'text-day-error'} onClick={() => setUserToSuspend(user)}>
                                        {user.status === UserStatus.SUSPENDED ? t('admin.users.reactivate') : t('admin.users.suspend')}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
        <Modal isOpen={!!userToSuspend} onClose={() => setUserToSuspend(null)} title={t('admin.modals.confirm.title')}>
            <p>
                {t('admin.modals.confirm.message', { action: userToSuspend?.status === UserStatus.SUSPENDED ? t('admin.users.reactivate').toLowerCase() : t('admin.users.suspend').toLowerCase(), name: userToSuspend?.name })}
            </p>
            <div className="flex justify-end gap-4 mt-6">
                <Button variant="secondary" onClick={() => setUserToSuspend(null)}>{t('common.cancel')}</Button>
                <Button onClick={confirmSuspend} className="bg-day-error dark:bg-night-error">{t('admin.modals.confirm.confirm')}</Button>
            </div>
        </Modal>
        {userToEdit && <EditUserModal isOpen={!!userToEdit} onClose={() => setUserToEdit(null)} user={userToEdit} onUpdate={onUpdateUser} />}
        </>
    );
};

const TalentCuration: React.FC<{ talents: Talent[], onUpdateTalentStatus: (talentId: string, status: UserStatus) => void }> = ({ talents, onUpdateTalentStatus }) => {
    const { t } = useContext(LanguageContext);
    const pendingTalents = talents.filter(t => t.user.status === UserStatus.PENDING);
    return (
         <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('admin.talentCuration.title', { count: pendingTalents.length })}</h3>
            <div className="space-y-4">
                {pendingTalents.length > 0 ? pendingTalents.map(talent => (
                    <Card key={talent.id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold">{talent.user.name}</p>
                            <p className="text-sm text-day-text-secondary">{talent.category} &bull; {talent.city}</p>
                        </div>
                        <div className="space-x-2">
                            <Button size="sm" onClick={() => onUpdateTalentStatus(talent.userId, UserStatus.ACTIVE)}>{t('admin.talentCuration.approve')}</Button>
                            <Button size="sm" variant="secondary" onClick={() => onUpdateTalentStatus(talent.userId, UserStatus.REJECTED)}>{t('admin.talentCuration.reject')}</Button>
                        </div>
                    </Card>
                )) : <p>{t('admin.talentCuration.empty')}</p>}
            </div>
        </Card>
    );
};

const TalentManagement: React.FC<{ talents: Talent[], onToggleCertification: (talentId: string) => void, onUpdateTalentBadges: (talentId: string, badges: Badge[]) => void }> = ({ talents, onToggleCertification, onUpdateTalentBadges }) => {
    const { t } = useContext(LanguageContext);
    
    const allBadges: Badge[] = [
        { id: 'badge-1', name: 'Top Rated', description: 'Consistently receives 5-star reviews.', icon: 'TopRated' },
        { id: 'badge-2', name: 'Highly Booked', description: 'A popular and frequently booked talent.', icon: 'HighlyBooked' },
        { id: 'badge-3', name: 'Fast Responder', description: 'Replies to messages quickly.', icon: 'FastResponder' },
        { id: 'badge-4', name: 'Rising Star', description: 'A promising new talent on the platform.', icon: 'RisingStar' },
        { id: 'badge-5', name: 'Community Pick', description: 'Recognized for outstanding contributions and service.', icon: 'CommunityPick' },
    ];

    const toggleBadge = (talent: Talent, badge: Badge) => {
        const hasBadge = talent.badges?.some(b => b.id === badge.id);
        const newBadges = hasBadge ? (talent.badges || []).filter(b => b.id !== badge.id) : [...(talent.badges || []), badge];
        onUpdateTalentBadges(talent.id, newBadges);
    };

    const TalentBadgeIcon: React.FC<{iconName: Badge['icon']}> = ({iconName}) => {
        const props = {className: "w-4 h-4 inline mr-1"};
        switch(iconName) {
            case 'TopRated': return <TopRatedIcon {...props}/>;
            case 'HighlyBooked': return <HighlyBookedIcon {...props}/>;
            case 'FastResponder': return <FastResponderIcon {...props}/>;
            case 'RisingStar': return <RisingStarIcon {...props}/>;
            case 'CommunityPick': return <CommunityPickIcon {...props}/>;
            default: return null;
        }
    };

    return (
         <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('admin.talentManagement.title')}</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-day-border dark:border-night-border">
                            <th className="p-2">{t('admin.talentManagement.table.talent')}</th>
                            <th className="p-2">{t('admin.talentManagement.table.status')}</th>
                            <th className="p-2">{t('admin.talentManagement.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {talents.filter(t => t.user.status === UserStatus.ACTIVE).map(talent => (
                             <tr key={talent.id} className="border-b border-day-border dark:border-night-border last:border-b-0">
                                <td className="p-2 flex items-center gap-3">
                                    <img src={talent.user.avatar} alt={talent.user.name} className="w-8 h-8 rounded-full object-cover" />
                                    <span>{talent.user.name}</span>
                                </td>
                                 <td className="p-2">
                                     <div className="flex flex-wrap gap-1">
                                        {talent.isCertified && <Tag><CertifiedIcon className="w-4 h-4 inline mr-1 text-yellow-500"/>{t('admin.talentManagement.certified')}</Tag>}
                                        {talent.badges?.map(b => <Tag key={b.id}><TalentBadgeIcon iconName={b.icon}/>{b.name}</Tag>)}
                                     </div>
                                </td>
                                <td className="p-2">
                                     <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => onToggleCertification(talent.id)}>
                                            {talent.isCertified ? t('admin.talentManagement.removeCert') : t('admin.talentManagement.makeCert')}
                                        </Button>
                                         {allBadges.map(badge => (
                                            <Button size="sm" variant="secondary" key={badge.id} onClick={() => toggleBadge(talent, badge)}>
                                                {talent.badges?.some(b => b.id === badge.id) ? `${t('common.remove')} ${badge.name}` : `${t('common.add')} ${badge.name}`}
                                            </Button>
                                        ))}
                                     </div>
                                </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const VenueCuration: React.FC<{ venues: Venue[], onUpdateUserStatus: (userId: string, status: UserStatus) => void }> = ({ venues, onUpdateUserStatus }) => {
    const { t } = useContext(LanguageContext);
    const pendingVenues = venues.filter(v => v.user.status === UserStatus.PENDING);
    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('admin.venueCuration.title', { count: pendingVenues.length })}</h3>
            <div className="space-y-4">
                {pendingVenues.length > 0 ? pendingVenues.map(venue => (
                    <Card key={venue.id} className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-bold">{venue.venueName}</p>
                            <p className="text-sm text-day-text-secondary">{venue.address}</p>
                        </div>
                        <div className="space-x-2">
                            <Button size="sm" onClick={() => onUpdateUserStatus(venue.userId, UserStatus.ACTIVE)}>{t('admin.venueCuration.approve')}</Button>
                            <Button size="sm" variant="secondary" onClick={() => onUpdateUserStatus(venue.userId, UserStatus.REJECTED)}>{t('admin.venueCuration.reject')}</Button>
                        </div>
                    </Card>
                )) : <p>{t('admin.venueCuration.empty')}</p>}
            </div>
        </Card>
    );
};

const VenueManagement: React.FC<{ venues: Venue[], onUpdateVenueBadges: (venueId: string, badges: Badge[]) => void }> = ({ venues, onUpdateVenueBadges }) => {
    const { t } = useContext(LanguageContext);
    const allBadges: Badge[] = [
        { id: 'vbadge-1', name: 'Top Venue', description: 'A highly sought-after venue.', icon: 'TopVenue' },
        { id: 'vbadge-2', name: 'Highly Rated', description: 'Consistently receives high ratings.', icon: 'HighlyRatedVenue' },
        { id: 'vbadge-3', name: 'Community Hub', description: 'Hosts frequent community events.', icon: 'CommunityHub' },
        { id: 'vbadge-4', name: 'Luxury Pick', description: 'Recognized for its luxurious amenities.', icon: 'LuxuryPick' },
        { id: 'vbadge-5', name: 'Best Ambiance', description: 'Known for its exceptional atmosphere.', icon: 'BestAmbiance' },
    ];

    const toggleBadge = (venue: Venue, badge: Badge) => {
        const hasBadge = venue.badges?.some(b => b.id === badge.id);
        const newBadges = hasBadge ? (venue.badges || []).filter(b => b.id !== badge.id) : [...(venue.badges || []), badge];
        onUpdateVenueBadges(venue.id, newBadges);
    };

    const VenueBadgeIcon: React.FC<{iconName: Badge['icon']}> = ({iconName}) => {
        const props = {className: "w-4 h-4 inline mr-1"};
        switch(iconName) {
            case 'TopVenue': return <TopVenueIcon {...props}/>;
            case 'HighlyRatedVenue': return <HighlyRatedVenueIcon {...props}/>;
            case 'CommunityHub': return <CommunityHubIcon {...props}/>;
            case 'LuxuryPick': return <LuxuryPickIcon {...props}/>;
            case 'BestAmbiance': return <BestAmbianceIcon {...props}/>;
            default: return null;
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('admin.venueManagement.title')}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-day-border dark:border-night-border">
                            <th className="p-2">{t('admin.venueManagement.table.venue')}</th>
                            <th className="p-2">{t('admin.venueManagement.table.badges')}</th>
                            <th className="p-2">{t('admin.venueManagement.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venues.filter(v => v.user.status === UserStatus.ACTIVE).map(venue => (
                            <tr key={venue.id} className="border-b border-day-border dark:border-night-border last:border-b-0">
                                <td className="p-2">{venue.venueName}</td>
                                <td className="p-2">
                                    <div className="flex flex-wrap gap-1">
                                        {venue.badges?.map(b => <Tag key={b.id}><VenueBadgeIcon iconName={b.icon}/> {b.name}</Tag>)}
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div className="flex flex-wrap gap-2">
                                        {allBadges.map(badge => (
                                            <Button size="sm" variant="secondary" key={badge.id} onClick={() => toggleBadge(venue, badge)}>
                                                {venue.badges?.some(b => b.id === badge.id) ? `${t('common.remove')} ${badge.name}` : `${t('common.add')} ${badge.name}`}
                                            </Button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const PlatformSettings: React.FC<{ settings: AppSettings, setSettings: React.Dispatch<React.SetStateAction<AppSettings>>, onSave: () => void }> = ({ settings, setSettings, onSave }) => {
    const { t } = useContext(LanguageContext);
    
    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('admin.settings.title')}</h3>
            <div className="max-w-md space-y-6">
                <div>
                    <label htmlFor="commission" className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                        {t('admin.settings.commissionLabel')}: <span className="font-bold text-day-accent dark:text-night-accent">{settings.commissionRate}%</span>
                    </label>
                    <input id="commission" type="range" min="1" max="20" step="0.5" value={settings.commissionRate} onChange={e => setSettings(prev => ({ ...prev, commissionRate: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                <div>
                    <label htmlFor="premierCommission" className="block text-sm font-medium text-day-text-secondary dark:text-night-text-secondary mb-2">
                        {t('admin.settings.premierCommissionLabel')}: <span className="font-bold text-day-accent dark:text-night-accent">{settings.premierCommissionRate ?? 10}%</span>
                    </label>
                    <input id="premierCommission" type="range" min="0" max="15" step="0.5" value={settings.premierCommissionRate} onChange={e => setSettings(prev => ({ ...prev, premierCommissionRate: Number(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                 <Input label={t('admin.settings.premierRequirementLabel')} type="number" value={settings.premierTierRequirement} onChange={e => setSettings(prev => ({...prev, premierTierRequirement: Number(e.target.value)}))} />

                <Button onClick={onSave}>{t('admin.settings.saveButton')}</Button>
            </div>
        </Card>
    );
};

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    return (
        <div className="w-full h-64 flex items-end justify-around p-4 bg-day-surface/50 dark:bg-night-surface/50 rounded-lg">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center h-full justify-end" style={{ width: `${100 / data.length}%` }}>
                    <div 
                        className="w-3/4 bg-day-accent dark:bg-night-accent rounded-t-md transition-all duration-500"
                        style={{ height: `${(d.value / (maxValue || 1)) * 100}%` }}
                        title={`$${d.value.toLocaleString()}`}
                    ></div>
                    <p className="text-xs mt-2">{d.label}</p>
                </div>
            ))}
        </div>
    );
};


const FinanceDashboard: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
    const { t } = useContext(LanguageContext);
    const totalVolume = useMemo(() => wallet.transactions.reduce((acc, t) => (t.type === 'payment' ? acc - t.amount : acc), 0), [wallet.transactions]);
    const totalCommissions = useMemo(() => wallet.transactions.reduce((acc, t) => (t.type === 'commission' ? acc + t.amount : acc), 0), [wallet.transactions]);

    // Mock chart data for visualization
    const chartData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
        
        return last7Days.map(day => ({
            label: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
            value: Math.floor(Math.random() * (totalVolume/4))
        }));
    }, [totalVolume]);

    return (
        <Card className="p-6">
            <h3 className="text-2xl font-serif font-bold mb-4">{t('admin.finance.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4"><p className="text-sm text-day-text-secondary">{t('admin.finance.volume')}</p><p className="text-2xl font-bold">${totalVolume.toLocaleString()}</p></Card>
                <Card className="p-4"><p className="text-sm text-day-text-secondary">{t('admin.finance.commissions')}</p><p className="text-2xl font-bold">${totalCommissions.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
                <Card className="p-4"><p className="text-sm text-day-text-secondary">{t('admin.finance.escrow')}</p><p className="text-2xl font-bold">${wallet.escrow.toLocaleString()}</p></Card>
            </div>
            <h4 className="text-xl font-serif font-bold mb-2">{t('admin.finance.recentVolume')}</h4>
            <SimpleBarChart data={chartData} />
        </Card>
    );
};


interface AdminDashboardScreenProps {
    users: User[];
    talents: Talent[];
    venues: Venue[];
    onUpdateUserStatus: (userId: string, status: UserStatus) => void;
    onToggleTalentCertification: (talentId: string) => void;
    onUpdateVenueBadges: (venueId: string, badges: Badge[]) => void;
    onUpdateUser: (userId: string, updates: Partial<User>) => void;
    appSettings: AppSettings;
    setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    wallet: Wallet;
    addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
    onUpdateTalentBadges: (talentId: string, badges: Badge[]) => void;
}

type AdminTab = 'users' | 'talentCuration' | 'talentManagement' |'venueCuration' | 'venueManagement' | 'settings' | 'finance';

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ users, talents, venues, onUpdateUserStatus, onToggleTalentCertification, onUpdateVenueBadges, onUpdateUser, appSettings, setAppSettings, wallet, addNotification, onUpdateTalentBadges }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const { t } = useContext(LanguageContext);
    
    const handleSaveSettings = () => {
        addNotification(t('admin.notifications.settingsSaved'), 'success');
    };

    const tabs: Record<AdminTab, React.ReactNode> = {
        users: <UserManagement users={users.filter(u => u.role !== UserRole.ADMIN)} onUpdateUserStatus={onUpdateUserStatus} onUpdateUser={onUpdateUser} />,
        talentCuration: <TalentCuration talents={talents} onUpdateTalentStatus={onUpdateUserStatus} />,
        talentManagement: <TalentManagement talents={talents} onToggleCertification={onToggleTalentCertification} onUpdateTalentBadges={onUpdateTalentBadges} />,
        venueCuration: <VenueCuration venues={venues} onUpdateUserStatus={onUpdateUserStatus} />,
        venueManagement: <VenueManagement venues={venues} onUpdateVenueBadges={onUpdateVenueBadges} />,
        finance: <FinanceDashboard wallet={wallet} />,
        settings: <PlatformSettings settings={appSettings} setSettings={setAppSettings} onSave={handleSaveSettings} />,
    };
    
    const tabItems = [
        { id: 'users', label: t('admin.tabs.users'), icon: <UsersIcon className="w-5 h-5 mr-2" />},
        { id: 'talentCuration', label: t('admin.tabs.talentCuration'), icon: <CheckCircleIcon className="w-5 h-5 mr-2" />},
        { id: 'talentManagement', label: t('admin.tabs.talentManagement'), icon: <CertifiedIcon className="w-5 h-5 mr-2" />},
        { id: 'venueCuration', label: t('admin.tabs.venueCuration'), icon: <CheckCircleIcon className="w-5 h-5 mr-2" />},
        { id: 'venueManagement', label: t('admin.tabs.venueManagement'), icon: <HomeIcon className="w-5 h-5 mr-2" />},
        { id: 'finance', label: t('admin.tabs.finance'), icon: <DollarSignIcon className="w-5 h-5 mr-2" />},
        { id: 'settings', label: t('admin.tabs.settings'), icon: <SettingsIcon className="w-5 h-5 mr-2" />},
    ]

    return (
        <div className="max-w-screen-xl mx-auto pt-24 pb-12">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8">{t('admin.title')}</h1>
            <div className="flex border-b border-day-border dark:border-night-border mb-6 overflow-x-auto">
                {tabItems.map(tab => (
                     <button key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} className={`flex items-center px-6 py-3 font-semibold transition-colors flex-shrink-0 ${activeTab === tab.id ? 'border-b-2 border-day-accent dark:border-night-accent text-day-accent dark:text-night-accent' : 'text-day-text-secondary dark:text-night-text-secondary'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
            <div className="animate-fade-in">
                {tabs[activeTab]}
            </div>
        </div>
    );
};

export default AdminDashboardScreen;