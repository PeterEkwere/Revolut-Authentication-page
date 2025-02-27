import { useState } from 'react';

const useValidateEmail = () => {
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!email) {
            setIsValid(false);
            setError('Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            setIsValid(false);
            setError('Invalid email format');
            return false;
        }

        setIsValid(true);
        setError('');
        return true;
    };

    return {
        isValid,
        error,
        validateEmail
    };
};




const useValidatePassword = () => {
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');

    const validatePassword = (password) => {
        if (!password) {
            setIsValid(false);
            setError('Password is required');
            return false;
        }

        if (password.length < 8) {
            setIsValid(false);
            setError('Password must be at least 8 characters');
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            setIsValid(false);
            setError('Password must contain at least one uppercase letter');
            return false;
        }

        if (!/[0-9]/.test(password)) {
            setIsValid(false);
            setError('Password must contain at least one number');
            return false;
        }

        setIsValid(true);
        setError('');
        return true;
    };

    return {
        isValid,
        error,
        validatePassword
    };
};

export { useValidateEmail, useValidatePassword };