import React from 'react';

const Card = ({ children, className = '', hover = false, glass = true }) => {
    const baseStyles = 'rounded-xl p-6 transition-all duration-300';
    const glassStyles = glass ? 'glass' : 'bg-white shadow-lg';
    const hoverStyles = hover ? 'card-hover cursor-pointer' : '';

    return (
        <div className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
