// screens/NotFoundScreen.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const NotFoundScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 bg-day-bg dark:bg-night-bg">
      <div className="relative z-10 animate-fade-in">
        <h1 className="text-8xl md:text-9xl font-black text-day-accent dark:text-night-accent opacity-50">404</h1>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mt-[-2rem] md:mt-[-3rem]">Page Not Found</h2>
        <p className="mt-4 max-w-md mx-auto text-lg text-day-text-secondary dark:text-night-text-secondary">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className="mt-10">
          <Link to="/">
            <Button size="md">Go Back Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundScreen;
