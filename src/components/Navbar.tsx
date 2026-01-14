// components/Navbar.tsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import type { User, Notification } from '../types';
import { UserRole } from '../types';
import { Button } from './ui';
import { HomeIcon, MessagesIcon, MarketplaceIcon, EventsIcon, SunIcon, MoonIcon, TicketIcon, WalletIcon, Logo, LanguageIcon, MenuIcon, XIcon, AdminIcon, BellIcon } from './icons';
import { LanguageContext } from '../contexts/LanguageContext';


interface NavbarProps {
    user: User | null;
    onLogout: () => void;
    notifications: Notification[];
    onMarkNotificationRead: (id: number) => void;
}

const NavItem: React.FC<{ to: string, children: React.ReactNode, icon: React.ReactNode, onClick?: () => void }> = ({ to, children, icon, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 text-base md:text-sm ${
                isActive
                    ? 'bg-day-accent/10 text-day-accent dark:bg-night-accent/20 dark:text-night-accent font-bold'
                    : 'hover:bg-day-surface dark:hover:bg-night-surface'
            }`
        }
    >
        {icon}
        <span className="font-semibold">{children}</span>
    </NavLink>
);

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, notifications, onMarkNotificationRead }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);
    const { language, setLanguage, theme, toggleTheme, t } = useContext(LanguageContext);

    const unreadCount = notifications.filter(n => !n.read).length;

    const logoUrl = theme === 'dark' 
        ? 'http://gym360.site/wp-content/uploads/2025/10/LB-scaled.png' // White Logo for Dark Theme
        : 'http://gym360.site/wp-content/uploads/2025/10/LN-scaled.png'; // Black Logo for Light Theme

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) setIsLangMenuOpen(false);
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) setIsNotificationMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    }, [isMobileMenuOpen]);


    const closeAllMenus = () => {
        setIsUserMenuOpen(false);
        setIsLangMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsNotificationMenuOpen(false);
    }

    const renderNavLinks = (isMobile = false) => {
        if (!user) return null;
        const commonLinks = [
            <NavItem key="marketplace" to="/marketplace" icon={<MarketplaceIcon className="w-5 h-5" />} onClick={closeAllMenus}>{t('navbar.marketplace')}</NavItem>,
            <NavItem key="events" to="/events" icon={<EventsIcon className="w-5 h-5" />} onClick={closeAllMenus}>{t('navbar.events')}</NavItem>,
            <NavItem key="resale" to="/tickets/resale" icon={<TicketIcon className="w-5 h-5" />} onClick={closeAllMenus}>{t('navbar.resale')}</NavItem>,
            <NavItem key="messages" to="/messages" icon={<MessagesIcon className="w-5 h-5" />} onClick={closeAllMenus}>{t('navbar.messages')}</NavItem>,
        ];
        
        if (user.role === UserRole.ADMIN) {
             return <NavItem to="/admin" icon={<AdminIcon className="w-5 h-5" />} onClick={closeAllMenus}>{t('navbar.admin')}</NavItem>;
        }
        
        return (
            <>
                <NavItem to="/dashboard" icon={<HomeIcon className="w-5 h-5" />} onClick={closeAllMenus}>{t('navbar.dashboard')}</NavItem>
                {commonLinks}
            </>
        );
    };
    
    const mobileMenuClass = isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full';

    return (
        <header className="fixed top-0 left-0 right-0 z-40">
            <nav className="bg-day-surface/80 dark:bg-night-surface/80 backdrop-blur-lg border-b border-day-border dark:border-night-border shadow-glass mx-auto mt-4 max-w-screen-2xl rounded-xl">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="flex-shrink-0 flex items-center space-x-3" onClick={closeAllMenus}>
                                <Logo src={logoUrl} className="h-8"/>
                                <h1 className="text-3xl font-serif font-bold text-day-text dark:text-night-text hidden sm:block">Timeless</h1>
                            </Link>
                             <div className="hidden md:flex items-center space-x-1">
                               {renderNavLinks()}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                             <div className="relative" ref={langMenuRef}>
                                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 rounded-full hover:bg-day-surface dark:hover:bg-night-surface">
                                    <LanguageIcon className="w-6 h-6" />
                                </button>
                                {isLangMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-32 bg-day-surface/80 dark:bg-night-surface/80 backdrop-blur-xl border border-day-border dark:border-night-border rounded-lg shadow-xl py-1 animate-slide-up-fade">
                                        <button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-day-surface dark:hover:bg-night-surface">English</button>
                                        <button onClick={() => { setLanguage('es'); setIsLangMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-day-surface dark:hover:bg-night-surface">Español</button>
                                    </div>
                                )}
                            </div>
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-day-surface dark:hover:bg-night-surface">
                                {theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6" />}
                            </button>
                             {user && (
                                <div className="relative" ref={notificationMenuRef}>
                                    <button onClick={() => setIsNotificationMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-day-surface dark:hover:bg-night-surface relative">
                                        <BellIcon className="w-6 h-6" />
                                        {unreadCount > 0 && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-day-surface dark:border-night-surface" />}
                                    </button>
                                    {isNotificationMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-day-surface/80 dark:bg-night-surface/80 backdrop-blur-xl border border-day-border dark:border-night-border rounded-lg shadow-xl py-2 animate-slide-up-fade">
                                            <div className="px-4 py-2 font-bold text-lg">Notifications</div>
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <Link key={n.id} to={n.link || '#'} onClick={() => { onMarkNotificationRead(n.id); closeAllMenus(); }}>
                                                        <div className={`p-3 border-l-4 ${n.read ? 'border-transparent' : 'border-day-accent dark:border-night-accent'} hover:bg-day-surface dark:hover:bg-night-surface`}>
                                                            <p className="text-sm">{n.message}</p>
                                                            <p className="text-xs text-day-text-secondary">{new Date(n.timestamp).toLocaleString()}</p>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="p-4 text-center text-sm text-day-text-secondary">No new notifications.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2">
                                        <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover border-2 border-day-accent dark:border-night-accent" />
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-day-surface/80 dark:bg-night-surface/80 backdrop-blur-xl border border-day-border dark:border-night-border rounded-lg shadow-xl py-2 animate-slide-up-fade">
                                            <div className="px-4 py-2 border-b border-day-border dark:border-night-border">
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">{user.role}</p>
                                            </div>
                                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-day-surface dark:hover:bg-night-surface" onClick={closeAllMenus}><HomeIcon className="w-4 h-4" />{t('navbar.dashboard')}</Link>
                                            <Link to="/tickets/wallet" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-day-surface dark:hover:bg-night-surface" onClick={closeAllMenus}><WalletIcon className="w-4 h-4" />{t('navbar.wallet')}</Link>
                                            <button onClick={() => { onLogout(); closeAllMenus(); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-day-error dark:text-night-error hover:bg-day-surface dark:hover:bg-night-surface">
                                                {t('navbar.signOut')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex space-x-2">
                                    <Link to="/login"><Button variant="secondary">{t('navbar.signIn')}</Button></Link>
                                    <Link to="/register"><Button>{t('navbar.joinNow')}</Button></Link>
                                </div>
                            )}
                             <div className="md:hidden">
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full">
                                    {isMobileMenuOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Mobile Menu */}
            <div className={`md:hidden fixed inset-0 bg-day-bg dark:bg-night-bg z-30 transform transition-transform duration-300 ease-in-out ${mobileMenuClass}`}>
                <div className="pt-28 p-6 flex flex-col space-y-4">
                    {user ? renderNavLinks(true) : (
                         <div className="space-y-4">
                            <Link to="/login" onClick={closeAllMenus}><Button fullWidth variant="secondary">{t('navbar.signIn')}</Button></Link>
                            <Link to="/register" onClick={closeAllMenus}><Button fullWidth>{t('navbar.joinNow')}</Button></Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;