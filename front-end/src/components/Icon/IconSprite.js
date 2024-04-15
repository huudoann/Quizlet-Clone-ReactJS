import React from 'react';

const IconSprite = ({ children }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ width: '1px', height: '1px' }}>
            {children}
        </svg>
    );
};

export default IconSprite;