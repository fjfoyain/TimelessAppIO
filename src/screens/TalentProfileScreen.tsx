
// screens/TalentProfileScreen.tsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Talent, User, Conversation, ServicePlan, Review, Event, StructuredBrief, Wallet, Badge, SocialLinks, Provider, ProviderItem, RentedItem } from '../types';
import { UserRole, NegotiationStatus } from '../types';
import { Card, Button, Tag, Modal, Input, Spinner } from '../components/ui';
import { StarIcon, CheckCircleIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, CertifiedIcon, UsersGroupIcon, TopRatedIcon, HighlyBookedIcon, FastResponderIcon, RisingStarIcon, CommunityPickIcon, MapPinIcon, XIconSocial, InstagramIcon, FacebookIcon, TiktokIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon, DeezerIcon, YoutubeMusicIcon, TidalIcon, MixcloudIcon, SoundcloudIcon, FlickrIcon, BehanceIcon, SpeakerIcon, LightIcon, TruckIcon, CubeIcon, ZapIcon, PlusCircleIcon, TrashIcon } from '../components/icons';
import { LanguageContext } from '../contexts/LanguageContext';
import { LocationPicker, GoogleMapsView, ReviewForm } from './EventsAndTicketsScreens';

// ... (SocialLinksDisplay and other existing helper components remain the same) ...
const socialIconMap: Record<string, { icon: React.FC<any>, name: string }> = {
    twitter: { icon: XIconSocial, name: 'X / Twitter' },
    instagram: { icon: InstagramIcon, name: 'Instagram' },
    facebook: { icon: FacebookIcon, name: 'Facebook' },
    tiktok: { icon: TiktokIcon, name: 'TikTok' },
    youtube: { icon: YoutubeIcon, name: 'YouTube' },
    spotify: { icon: SpotifyIcon, name: 'Spotify' },
    appleMusic: { icon: AppleMusicIcon, name: 'Apple Music' },
    deezer: { icon: DeezerIcon, name: 'Deezer' },
    youtubeMusic: { icon: YoutubeMusicIcon, name: 'YouTube Music' },
    tidal: { icon: TidalIcon, name: 'TIDAL' },
    mixcloud: { icon: MixcloudIcon, name: 'Mixcloud' },
    soundcloud: { icon: SoundcloudIcon, name: 'SoundCloud' },
    flickr: { icon: FlickrIcon, name: 'Flickr' },
    behance: { icon: BehanceIcon, name: 'Behance' },
    fiveHundredPx: { icon: () => <span className="font-bold text-lg leading-none">500px</span>, name: '500px' },
};

const SocialLinksDisplay: React.FC<{ socials: SocialLinks, talentCategory: string }> = ({ socials, talentCategory }) => {
     const platformKeys: { [key: string]: (keyof SocialLinks)[] } = {
        music: ['spotify', 'appleMusic', 'soundcloud', 'mixcloud', 'deezer', 'tidal', 'youtubeMusic'],
        visualPortfolio: ['flickr', 'behance', 'fiveHundredPx', 'instagram'],
        videoPortfolio: ['youtube', 'tiktok'],
        generalSocial: ['twitter', 'facebook']
    };

    let categories: { title: string, keys: (keyof SocialLinks)[] }[] = [];

    switch (talentCategory) {
        case 'DJ':
        case 'Live Band':
            categories = [
                { title: 'Music Platforms', keys: [...platformKeys.music, 'youtube'] },
                { title: 'Social Media', keys: ['instagram', 'tiktok', ...platformKeys.generalSocial] }
            ];
            break;
        case 'Photographer':
            categories = [
                { title: 'Portfolio', keys: platformKeys.visualPortfolio },
                { title: 'Social Media', keys: ['youtube', 'tiktok', ...platformKeys.generalSocial] }
            ];
            break;
        case 'Private Chef':
        case 'Mixologist':
            categories = [
                { title: 'Portfolio', keys: ['instagram', ...platformKeys.videoPortfolio] },
                { title: 'Social Media', keys: platformKeys.generalSocial }
            ];
            break;
        default:
            categories = [
                { title: 'Social Media', keys: Object.values(platformKeys).flat() }
            ];
    }
    
    const renderLinks = (keys: (keyof SocialLinks)[]) => {
        const uniqueKeys = [...new Set(keys)];
        const links = uniqueKeys.map(key => {
            const url = socials[key];
            const social = socialIconMap[key];
            if (!url || !social) return null;
            const IconComponent = social.icon;
            return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" title={social.name} className="text-day-text-secondary dark:text-night-text-secondary hover:text-day-text dark:hover:text-night-text transition-colors">
                    <IconComponent className="w-7 h-7" />
                </a>
            );
        }).filter(Boolean);
        return links.length > 0 ? <div className="flex flex-wrap items-center gap-4">{links}</div> : null;
    };
    
    const renderedCategories = categories.map(cat => {
        const availableKeys = cat.keys.filter(key => socials[key]);
        if (availableKeys.length === 0) return null;
        const renderedContent = renderLinks(availableKeys);
        return renderedContent ? { ...cat, content: renderedContent } : null;
    }).filter(Boolean);
    
    if (renderedCategories.length === 0) return null;
    
    return (
        <div className="mt-6 pt-6 border-t border-day-border/50 dark:border-night-border/50 space-y-4">
            {renderedCategories.map(cat => (
                cat && <div key={cat.title}>
                    <h4 className="text-sm font-semibold uppercase text-day-text-secondary dark:text-night-text-secondary mb-3">{cat.title}</h4>
                    {cat.content}
                </div>
            ))}
        </div>
    );
};

const BadgeIcon: React.FC<{badge: Badge, className?: string}> = ({ badge, className="w-6 h-6" }) => {
    const props = { className: className, title: badge.name };
    switch(badge.icon) {
        case 'TopRated': return <TopRatedIcon {...props} />;
        case 'HighlyBooked': return <HighlyBookedIcon {...props} />;
        case 'FastResponder': return <FastResponderIcon {...props} />;
        case 'RisingStar': return <RisingStarIcon {...props} />;
        case 'CommunityPick': return <CommunityPickIcon {...props} />;
        default: return null;
    }
}

const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => (
    <div className="space-y-4">
        {reviews.map(review => (
            <Card key={review.id} className="p-4">
                <div className="flex justify-between">
                    <p className="font-bold">{review.author}</p>
                    <div className="flex items-center">{Array(review.rating).fill(0).map((_,i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400"/>)}</div>
                </div>
                <p className="mt-2 text-day-text-secondary max-w-prose">{review.comment}</p>
            </Card>
        ))}
    </div>
);

const KeyStats: React.FC<{ talent: Talent }> = ({ talent }) => (
    <Card className="p-6">
        <h3 className="text-2xl font-serif font-bold mb-4">Key Stats</h3>
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-day-text-secondary"><CheckCircleIcon className="w-5 h-5" />Jobs Completed</span>
                <span className="font-bold text-lg">{talent.jobsCompleted}+</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-day-text-secondary"><ClockIcon className="w-5 h-5" />Response Rate</span>
                <span className="font-bold text-lg">{talent.responseRate}%</span>
            </div>
        </div>
    </Card>
);

const AvailabilityCalendar: React.FC<{ availability?: string[] }> = ({ availability = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const changeMonth = (amount: number) => setCurrentDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + amount); return d; });
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-serif font-bold">Availability</h3>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => changeMonth(-1)}><ChevronLeftIcon className="w-4 h-4" /></Button>
                    <span className="w-32 text-center font-semibold text-base">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <Button variant="secondary" size="sm" onClick={() => changeMonth(1)}><ChevronRightIcon className="w-4 h-4" /></Button>
                </div>
            </div>
            <p className="text-sm text-day-text-secondary mb-4">This is an estimate. Please send a request to confirm dates.</p>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-day-text-secondary">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm mt-2 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const date = day + 1;
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const isBooked = availability.includes(dateString);
                    return <div key={date} className="p-1 flex items-center justify-center"><span className={`w-8 h-8 flex items-center justify-center rounded-full ${isBooked ? 'bg-day-error/20 text-day-error line-through' : ''}`}>{date}</span></div>;
                })}
            </div>
        </Card>
    );
};

// ... (ServiceMarketplace and other components same as before) ...
const ServiceMarketplace: React.FC<{ 
    providers: Provider[], 
    rentedItems: RentedItem[], 
    setRentedItems: React.Dispatch<React.SetStateAction<RentedItem[]>>,
    durationHours: number
}> = ({ providers, rentedItems, setRentedItems, durationHours }) => {
    // ... existing logic ...
    const [selectedCategory, setSelectedCategory] = useState<string>('Audio & Sound');
    const categories = ['Audio & Sound', 'Lighting', 'Stage & Structure', 'Video & Multimedia', 'Furniture & Decor', 'Production Services', 'Power & Security', 'Catering Equipment', 'Transport & Logistics', 'Special FX'];
    
    const categoryIcons: Record<string, React.ReactNode> = {
        'Audio & Sound': <SpeakerIcon className="w-5 h-5" />,
        'Lighting': <LightIcon className="w-5 h-5" />,
        'Transport & Logistics': <TruckIcon className="w-5 h-5" />,
        'Stage & Structure': <CubeIcon className="w-5 h-5" />,
        'Power & Security': <ZapIcon className="w-5 h-5" />
    };

    const itemsInCategory = useMemo(() => {
        return providers.flatMap(p => p.items.filter(i => i.category === selectedCategory).map(i => ({...i, providerName: p.companyName})));
    }, [providers, selectedCategory]);

    const handleAddItem = (item: ProviderItem & { providerName: string }) => {
        setRentedItems(prev => {
            const existing = prev.find(i => i.itemId === item.id);
            if (existing) {
                return prev.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * item.pricePerHour * durationHours } : i);
            }
            return [...prev, { itemId: item.id, name: item.name, quantity: 1, pricePerHour: item.pricePerHour, totalPrice: item.pricePerHour * durationHours }];
        });
    };

    const handleRemoveItem = (itemId: string) => {
        setRentedItems(prev => {
            const existing = prev.find(i => i.itemId === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1, totalPrice: (i.quantity - 1) * i.pricePerHour * durationHours } : i);
            }
            return prev.filter(i => i.itemId !== itemId);
        });
    };
    
    return (
        <div className="flex flex-col md:flex-row gap-6 h-[60vh] overflow-hidden">
            {/* Categories Sidebar */}
            <div className="w-full md:w-1/5 border-r border-day-border dark:border-night-border pr-2 overflow-y-auto custom-scrollbar">
                <h4 className="font-bold mb-3 text-sm uppercase text-day-text-secondary tracking-wider">Categories</h4>
                <div className="space-y-1">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${selectedCategory === cat ? 'bg-day-accent text-white' : 'hover:bg-day-surface dark:hover:bg-night-surface'}`}
                        >
                            {categoryIcons[cat] || <CubeIcon className="w-4 h-4"/>}
                            <span className="truncate">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Grid */}
            <div className="w-full md:w-3/5 overflow-y-auto px-4 custom-scrollbar">
                <h4 className="font-bold mb-3 sticky top-0 bg-day-surface dark:bg-[#1E293B] z-10 py-2 backdrop-blur-sm text-lg border-b border-day-border dark:border-night-border">{selectedCategory} Items</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {itemsInCategory.map(item => (
                        <div key={item.id} className="p-3 border border-day-border dark:border-night-border rounded-xl bg-day-bg/50 dark:bg-night-bg/50 hover:border-day-accent transition-colors group cursor-pointer flex flex-col h-full" onClick={() => handleAddItem(item)}>
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 overflow-hidden relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                    ${item.pricePerHour}/hr
                                </div>
                            </div>
                            <p className="font-bold text-sm truncate" title={item.name}>{item.name}</p>
                            <p className="text-xs text-day-text-secondary mb-2">{item.providerName}</p>
                            <div className="mt-auto">
                                <Button size="sm" variant="secondary" fullWidth className="text-xs py-1">Add to Kit</Button>
                            </div>
                        </div>
                    ))}
                    {itemsInCategory.length === 0 && <div className="col-span-full text-center py-12 text-day-text-secondary">No items available in this category.</div>}
                </div>
            </div>

            {/* Cart / Kit */}
            <div className="w-full md:w-1/5 border-l border-day-border dark:border-night-border pl-4 flex flex-col h-full bg-day-surface/30 dark:bg-night-surface/30 rounded-lg p-2">
                 <div className="flex items-center justify-between mb-3">
                     <h4 className="font-bold text-sm uppercase text-day-text-secondary tracking-wider">Your Kit</h4>
                     <span className="text-xs bg-day-accent/10 text-day-accent px-2 py-0.5 rounded-full">{rentedItems.length} items</span>
                 </div>
                 
                 <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar pr-1">
                    {rentedItems.length === 0 ? (
                        <div className="text-center py-10 text-day-text-secondary text-sm border-2 border-dashed border-day-border rounded-lg flex flex-col items-center justify-center h-full">
                            <PlusCircleIcon className="w-8 h-8 mb-2 opacity-50"/>
                            <p>Click items to add</p>
                        </div>
                    ) : (
                        rentedItems.map(item => (
                            <div key={item.itemId} className="p-2 bg-day-bg dark:bg-night-bg rounded-lg border border-day-border dark:border-night-border flex justify-between items-center animate-slide-up-fade shadow-sm">
                                <div className="flex-1 min-w-0 mr-2">
                                    <p className="font-bold text-xs truncate" title={item.name}>{item.name}</p>
                                    <p className="text-[10px] text-day-text-secondary">{item.quantity} x ${item.pricePerHour}/h</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-mono font-bold">${item.totalPrice.toLocaleString()}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.itemId); }} className="text-day-error hover:bg-day-error/10 p-1 rounded mt-1">
                                        <TrashIcon className="w-3 h-3"/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
                 <div className="pt-4 border-t border-day-border dark:border-night-border mt-2">
                     <div className="flex justify-between items-center mb-1">
                         <span className="text-xs text-day-text-secondary">Duration</span>
                         <span className="font-mono text-sm">{durationHours}h</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="font-bold text-sm">Total</span>
                         <span className="font-bold text-lg text-day-accent">${rentedItems.reduce((sum, i) => sum + i.totalPrice, 0).toLocaleString()}</span>
                     </div>
                 </div>
            </div>
        </div>
    )
}


interface TalentProfileScreenProps {
    talents: Talent[];
    providers: Provider[];
    currentUser: User | null;
    conversations: Conversation[];
    startNewConversation: (talentId: string, brief: StructuredBrief, initialMessage: string, plan: any, serviceLocation: { lat: number; lng: number; address: string; }, eventDate: string, eventId?: string, rentedItems?: RentedItem[]) => string | undefined;
    userEvents: Event[];
    onReviewSubmit: (talentId: string, rating: number, comment: string, conversationId: string) => void;
    wallet: Wallet;
}

const TalentProfileScreen: React.FC<TalentProfileScreenProps> = ({ talents, providers, currentUser, conversations, startNewConversation, userEvents, onReviewSubmit, wallet }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [talent, setTalent] = useState<Talent | null>(null);
    
    // Booking Modal State
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [bookingStep, setBookingStep] = useState(1);
    
    // Step 1 Data
    const [selectedPlan, setSelectedPlan] = useState<ServicePlan | {title: string}>({title: ''});
    const [brief, setBrief] = useState<StructuredBrief>({ eventType: '', audienceSize: '', vibe: '', budget: '', durationHours: 4, startTime: '18:00' });
    const [eventDate, setEventDate] = useState('');
    const [serviceLocation, setServiceLocation] = useState<{lat: number, lng: number} | null>(null);
    
    // Step 2 Data
    const [rentedItems, setRentedItems] = useState<RentedItem[]>([]);

    // Step 3 Data
    const [message, setMessage] = useState('');
    const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});

    const { t } = useContext(LanguageContext);
    
    useEffect(() => {
        const foundTalent = talents.find(t => t.id === id);
        if (foundTalent) setTalent(foundTalent);
        else navigate('/404');
    }, [id, talents, navigate]);
    
    const canReviewConversation = useMemo(() => {
        if (!currentUser || !talent) return null;
        return conversations.find(c => 
            c.participants.includes(currentUser.id) && 
            c.participants.includes(talent.userId) && 
            c.negotiation.status === NegotiationStatus.COMPLETED && 
            !c.isReviewed
        );
    }, [currentUser, talent, conversations]);

    const isDateAvailable = useMemo(() => {
        if (!eventDate || !talent?.availability) return true;
        return !talent.availability.includes(eventDate);
    }, [eventDate, talent]);

    const talentFee = useMemo(() => {
        const basePrice = 'price' in selectedPlan ? selectedPlan.price : 0;
        const addOnsPrice = Object.keys(selectedAddOns).reduce((total, addonId) => {
            if (selectedAddOns[addonId] && 'addOns' in selectedPlan && selectedPlan.addOns) {
                const addOn = selectedPlan.addOns.find(a => a.id === addonId);
                return total + (addOn?.price || 0);
            }
            return total;
        }, 0);
        return basePrice + addOnsPrice;
    }, [selectedPlan, selectedAddOns]);

    const equipmentFee = useMemo(() => rentedItems.reduce((sum, item) => sum + item.totalPrice, 0), [rentedItems]);
    const totalEstimatedCost = talentFee + equipmentFee + 20; // + Reservation Fee

    const handleRequestQuote = (plan: ServicePlan | {title: string}) => {
        if (!currentUser) { navigate('/login'); return; }
        if (currentUser.id === talent?.userId) { alert("You cannot book yourself."); return; }
        
        // Reset State
        setBookingStep(1);
        setEventDate('');
        setBrief({ eventType: '', audienceSize: '', vibe: '', budget: '', durationHours: 4, startTime: '18:00' });
        setRentedItems([]);
        setMessage('');
        setSelectedAddOns({});
        setServiceLocation(null);
        
        setSelectedPlan(plan);
        setIsQuoteModalOpen(true);
    };
    
    const handleNextStep = () => {
        if (bookingStep === 1) {
             if (!eventDate || !isDateAvailable || !serviceLocation) {
                 alert("Please select a valid date and location.");
                 return;
             }
             setBookingStep(2);
        } else if (bookingStep === 2) {
            setBookingStep(3);
        }
    };
    
    const handlePrevStep = () => {
        if(bookingStep > 1) setBookingStep(prev => prev - 1);
    }

    const handleSendQuoteRequest = () => {
        const selectedAddOnDetails = ('addOns' in selectedPlan && selectedPlan.addOns)
            ? selectedPlan.addOns.filter(addon => selectedAddOns[addon.id]).map(addon => `- ${addon.name} ($${addon.price})`).join('\n')
            : '';
            
        const addOnsMessage = selectedAddOnDetails ? `\nSelected Add-ons:\n${selectedAddOnDetails}` : '';
        const initialMessage = `${message}${addOnsMessage}`;
        const locationData = { ...serviceLocation!, address: `Custom Location` };

        const newConversationId = startNewConversation(
            talent!.id, 
            brief, 
            initialMessage, 
            { ...selectedPlan, offer: talentFee }, 
            locationData, 
            eventDate, 
            undefined, 
            rentedItems
        );
        
        if (newConversationId) {
            setIsQuoteModalOpen(false);
            navigate(`/messages/${newConversationId}`);
        }
    };

    if (!talent) return <div className="text-center py-20"><Spinner/></div>;

    const renderStepContent = () => {
        switch(bookingStep) {
            case 1: return (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 pb-10 custom-scrollbar">
                     <div>
                        <label className="block text-sm font-medium mb-1">Event Date & Time</label>
                        <div className="flex gap-4">
                             <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} className="flex-grow"/>
                             <Input type="time" value={brief.startTime} onChange={e => setBrief(b => ({...b, startTime: e.target.value}))} className="w-32"/>
                        </div>
                        {!isDateAvailable && <p className="text-sm text-day-error mt-1">Date unavailable.</p>}
                     </div>
                     
                     <div className="flex gap-4">
                         <div className="w-1/2">
                            <Input label="Duration (Hours)" type="number" min="1" max="24" value={brief.durationHours} onChange={e => setBrief(b => ({ ...b, durationHours: parseInt(e.target.value) || 1 }))} />
                         </div>
                         <div className="w-1/2">
                             <Input label="Event Type" value={brief.eventType} onChange={e => setBrief(b => ({ ...b, eventType: e.target.value }))} placeholder="e.g., Gala" />
                         </div>
                     </div>

                    <Input label="Audience Size" value={brief.audienceSize} onChange={e => setBrief(b => ({ ...b, audienceSize: e.target.value }))} placeholder="e.g., 150 guests" />
                    <Input label="Desired Vibe" value={brief.vibe} onChange={e => setBrief(b => ({ ...b, vibe: e.target.value }))} placeholder="e.g., High-energy" />
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Service Location</label>
                        <LocationPicker 
                            onLocationSelect={(lat, lng) => setServiceLocation({ lat, lng })}
                            className="h-64 border border-day-border dark:border-night-border"
                        />
                        {serviceLocation ? <p className="text-sm text-day-success mt-2 flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> Location Selected ({serviceLocation.lat.toFixed(4)}, {serviceLocation.lng.toFixed(4)})</p> : <p className="text-sm text-day-text-secondary mt-1">Click on map to set location</p>}
                    </div>
                </div>
            );
            case 2: return (
                <div className="h-full flex flex-col">
                    <p className="text-sm text-day-text-secondary mb-4">Enhance your event with professional equipment rentals. Prices are calculated based on your {brief.durationHours}-hour event.</p>
                    <ServiceMarketplace providers={providers} rentedItems={rentedItems} setRentedItems={setRentedItems} durationHours={brief.durationHours} />
                </div>
            );
            case 3: return (
                <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 pb-10 custom-scrollbar">
                     {'addOns' in selectedPlan && selectedPlan.addOns && selectedPlan.addOns.length > 0 && (
                        <div className="p-4 bg-day-surface dark:bg-night-surface rounded-xl border border-day-border dark:border-night-border">
                            <h4 className="font-bold mb-2">Talent Add-ons</h4>
                            <div className="space-y-2">
                                {selectedPlan.addOns.map(addon => (
                                    <label key={addon.id} className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm">{addon.name} (+${addon.price})</span>
                                        <input type="checkbox" checked={!!selectedAddOns[addon.id]} onChange={() => setSelectedAddOns(prev => ({...prev, [addon.id]: !prev[addon.id]}))} className="h-4 w-4 rounded text-day-accent"/>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="font-bold mb-2">Message to {talent.user.name}</h4>
                        <textarea
                            className="w-full p-3 bg-day-bg/50 dark:bg-night-bg/50 border border-day-border dark:border-night-border rounded-lg text-base"
                            rows={3}
                            placeholder="Share any specific requests or vision for the event..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="border-t border-day-border dark:border-night-border pt-4">
                        <div className="flex justify-between text-sm mb-1"><span>Talent Fee ({selectedPlan.title})</span> <span>${talentFee.toLocaleString()}</span></div>
                        {equipmentFee > 0 && <div className="flex justify-between text-sm mb-1"><span>Equipment Rentals ({rentedItems.length} items)</span> <span>${equipmentFee.toLocaleString()}</span></div>}
                        <div className="flex justify-between text-sm mb-1"><span>Reservation Fee</span> <span>$20.00</span></div>
                        <div className="flex justify-between font-bold text-xl mt-2 text-day-accent dark:text-night-accent"><span>Estimated Total</span> <span>${totalEstimatedCost.toLocaleString()}</span></div>
                    </div>
                </div>
            );
        }
    }

    const modalSize = bookingStep === 2 ? 'max-w-7xl h-[90vh]' : 'max-w-2xl';

    return (
        <div className="max-w-screen-xl mx-auto pt-24 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="p-6 animate-slide-up-fade" style={{animationDelay: '100ms'}}>
                         <div className="flex flex-wrap items-center gap-4 mb-4">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold">{talent.user.name}</h1>
                            {talent.isCertified && <div title="Timeless Certified" className="bg-yellow-300/20 text-yellow-300 backdrop-blur-sm rounded-full flex items-center gap-2 px-4 py-2 border border-yellow-300/50"><CertifiedIcon className="w-6 h-6" /> <span className="font-semibold text-sm">Timeless Certified</span></div>}
                        </div>
                        <p className="text-2xl mt-1 text-day-text-secondary dark:text-night-text-secondary">{talent.category} from {talent.city}</p>
                        
                         {talent.collectiveName && (
                            <button onClick={() => navigate(`/marketplace?collectiveId=${talent.collectiveId}`)} className="mt-4 inline-flex items-center gap-2 text-sm text-day-accent dark:text-night-accent hover:underline">
                                <UsersGroupIcon className="w-5 h-5" />
                                Part of the <strong>{talent.collectiveName}</strong> Collective
                            </button>
                        )}
                        
                        {talent.badges && talent.badges.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                {talent.badges.map(badge => (
                                    <div key={badge.id} title={badge.description} className="flex items-center gap-2 p-2 rounded-lg bg-day-surface dark:bg-night-surface">
                                        <BadgeIcon badge={badge} className="w-6 h-6 text-day-accent dark:text-night-accent" />
                                        <span className="text-sm font-semibold">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-base text-day-text-secondary dark:text-night-text-secondary whitespace-pre-line mt-6 max-w-prose">{talent.bio}</p>
                        
                        {talent.socials && <SocialLinksDisplay socials={talent.socials} talentCategory={talent.category} />}

                        <div className="mt-6 flex flex-wrap gap-2">
                            {talent.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                        </div>
                    </Card>

                    <Card className="p-6 animate-slide-up-fade" style={{animationDelay: '200ms'}}>
                         <h2 className="text-3xl font-serif font-bold mb-4">Portfolio</h2>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {talent.portfolio.map((item, index) => (
                                <img key={index} src={item.url} alt={`Portfolio item ${index + 1}`} className="w-full h-full object-cover rounded-lg aspect-square" />
                            ))}
                         </div>
                    </Card>
                    
                    <Card className="p-6 animate-slide-up-fade" style={{animationDelay: '300ms'}}>
                        <h2 className="text-3xl font-serif font-bold mb-4">Reviews ({talent.reviews.length})</h2>
                        {talent.reviews.length > 0 ? <ReviewList reviews={talent.reviews} /> : <p>No reviews yet.</p>}
                        
                        {canReviewConversation && (
                             <ReviewForm onSubmit={(rating, comment) => onReviewSubmit(talent.id, rating, comment, canReviewConversation.id)} />
                        )}
                    </Card>
                </div>

                {/* Right Column - Sticky Actions */}
                <div className="lg:col-span-2 space-y-6 h-fit sticky top-28">
                    <div className="animate-slide-up-fade" style={{animationDelay: '400ms'}}><KeyStats talent={talent} /></div>
                    <div className="animate-slide-up-fade" style={{animationDelay: '500ms'}}><AvailabilityCalendar availability={talent.availability} /></div>

                    <Card className="p-6 animate-slide-up-fade" style={{animationDelay: '600ms'}}>
                        <h2 className="text-3xl font-serif font-bold mb-4">Services</h2>
                        <div className="space-y-4">
                            {talent.servicePlans.map(plan => (
                                <Card key={plan.id} className="p-4 border border-day-border dark:border-night-border bg-day-accent-subtle dark:bg-night-accent-subtle">
                                    <h3 className="font-bold font-serif text-xl">{plan.title}</h3>
                                    <p className="text-3xl font-bold font-serif my-2">${plan.price}</p>
                                    <p className="text-sm text-day-text-secondary dark:text-night-text-secondary mb-3 max-w-prose">{plan.description}</p>
                                    <ul className="text-sm space-y-1 list-disc list-inside mb-4">
                                        {plan.includes.map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                    <Button fullWidth onClick={() => handleRequestQuote(plan)}>Request Quote</Button>
                                </Card>
                            ))}
                             <Card className="p-4 border border-day-border dark:border-night-border">
                                    <h3 className="font-bold font-serif text-xl">Custom Request</h3>
                                    <p className="text-sm text-day-text-secondary dark:text-night-text-secondary my-2 max-w-prose">Have something else in mind? Send a custom request.</p>
                                    <Button fullWidth onClick={() => handleRequestQuote({title: 'Custom Request'})}>Send Custom Request</Button>
                            </Card>
                        </div>
                    </Card>
                </div>
            </div>

            {/* MULTI-STEP MODAL */}
            <Modal 
                isOpen={isQuoteModalOpen} 
                onClose={() => setIsQuoteModalOpen(false)} 
                title={bookingStep === 1 ? `Event Details` : bookingStep === 2 ? `Equipment & Add-ons` : `Summary & Message`}
                maxWidth={modalSize}
            >
                <div className="w-full h-full flex flex-col">
                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-6 space-x-2 flex-shrink-0">
                        <div className={`h-2 w-16 rounded-full ${bookingStep >= 1 ? 'bg-day-accent' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 w-16 rounded-full ${bookingStep >= 2 ? 'bg-day-accent' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 w-16 rounded-full ${bookingStep >= 3 ? 'bg-day-accent' : 'bg-gray-300'}`}></div>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto">
                        {renderStepContent()}
                    </div>

                    <div className="flex justify-between mt-4 pt-4 border-t border-day-border dark:border-night-border bg-day-surface dark:bg-[#1E293B] sticky bottom-0 z-20">
                        {bookingStep > 1 ? (
                             <Button variant="secondary" onClick={handlePrevStep}>Back</Button>
                        ) : (
                            <Button variant="secondary" onClick={() => setIsQuoteModalOpen(false)}>Cancel</Button>
                        )}

                        {bookingStep < 3 ? (
                            <Button onClick={handleNextStep} className="px-8">Next Step</Button>
                        ) : (
                            <Button onClick={handleSendQuoteRequest} disabled={!message.trim()} className="px-8">Send Request</Button>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TalentProfileScreen;
