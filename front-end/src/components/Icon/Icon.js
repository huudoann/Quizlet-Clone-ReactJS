import React from 'react';

const Icon = ({ name, className }) => (
    <svg className={className} style={{ marginRight: '1rem' }}>
        <use xlinkHref={`#${name}`} />
    </svg>
);

export default Icon;