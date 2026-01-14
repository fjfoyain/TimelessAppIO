// screens/MarketplaceScreen.tsx
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Talent, Badge } from '../types';
import { Card, Input, Button, Tag, SkeletonLoader, LazyImage, EmptyState } from '../components/ui';
import { CertifiedIcon, TopRatedIcon, HighlyBookedIcon, FastResponderIcon, RisingStarIcon, CommunityPickIcon } from '../components/icons';
import { LanguageContext } from '../contexts/LanguageContext';

const BadgeIcon: React.FC<{badge: Badge}> = ({ badge }) => {
    const props = { className: "w-4 h-4", title: badge.name };
    switch(badge.icon) {
        case 'TopRated': return <TopRatedIcon {...props} />;
        case 'HighlyBooked': return <HighlyBookedIcon {...props} />;
        case 'FastResponder': return <FastResponderIcon {...props} />;
        case 'RisingStar': return <RisingStarIcon {...props} />;
        case 'CommunityPick': return <CommunityPickIcon {...props} />;
        default: return null;
    }
}

// TalentCardSkeleton Component
const TalentCardSkeleton: React.FC = () => (
    <Card className="flex flex-col">
        <SkeletonLoader className="aspect-[4/5] w-full" />
        <div className="p-4 flex flex-col flex-grow">
            <SkeletonLoader className="h-5 w-3/4 mb-2" />
            <SkeletonLoader className="h-4 w-1/2 mb-4" />
            <SkeletonLoader className="h-8 w-full mb-3 flex-grow" />
            <div className="flex flex-wrap gap-2">
                <SkeletonLoader className="h-5 w-16 rounded-full" />
                <SkeletonLoader className="h-5 w-20 rounded-full" />
            </div>
        </div>
    </Card>
);

// TalentCard Component
const TalentCard: React.FC<{ talent: Talent, style?: React.CSSProperties }> = ({ talent, style }) => {
    const navigate = useNavigate();
    const placeholderUrl = 'https://i.ibb.co/pX1sT5C/placeholder.png'; // Static, reliable placeholder

    return (
        <Card isHoverable className="cursor-pointer group animate-slide-up-fade flex flex-col h-full" style={style} onClick={() => navigate(`/talent/${talent.id}`)}>
            <div className="relative aspect-[4/5] overflow-hidden">
                 <LazyImage 
                    src={talent.portfolio[0]?.url || 'https://i.ibb.co/pX1sT5C/placeholder.png'}
                    placeholderSrc={placeholderUrl}
                    alt={talent.user.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.4)_30%,transparent_100%)]"></div>
                 {talent.badges && talent.badges.length > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                        {talent.badges.map(badge => (
                            <div key={badge.id} className="p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-yellow-300" title={badge.description}>
                                <BadgeIcon badge={badge} />
                            </div>
                        ))}
                    </div>
                )}
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                        {talent.user.name}
                        {talent.isCertified && <CertifiedIcon className="w-5 h-5 text-yellow-300" title="Timeless Certified" />}
                    </h3>
                    <p className="text-sm text-white/80">{talent.category} &bull; {talent.city}</p>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                 <p className="text-sm text-day-text-secondary dark:text-night-text-secondary line-clamp-2 h-auto flex-grow">{talent.bio}</p>
                 <div className="mt-3 flex flex-wrap gap-2">
                    {talent.tags.slice(0, 3).map(tag => <Tag key={tag}>{tag}</Tag>)}
                 </div>
            </div>
        </Card>
    );
};


// FilterPanel Component
interface FilterPanelProps {
    filters: any;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    allTalents: Talent[];
}
const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, allTalents }) => {
    const { t } = useContext(LanguageContext);
    const categories = useMemo(() => [...new Set(allTalents.map(t => t.category))], [allTalents]);
    const cities = useMemo(() => [...new Set(allTalents.map(t => t.city))], [allTalents]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <Card className="p-6 h-fit sticky top-28 animate-fade-in">
            <h3 className="text-xl font-serif font-bold">{t('marketplace.filters.title')}</h3>
            <div className="space-y-6 mt-6">
                <Input placeholder={t('marketplace.filters.searchPlaceholder')} value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                <div>
                    <label className="block text-sm font-medium mb-1">{t('marketplace.filters.category')}</label>
                    <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} className="w-full p-2 border border-day-border dark:border-night-border rounded-md bg-day-bg dark:bg-night-bg text-base">
                        <option value="">{t('marketplace.filters.allCategories')}</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">{t('marketplace.filters.city')}</label>
                    <select value={filters.city} onChange={e => handleFilterChange('city', e.target.value)} className="w-full p-2 border border-day-border dark:border-night-border rounded-md bg-day-bg dark:bg-night-bg text-base">
                        <option value="">{t('marketplace.filters.allCities')}</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <Button fullWidth onClick={() => setFilters({ search: '', category: '', city: '', collectiveId: null })}>{t('marketplace.filters.resetButton')}</Button>
            </div>
        </Card>
    );
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// Main MarketplaceScreen Component
interface MarketplaceScreenProps {
    talents: Talent[];
}
const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ talents }) => {
    const [isLoading, setIsLoading] = useState(true);
    const query = useQuery();
    const { t } = useContext(LanguageContext);
    
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        city: '',
        collectiveId: query.get('collectiveId') || null,
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading
        return () => clearTimeout(timer);
    }, []);
    
    const certifiedTalents = useMemo(() => talents.filter(t => t.isCertified), [talents]);
    
    const collectiveName = useMemo(() => {
        if (!filters.collectiveId) return null;
        const member = talents.find(t => t.collectiveId === filters.collectiveId);
        return member?.collectiveName || null;
    }, [filters.collectiveId, talents]);

    const filteredTalents = useMemo(() => {
        return talents.filter(talent => {
            const searchLower = filters.search.toLowerCase();
            const nameMatch = talent.user.name.toLowerCase().includes(searchLower);
            const tagMatch = talent.tags.some(tag => tag.toLowerCase().includes(searchLower));
            const categoryMatch = filters.category ? talent.category === filters.category : true;
            const cityMatch = filters.city ? talent.city === filters.city : true;
            const collectiveMatch = filters.collectiveId ? talent.collectiveId === filters.collectiveId : true;

            return (nameMatch || tagMatch) && categoryMatch && cityMatch && collectiveMatch;
        });
    }, [talents, filters]);

    return (
        <div className="max-w-screen-2xl mx-auto pt-24 pb-12">
            <div className="animate-fade-in">
                {collectiveName ? (
                    <>
                        <p className="text-lg text-day-accent dark:text-night-accent font-semibold">{t('marketplace.collective.viewing')}</p>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8">{collectiveName}</h1>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">{t('marketplace.title')}</h1>
                        <p className="text-lg text-day-text-secondary dark:text-night-text-secondary mb-8">{t('marketplace.subtitle')}</p>
                    </>
                )}
            </div>
            
             {certifiedTalents.length > 0 && !isLoading && !filters.collectiveId && (
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-3xl font-serif font-bold mb-4 flex items-center gap-3"><CertifiedIcon className="w-8 h-8 text-yellow-400" /> Timeless Certified</h2>
                    <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
                        {certifiedTalents.map((talent, index) => (
                            <div key={talent.id} className="w-80 flex-shrink-0">
                                <TalentCard talent={talent} style={{ animationDelay: `${index * 100}ms` }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    {isLoading ? <SkeletonLoader className="h-96" /> : <FilterPanel filters={filters} setFilters={setFilters} allTalents={talents} />}
                </div>
                <div className="lg:col-span-3">
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => <TalentCardSkeleton key={i} />)
                        ) : filteredTalents.length > 0 ? (
                            filteredTalents.map((talent, index) => <TalentCard key={talent.id} talent={talent} style={{ animationDelay: `${index * 50}ms` }} />)
                        ) : (
                            <div className="md:col-span-2 xl:col-span-3">
                                <EmptyState 
                                    title={t('marketplace.emptyState.title')}
                                    description={t('marketplace.emptyState.description')}
                                    action={<Button onClick={() => setFilters({ search: '', category: '', city: '', collectiveId: null })}>{t('marketplace.filters.resetButton')}</Button>}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceScreen;