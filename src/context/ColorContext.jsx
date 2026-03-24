import React, { createContext, useState, useEffect } from 'react';

const ColorContext = createContext(undefined);

const ColorProvider = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState('#160a70'); // Default garuda-primary
    const [secondaryColor, setSecondaryColor] = useState('#FEC200'); // Default garuda-secondary

    useEffect(() => {
        const storedPrimaryColor = localStorage.getItem('primaryColor');
        const storedSecondaryColor = localStorage.getItem('secondaryColor');

        if (storedPrimaryColor) {
            setPrimaryColor(storedPrimaryColor);
            document.documentElement.style.setProperty('--primary-500', storedPrimaryColor);
        } else {
            document.documentElement.style.setProperty('--primary-500', '#160a70');
        }
        
        if (storedSecondaryColor) {
            setSecondaryColor(storedSecondaryColor);
            document.documentElement.style.setProperty('--secondary-500', storedSecondaryColor);
        } else {
             document.documentElement.style.setProperty('--secondary-500', '#FEC200');
        }
    }, []);

    const updateColors = (newPrimaryColor, newSecondaryColor) => {
        setPrimaryColor(newPrimaryColor);
        setSecondaryColor(newSecondaryColor);

        localStorage.setItem('primaryColor', newPrimaryColor);
        localStorage.setItem('secondaryColor', newSecondaryColor);

        document.documentElement.style.setProperty('--primary-500', newPrimaryColor);
        document.documentElement.style.setProperty('--secondary-500', newSecondaryColor);
    };

    return (
        <ColorContext.Provider value={{ primaryColor, secondaryColor, updateColors }}>
            {children}
        </ColorContext.Provider>
    );
};

export { ColorContext, ColorProvider };
