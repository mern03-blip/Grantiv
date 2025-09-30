import { useEffect } from 'react';

const useKeydown = (key, callback) => {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === key) {
                callback();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [key, callback]);
};

export default useKeydown;