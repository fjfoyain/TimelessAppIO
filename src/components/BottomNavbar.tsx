// components/BottomNavbar.tsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import type { User } from '../types';
import { UserRole } from '../types';
import { HomeIcon, MarketplaceIcon, EventsIcon, MessagesIcon, AdminIcon } from './icons';
import { LanguageContext } from '../contexts/LanguageContext';

interface BottomNavbarProps {
    user: User | null;
}

const BottomNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
                isActive
                    ? 'text-day-accent dark:text-night-accent'
                    : 'text-day-text-secondary/80 dark:text-night-text-secondary/80 hover:text-day-text dark:hover:text-night-text'
            }`
        }
    >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
    </NavLink>
);

const BottomNavbar: React.FC<BottomNavbarProps> = ({ user }) => {
    const { t } = useContext(LanguageContext);
    
    if (!user || user.role === UserRole.ADMIN) {
        return null; // Don't show for logged out users or admin
    }

    const navItems = [
        { to: '/dashboard', icon: <HomeIcon className="w-6 h-6" />, label: t('navbar.dashboard') },
        { to: '/marketplace', icon: <MarketplaceIcon className="w-6 h-6" />, label: t('navbar.marketplace') },
        { to: '/events', icon: <EventsIcon className="w-6 h-6" />, label: t('navbar.events') },
        { to: '/messages', icon: <MessagesIcon className="w-6 h-6" />, label: t('navbar.messages') },
    ];
    
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-day-surface/90 dark:bg-night-surface/90 backdrop-blur-lg border-t border-day-border dark:border-night-border z-40">
            <div className="flex items-center justify-around h-full">
                {navItems.map(item => (
                    <BottomNavItem key={item.to} {...item} />
                ))}
            </div>
        </div>
    );
};

export default BottomNavbar;
