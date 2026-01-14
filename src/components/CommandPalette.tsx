// components/CommandPalette.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Talent } from '../types';
import { MarketplaceIcon, EventsIcon, MessagesIcon, HomeIcon } from './icons';

interface CommandPaletteProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    talents: Talent[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, talents }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const mainActions = [
        { name: 'Go to Dashboard', icon: <HomeIcon className="w-5 h-5"/>, action: () => navigate('/dashboard') },
        { name: 'Browse Marketplace', icon: <MarketplaceIcon className="w-5 h-5"/>, action: () => navigate('/marketplace') },
        { name: 'View Events', icon: <EventsIcon className="w-5 h-5"/>, action: () => navigate('/events') },
        { name: 'Open Messages', icon: <MessagesIcon className="w-5 h-5"/>, action: () => navigate('/messages') },
    ];
    
    const filteredTalents = useMemo(() => {
        if (!search) return [];
        return talents.filter(t => t.user.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, talents]);

    const allItems = search ? filteredTalents : mainActions;

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        } else {
            setSearch('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % allItems.length);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                const selectedItem = allItems[selectedIndex];
                if (selectedItem) {
                    if ('action' in selectedItem) {
                        selectedItem.action();
                    } else {
                        navigate(`/talent/${selectedItem.id}`);
                    }
                    setIsOpen(false);
                }
            }
        };
        
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [isOpen, selectedIndex, allItems, navigate, setIsOpen]);

    if (!isOpen) return null;

    const handleItemClick = (item: any) => {
        if ('action' in item) {
            item.action();
        } else {
            navigate(`/talent/${item.id}`);
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-[15vh]" onClick={() => setIsOpen(false)}>
            <div 
                className="bg-day-bg dark:bg-night-bg w-full max-w-xl rounded-2xl shadow-soft-xl border border-day-border dark:border-night-border transform transition-all duration-300 animate-modal-content-in" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-3 border-b border-day-border dark:border-night-border">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search talents or navigate..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-lg placeholder:text-day-text-secondary/70 focus:outline-none"
                    />
                </div>
                <ul className="max-h-96 overflow-y-auto p-2">
                    <li className="px-2 py-1 text-xs text-day-text-secondary font-semibold uppercase">{search ? 'Talents' : 'Quick Actions'}</li>
                    {allItems.map((item, index) => (
                        <li 
                            key={'name' in item ? item.name : item.id}
                            onClick={() => handleItemClick(item)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-base ${selectedIndex === index ? 'bg-day-accent/20 dark:bg-night-accent/20' : 'hover:bg-day-surface dark:hover:bg-night-surface'}`}
                        >
                            {'icon' in item ? item.icon : <img src={item.user.avatar} className="w-6 h-6 rounded-full" />}
                            <span>{'name' in item ? item.name : item.user.name}</span>
                            {'category' in item && <span className="text-sm text-day-text-secondary">{item.category}</span>}
                        </li>
                    ))}
                    {search && filteredTalents.length === 0 && <li className="p-4 text-center text-day-text-secondary">No talents found for "{search}"</li>}
                </ul>
            </div>
        </div>
    );
};

export default CommandPalette;