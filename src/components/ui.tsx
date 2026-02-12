
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import type { Notification } from '../types';
import { MessagesIcon } from './icons';

// Spinner Component
export const Spinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Skeleton Loader Component
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-day-surface dark:bg-night-surface/40 rounded-md backdrop-blur-md ${className}`} />
);

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  size?: 'sm' | 'md';
  isLoading?: boolean;
  fullWidth?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading = false, fullWidth = false, className, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-day-accent to-day-accent-hover dark:from-night-accent dark:to-night-accent-hover text-white shadow-lg shadow-day-accent/30 dark:shadow-night-accent/20 hover:shadow-glow hover:-translate-y-0.5',
      secondary: 'bg-day-surface dark:bg-night-surface/50 text-day-text dark:text-night-text border border-day-border dark:border-night-border hover:bg-day-surface/80 dark:hover:bg-night-surface/80 backdrop-blur-sm',
      glass: 'bg-white/10 dark:bg-white/5 text-day-text dark:text-night-text border border-white/20 hover:bg-white/20 backdrop-blur-md shadow-glass',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
    };
    
    const sizeClasses = {
        sm: 'py-1.5 px-3 text-sm',
        md: 'py-3 px-6 text-base',
    };
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button ref={ref} className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`} disabled={isLoading} {...props}>
        {/* Button shine effect */}
        {variant === 'primary' && <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />}
        {isLoading ? <Spinner /> : <span className="relative z-10 flex items-center gap-2">{children}</span>}
      </button>
    );
  }
);

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  isHoverable?: boolean;
}
export const Card: React.FC<CardProps> = ({ children, as: Component = 'div', className = '', isHoverable = false, ...props }) => {
  // Glassmorphism 2.0 Style
  const baseClasses = `
    bg-day-surface/80 dark:bg-night-surface/40 
    backdrop-blur-xl 
    border border-white/20 dark:border-white/10 
    rounded-2xl 
    shadow-glass 
    transition-all duration-500
    relative overflow-hidden
  `;
  
  // Glow effect on hover for dark mode
  const hoverClasses = isHoverable ? `
    hover:shadow-glass-hover 
    hover:-translate-y-1 
    hover:border-day-accent/30 dark:hover:border-night-accent/30
    after:absolute after:inset-0 after:bg-gradient-to-t after:from-day-accent/5 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none
  ` : '';
  
  return <Component className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>{children}</Component>;
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-semibold text-day-text-secondary dark:text-night-text-secondary mb-1.5">{label}</label>}
    <div className="relative group">
        <input
        id={id}
        ref={ref}
        className="w-full px-4 py-3 bg-day-surface/50 dark:bg-night-surface/30 border border-day-border dark:border-night-border rounded-xl focus:outline-none focus:ring-2 focus:ring-day-accent/50 dark:focus:ring-night-accent/50 focus:border-day-accent dark:focus:border-night-accent transition-all duration-300 placeholder:text-day-text-secondary/50 dark:placeholder:text-night-text-secondary/50 text-base text-black backdrop-blur-sm shadow-inner-light"
        {...props}
        />
        {/* Subtle bottom glow on focus */}
        <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-day-accent dark:via-night-accent to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
    </div>
  </div>
));

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string; // e.g., 'max-w-lg', 'max-w-4xl'
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`bg-day-surface dark:bg-[#1E293B]/95 backdrop-blur-2xl w-full ${maxWidth} rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 animate-modal-pop relative overflow-hidden flex flex-col max-h-[90vh]`} onClick={(e) => e.stopPropagation()}>
                {/* Decorative background blob */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-day-accent/10 dark:bg-night-accent/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-center mb-6 relative z-10 flex-shrink-0">
                    <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-day-text to-day-text-secondary dark:from-white dark:to-gray-400">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">&times;</button>
                </div>
                <div className="relative z-10 flex-grow overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

// Tag Component
export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center bg-day-accent/10 text-day-accent-hover dark:bg-night-accent/10 dark:text-night-accent rounded-full px-3 py-1 text-xs font-bold border border-day-accent/20 dark:border-night-accent/20 shadow-sm uppercase tracking-wider">
    {children}
  </span>
);

// Toast Component
interface ToastProps {
  notification: Notification;
  onDismiss: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            const exitTimer = setTimeout(() => onDismiss(notification.id), 500); 
            return () => clearTimeout(exitTimer);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(notification.id), 500);
    };

    const typeStyles = {
        success: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
        message: 'bg-day-accent/10 border-day-accent/30 text-day-accent dark:text-night-accent',
    };

    const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

    return (
        <div className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-xl shadow-lg backdrop-blur-xl border ${typeStyles[notification.type]} ${animationClass} transition-all duration-500 relative overflow-hidden`} role="alert">
            <div className="ml-2 text-sm font-semibold">{notification.message}</div>
            <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-transparent p-1.5 inline-flex h-8 w-8 hover:opacity-70" onClick={handleDismiss}>
                &times;
            </button>
        </div>
    );
};

// Toast Container
export const ToastContainer: React.FC<{ notifications: Notification[]; dismissNotification: (id: number) => void; }> = ({ notifications, dismissNotification }) => (
    <div className="fixed top-24 right-5 z-[100] flex flex-col gap-2">
        {notifications.map(notification => (
            <Toast key={notification.id} notification={notification} onDismiss={dismissNotification} />
        ))}
    </div>
);

// LazyImage with Blur-Up effect
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    placeholderSrc: string;
}
export const LazyImage: React.FC<LazyImageProps> = ({ src, placeholderSrc, className, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    const baseClasses = "absolute inset-0 w-full h-full object-cover transition-all duration-700";

    return (
        <div className={`relative w-full h-full overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
            <img 
                src={placeholderSrc}
                className={`${baseClasses} filter blur-xl scale-110 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
                {...props}
            />
            <img 
                src={src}
                onLoad={() => setIsLoaded(true)}
                className={`${baseClasses} ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                {...props}
            />
        </div>
    );
};

// EmptyState Component
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
    <Card className="p-12 text-center flex flex-col items-center border-dashed border-2 border-day-border dark:border-night-border bg-transparent shadow-none">
        <div className="w-20 h-20 mx-auto text-day-text-secondary/30 dark:text-night-text-secondary/30 mb-6">
            {icon || <MessagesIcon />}
        </div>
        <h3 className="text-xl font-bold font-serif">{title}</h3>
        <p className="mt-2 text-day-text-secondary dark:text-night-text-secondary max-w-xs mx-auto">{description}</p>
        {action && <div className="mt-8">{action}</div>}
    </Card>
);
