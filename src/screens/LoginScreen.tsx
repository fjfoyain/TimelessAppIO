// screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import type { User } from '../types';
import { UserStatus } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';
import { Logo } from '../components/icons';

interface LoginScreenProps {
    onLoginSuccess: (user: User) => void;
    allUsers: User[];
    addNotification: (message: string, type: 'success' | 'error') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, allUsers, addNotification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { theme, t } = useContext(LanguageContext);

    const logoUrl = theme === 'dark' 
        ? 'http://gym360.site/wp-content/uploads/2025/10/LB-scaled.png'
        : 'http://gym360.site/wp-content/uploads/2025/10/LN-scaled.png';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            // Using a mock password check for demonstration purposes
            if (user && password === (user.password || 'password')) {
                if (user.status === UserStatus.ACTIVE) {
                    addNotification(`Welcome back, ${user.name}.`, 'success');
                    onLoginSuccess(user);
                    navigate('/dashboard');
                } else {
                    addNotification(`Your account is currently ${user.status}. Please contact support.`, 'error');
                }
            } else {
                addNotification('Invalid email or password.', 'error');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-night-bg">
            <div className="relative w-full h-screen grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-full hidden lg:block">
                     <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover filter grayscale"
                        poster="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"
                    >
                        <source src="https://videos.pexels.com/video-files/853829/853829-hd_1920_1080_25fps.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="flex flex-col items-center justify-center p-8 bg-day-bg dark:bg-night-bg">
                    <div className="w-full max-w-md">
                        <Link to="/" className="flex items-center justify-center mb-8 space-x-3">
                            <Logo src={logoUrl} className="h-10"/>
                            <h1 className="text-4xl font-serif font-bold text-day-text dark:text-night-text">Timeless</h1>
                        </Link>
                        
                        <h2 className="text-4xl font-serif font-bold text-day-text dark:text-night-text text-center">Welcome Back</h2>
                        <p className="mt-2 text-day-text-secondary dark:text-night-text-secondary text-center">Sign in to continue your journey.</p>
                        
                        <form onSubmit={handleLogin} className="mt-10 space-y-6 text-left">
                            <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"/>
                            <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"/>
                            <div className="text-right">
                                <a href="#" className="text-sm font-semibold text-day-accent dark:text-night-accent hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <Button type="submit" fullWidth isLoading={isLoading}>Sign In</Button>
                        </form>

                        <p className="mt-8 text-center text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-day-accent dark:text-night-accent hover:underline">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;