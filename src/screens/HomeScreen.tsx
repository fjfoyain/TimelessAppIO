// screens/HomeScreen.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Logo } from '../components/icons';
import { LanguageContext } from '../contexts/LanguageContext';

// Custom hook for intersection observer
const useIntersectionObserver = (options: IntersectionObserverInit): [React.Dispatch<React.SetStateAction<HTMLElement | null>>, IntersectionObserverEntry | null] => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const [node, setNode] = useState<HTMLElement | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setEntry(entry);
                // Disconnect after intersecting to animate only once
                if (observer.current) observer.current.disconnect();
            }
        }, options);

        const { current: currentObserver } = observer;
        if (node) currentObserver.observe(node);

        return () => {
            if (currentObserver) currentObserver.disconnect();
        };
    }, [node, options]);

    return [setNode, entry];
};


const FeatureCard: React.FC<{ title: string; description: string; image: string; reverse?: boolean }> = ({ title, description, image, reverse = false }) => {
    const [setNode, entry] = useIntersectionObserver({ threshold: 0.2 });
    const isVisible = entry?.isIntersecting;

    return (
        <div 
            ref={setNode}
            className={`flex flex-col md:flex-row items-center gap-12 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${reverse ? 'md:flex-row-reverse' : ''}`}
        >
            <div className="md:w-1/2">
                <h3 className="text-4xl font-serif font-bold text-day-text dark:text-night-text">{title}</h3>
                <p className="mt-4 text-lg text-day-text-secondary dark:text-night-text-secondary max-w-prose">{description}</p>
            </div>
            <div className="md:w-1/2">
                <img src={image} alt={title} className="rounded-2xl shadow-soft-xl w-full h-auto object-cover" />
            </div>
        </div>
    );
};

const HomeScreen: React.FC = () => {
    const { theme, t } = useContext(LanguageContext);

    const logoUrl = theme === 'dark' 
        ? 'http://gym360.site/wp-content/uploads/2025/10/LB-scaled.png' // White Logo for Dark Theme
        : 'http://gym360.site/wp-content/uploads/2025/10/LN-scaled.png'; // Black Logo for Light Theme

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=2"
                        alt="Exclusive event background"
                        className="w-full h-full object-cover filter blur-sm"
                    />
                    <div className="absolute inset-0" style={{backgroundColor: 'rgba(59, 101, 119, 0.85)'}}></div>
                </div>

                <div className="relative z-10">
                    <img src={logoUrl} alt="Timeless Logo" className="h-16 mx-auto mb-4 animate-fade-in" />

                    <h1 className="text-6xl md:text-8xl font-serif font-bold animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
                        {t('home.heroTitle')}
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-xl md:text-2xl text-white/80 animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
                        {t('home.heroSubtitle')}
                    </p>
                    <div className="mt-10 space-x-4 animate-slide-up-fade" style={{ animationDelay: '500ms' }}>
                        <Link to="/marketplace">
                            <Button size="md">{t('home.exploreButton')}</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="glass" size="md">{t('home.joinButton')}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 max-w-6xl mx-auto space-y-24">
                <FeatureCard
                    title={t('home.feature1Title')}
                    description={t('home.feature1Desc')}
                    image="https://images.pexels.com/photos/3290068/pexels-photo-3290068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                />
                <FeatureCard
                    title={t('home.feature2Title')}
                    description={t('home.feature2Desc')}
                    image="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    reverse
                />
                 <FeatureCard
                    title={t('home.feature3Title')}
                    description={t('home.feature3Desc')}
                    image="https://images.pexels.com/photos/2747600/pexels-photo-2747600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                />
            </section>

            {/* CTA Section */}
            <section className="py-20 text-center bg-day-surface dark:bg-night-surface">
                 <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl font-serif font-bold">{t('home.ctaTitle')}</h2>
                    <p className="mt-4 text-xl text-day-text-secondary dark:text-night-text-secondary">
                        {t('home.ctaSubtitle')}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/register">
                             <Button size="md">{t('home.ctaClientButton')}</Button>
                        </Link>
                         <Link to="/register">
                            <Button size="md" variant="secondary">{t('home.ctaTalentButton')}</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;