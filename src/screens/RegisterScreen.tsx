
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import type { User, Talent, Venue, Provider } from '../types';
import { UserStatus, UserRole } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';

interface RegisterScreenProps {
    onRegisterSuccess: (user: User, talentProfile?: Omit<Talent, 'id' | 'userId' | 'user'>, venueProfile?: Omit<Venue, 'id' | 'userId' | 'user'>, providerProfile?: Omit<Provider, 'id' | 'userId' | 'user'>) => boolean;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess }) => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<UserRole | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Talent fields
    const [category, setCategory] = useState('');
    const [city, setCity] = useState('');
    
    // Venue fields
    const [venueName, setVenueName] = useState('');
    const [address, setAddress] = useState('');

    // Provider fields
    const [companyName, setCompanyName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useContext(LanguageContext);

    const handleRoleSelect = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const newUser: User = {
                id: `user-${Date.now()}`,
                name: role === UserRole.PROVIDER ? companyName : name,
                email,
                password,
                role: role!,
                avatar: 'https://i.ibb.co/6839zM1/default-avatar.png',
                status: (role === UserRole.TALENT || role === UserRole.VENUE || role === UserRole.PROVIDER) ? UserStatus.PENDING : UserStatus.ACTIVE
            };
            
            let talentProfile: Omit<Talent, 'id' | 'userId' | 'user'> | undefined;
            if (role === UserRole.TALENT) {
                talentProfile = {
                    category, city, bio: 'Please complete your bio.', tags: [], portfolio: [], reviews: [], servicePlans: [], isVerified: false, hourlyRate: 0, jobsCompleted: 0, responseRate: 0, availability: []
                };
            }

            let venueProfile: Omit<Venue, 'id' | 'userId' | 'user'> | undefined;
            if (role === UserRole.VENUE) {
                venueProfile = { venueName, address, capacity: 0 };
            }

            let providerProfile: Omit<Provider, 'id' | 'userId' | 'user'> | undefined;
            if (role === UserRole.PROVIDER) {
                providerProfile = {
                    companyName: companyName,
                    category: 'Audio & Sound', // Default, customizable later
                    items: [],
                    city: city,
                }
            }

            const success = onRegisterSuccess(newUser, talentProfile, venueProfile, providerProfile);
            setIsLoading(false);
            if (success) {
                if (role === UserRole.TALENT || role === UserRole.VENUE || role === UserRole.PROVIDER) {
                    setStep(3); // Show confirmation for talent/venue/provider
                } else {
                     navigate('/login'); // Redirect client to login
                }
            }
        }, 1000);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="text-center">
                        <h2 className="text-4xl font-serif font-bold">{t('register.step1.title')}</h2>
                        <p className="mt-2 text-day-text-secondary dark:text-night-text-secondary">{t('register.step1.subtitle')}</p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card isHoverable className="p-8 text-center cursor-pointer" onClick={() => handleRoleSelect(UserRole.CLIENT)}>
                                <h3 className="text-2xl font-serif">{t('register.step1.clientTitle')}</h3>
                                <p className="mt-2 text-sm text-day-text-secondary dark:text-night-text-secondary">{t('register.step1.clientDesc')}</p>
                            </Card>
                            <Card isHoverable className="p-8 text-center cursor-pointer" onClick={() => handleRoleSelect(UserRole.TALENT)}>
                                <h3 className="text-2xl font-serif">{t('register.step1.talentTitle')}</h3>
                                <p className="mt-2 text-sm text-day-text-secondary dark:text-night-text-secondary">{t('register.step1.talentDesc')}</p>
                            </Card>
                             <Card isHoverable className="p-8 text-center cursor-pointer" onClick={() => handleRoleSelect(UserRole.VENUE)}>
                                <h3 className="text-2xl font-serif">{t('register.step1.venueTitle')}</h3>
                                <p className="mt-2 text-sm text-day-text-secondary dark:text-night-text-secondary">{t('register.step1.venueDesc')}</p>
                            </Card>
                            <Card isHoverable className="p-8 text-center cursor-pointer" onClick={() => handleRoleSelect(UserRole.PROVIDER)}>
                                <h3 className="text-2xl font-serif">I'm a Provider</h3>
                                <p className="mt-2 text-sm text-day-text-secondary dark:text-night-text-secondary">Offer equipment, decor, or logistics services.</p>
                            </Card>
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div>
                        <h2 className="text-4xl font-serif font-bold text-center">{t('register.step2.title')}</h2>
                        {(role === UserRole.TALENT || role === UserRole.VENUE || role === UserRole.PROVIDER) && <p className="text-center mt-2 text-sm text-day-accent dark:text-night-accent">{t('register.step2.curationNotice')}</p>}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            {role === UserRole.PROVIDER ? (
                                <Input id="companyName" label="Company Name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                            ) : (
                                <Input id="name" label={t('register.step2.nameLabel')} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            )}
                            
                            <Input id="email" label={t('register.step2.emailLabel')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input id="password" label={t('register.step2.passwordLabel')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            
                            {role === UserRole.TALENT && (
                                <>
                                    <Input id="category" label={t('register.step2.categoryLabel')} type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                                    <Input id="city" label={t('register.step2.cityLabel')} type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                                </>
                            )}
                            {role === UserRole.VENUE && (
                                <>
                                    <Input id="venueName" label={t('register.step2.venueNameLabel')} type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} required />
                                    <Input id="address" label={t('register.step2.addressLabel')} type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                </>
                            )}
                            {role === UserRole.PROVIDER && (
                                <Input id="city" label="Base City" type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                            )}
                            <Button type="submit" fullWidth isLoading={isLoading}>{t((role !== UserRole.CLIENT) ? 'register.step2.submitApplication' : 'register.step2.createAccount')}</Button>
                        </form>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center">
                         <h2 className="text-4xl font-serif font-bold">{t('register.step3.title')}</h2>
                         <p className="mt-4 text-day-text-secondary dark:text-night-text-secondary">
                           {t('register.step3.message')}
                         </p>
                         <Button onClick={() => navigate('/login')} className="mt-8">{t('register.step3.button')}</Button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-day-bg dark:bg-night-bg p-8 pt-32 md:pt-24">
            <div className="max-w-5xl w-full">
                {renderStep()}
                <p className="mt-6 text-center text-sm">
                    {t('register.alreadyHaveAccount')}{' '}
                    <button onClick={() => navigate('/login')} className="font-semibold text-day-accent dark:text-night-accent hover:underline">
                        {t('register.signIn')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;
