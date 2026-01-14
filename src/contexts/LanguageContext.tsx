

import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../translations';

type Language = 'en' | 'es';
type Theme = 'light' | 'dark';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    theme: Theme;
    toggleTheme: () => void;
    t: (key: string, variables?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
    theme: 'dark',
    toggleTheme: () => {},
    t: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.body.style.backgroundImage = theme === 'dark' 
            ? 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(190, 154, 99, 0.1), transparent 40%)'
            : 'radial-gradient(circle at top right, rgba(190, 154, 99, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(212, 175, 55, 0.1), transparent 40%)';
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    
    const t = (key: string, variables?: Record<string, string | number>): string => {
        const keys = key.split('.');
        let result: any = translations[language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                // Fallback to English if translation is missing
                let fallbackResult: any = translations['en'];
                for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                }
                result = fallbackResult;
                break;
            }
        }

        if (typeof result !== 'string') {
            return key;
        }

        let translatedString: string = result;
        if (variables) {
            for (const [varKey, varValue] of Object.entries(variables)) {
                // Handles {var}
                translatedString = translatedString.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varValue));
                // Handles ${var}
                translatedString = translatedString.replace(new RegExp(`\\$\\{${varKey}\\}`, 'g'), String(varValue));
            }
        }
        return translatedString;
    }


    const value = {
        language,
        setLanguage: (lang: Language) => {
            setLanguage(lang);
        },
        theme,
        toggleTheme,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
