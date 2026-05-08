import React, { useState } from 'react';
import './HomePage.css';

import HalfTop from './HalfTop.js'

const HomePage = () => {
    const [isBlue, setIsBlue] = useState(false);

    const toggleColor = () => {
        setIsBlue(!isBlue);
    };

    return (
        <div className="cafe-homepage">
            <HalfTop />
        </div>
    );
};

export default HomePage;
