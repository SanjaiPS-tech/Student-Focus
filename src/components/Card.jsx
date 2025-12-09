import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, variant = 'white' }) => {
    const variants = {
        white: 'bg-white',
        yellow: 'bg-app-yellow',
        blue: 'bg-app-blue',
        pink: 'bg-app-pink',
        purple: 'bg-app-purple',
    };

    return (
        <div className={clsx('neo-card p-6', variants[variant], className)}>
            {children}
        </div>
    );
};

export default Card;
