import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { UserStatus } from '../types';
import { Card } from '../components/ui';

interface UserSelectionScreenProps {
    onLoginSuccess: (user: User) => void;
    allUsers: User[];
    addNotification: (message: string, type: 'success' | 'error') => void;
}

const UserSelectionScreen: React.FC<UserSelectionScreenProps> = ({ onLoginSuccess, allUsers, addNotification }) => {
    const navigate = useNavigate();

    const handleUserSelect = (user: User) => {
        if (user.status === UserStatus.ACTIVE) {
            addNotification(`Logged in as ${user.name}.`, 'success');
            onLoginSuccess(user);
            navigate('/dashboard');
        } else {
            addNotification(`Account is ${user.status.toLowerCase()}. Please wait for an admin to approve it.`, 'error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-day-bg dark:bg-night-bg p-8 pt-32 md:pt-24">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold">Welcome to Timeless</h1>
                <p className="mt-2 text-lg text-day-text-secondary dark:text-night-text-secondary">For testing purposes, please select a user profile to log in.</p>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {allUsers.map(user => (
                        <Card 
                            key={user.id}
                            isHoverable
                            className="p-4 text-center cursor-pointer flex flex-col items-center group"
                            onClick={() => handleUserSelect(user)}
                        >
                            <img src={user.avatar} alt={user.name} className="h-20 w-20 lg:h-24 lg:w-24 rounded-full object-cover border-4 border-day-accent/50 dark:border-night-accent/50 group-hover:border-day-accent dark:group-hover:border-night-accent transition-all" />
                            <h3 className="text-lg font-serif font-bold mt-4">{user.name}</h3>
                            <p className={`mt-1 text-sm font-semibold ${user.status === UserStatus.ACTIVE ? 'text-day-accent dark:text-night-accent' : 'text-day-error dark:text-night-error'}`}>{user.role}</p>
                            <p className="mt-1 text-xs text-day-text-secondary dark:text-night-text-secondary">{user.status}</p>
                        </Card>
                    ))}
                </div>
                 <p className="mt-6 text-center text-sm">
                    Or{' '}
                    <Link to="/login-form" className="font-semibold text-day-accent dark:text-night-accent hover:underline">
                        Sign in with email
                    </Link>
                </p>
                 <p className="mt-10 text-center text-sm">
                    Don't have a profile?{' '}
                    <Link to="/register" className="font-semibold text-day-accent dark:text-night-accent hover:underline">
                        Register Now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UserSelectionScreen;