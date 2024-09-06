import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

const TransitionContextProvider = ({ children }) => {
    
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsShowing(true);
        }, 500);
    }, []);

    return (
        <Transition
            show={isShowing}
            enter="transform transition duration-200 ease-in-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            {children}
        </Transition>
    );
};

export default TransitionContextProvider;