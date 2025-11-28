import React, { useState, useEffect, useCallback } from 'react';
import {
    CheckCircleIcon, SunIcon, MoonIcon, BellIcon, CheckIcon, UserCircleIcon, CreditCardIcon, SwatchIcon, ReceiptIcon,
} from '../../components/icons/Icons';
import BusinessProfileForm from '../../components/businessprofileform/BusinessProfileForm';
import { handleBusinessForm } from '../../api/endpoints/businessform';
import { useQuery } from '@tanstack/react-query';

// Mock types for a self-contained component

const MOCK_BUSINESS_PROFILE = {
    id: '1',
    companyName: 'Grantiv Inc.',
};

// const MOCK_USER_PLAN = 'Pro';


const saveProfileToLocalStorage = (profile) => {
    try {
        localStorage.setItem('grantiv_business_profile', JSON.stringify(profile));
    } catch (error) {
        console.error("Failed to save profile to local storage", error);
    }
};


const getProfileFromLocalStorage = () => {
    try {
        const savedProfile = localStorage.getItem('grantiv_business_profile');
        return savedProfile ? JSON.parse(savedProfile) : null;
    } catch (error) {
        console.error("Failed to load profile from local storage", error);
        return null;
    }
};


const getThemeFromLocalStorage = () => {
    try {
        const savedTheme = localStorage.getItem('grantiv_theme');
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
    } catch (error) {
        return 'light';
    }
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Profile');
    const [profile, setProfile] = useState(MOCK_BUSINESS_PROFILE);
    const [plan, setPlan] = useState("");
    const [isDemoMode, setIsDemoMode] = useState(true);
    const [theme, setTheme] = useState(getThemeFromLocalStorage());



    // Effect to load initial state from local storage on mount
    useEffect(() => {
        setProfile(getProfileFromLocalStorage() || MOCK_BUSINESS_PROFILE);
        setTheme(getThemeFromLocalStorage());
        try {
            const savedPlan = /** @type {UserPlan} */ (localStorage.getItem('grantiv_user_plan'));
            if (savedPlan) setPlan(savedPlan);
            const savedDemoMode = localStorage.getItem('grantiv_demo_mode');
            if (savedDemoMode) setIsDemoMode(JSON.parse(savedDemoMode));
        } catch (error) {
            console.error("Failed to load settings from local storage", error);
        }
    }, []);

    // Effect to sync theme with document and local storage
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('grantiv_theme', theme);
        } catch (error) {
            console.error("Failed to save theme to local storage", error);
        }
    }, [theme]);

    // Handlers
    const handleSaveProfile = useCallback((newProfile) => {
        setProfile(newProfile);
        saveProfileToLocalStorage(newProfile);
    }, []);

    const handleSetPlan = useCallback((newPlan) => {
        setPlan(newPlan);
        try {
            localStorage.setItem('grantiv_user_plan', newPlan);
        } catch (error) {
            console.error("Failed to save plan to local storage", error);
        }
    }, []);

    const handleToggleDemoMode = useCallback(() => {
        setIsDemoMode(prev => {
            const newMode = !prev;
            try {
                localStorage.setItem('grantiv_demo_mode', JSON.stringify(newMode));
            } catch (error) {
                console.error("Failed to save demo mode to local storage", error);
            }
            return newMode;
        });
    }, []);

    const { data } = useQuery({
        queryKey: ["businessProfile"],
        queryFn: handleBusinessForm,
    });

    console.log(data);


    const renderContent = () => {
        switch (activeTab) {
            case 'Profile':
                return (
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-1">Business Profile</h3>
                        <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-4 sm:mb-6">This information helps our AI match you with the right grants.</p>
                        <BusinessProfileForm initialProfile={profile || undefined} onSave={handleSaveProfile} buttonText={profile ? "Save Changes" : "Save Profile"} Data={data} />
                    </div>
                );
            case 'Appearance':
                return (
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">Appearance</h3>
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <h4 className="text-sm sm:text-base font-semibold text-night dark:text-dark-text mb-2">Theme</h4>
                                <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-3 sm:mb-4">Choose how Grantiv looks. Select a theme or sync with your system.</p>
                                <div className="flex gap-3 sm:gap-4">
                                    <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg border-2 ${theme === 'light' ? 'border-primary' : 'border-transparent'}`}>
                                        <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-md bg-white border border-mercury flex items-center justify-center"><SunIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" /></div>
                                        <span className="text-xs sm:text-sm font-medium text-night dark:text-dark-text">Light</span>
                                    </button>
                                    <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg border-2 ${theme === 'dark' ? 'border-primary' : 'border-transparent'}`}>
                                        <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-md bg-night border border-dark-border flex items-center justify-center"><MoonIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" /></div>
                                        <span className="text-xs sm:text-sm font-medium text-night dark:text-dark-text">Dark</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Subscription':
                const PlanCard = ({ name, price, description, features, isCurrent, isPopular, onSelect }) => {
                    const buttonText = isCurrent ? 'Current Plan' : (price === 'Contact Us' ? 'Contact Us' : 'Upgrade');
                    return (
                        <div className={`border-2 rounded-lg p-3 sm:p-4 flex flex-col relative h-full w-[100%] ${isCurrent ? 'border-primary' : 'border-mercury/50 dark:border-dark-border'}`}>
                            {isPopular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-secondary text-night text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">MOST POPULAR</div>}
                            <h4 className="text-base sm:text-lg font-bold font-heading text-night dark:text-dark-text">{name}</h4>
                            <p className="text-2xl sm:text-3xl font-bold font-heading text-night dark:text-dark-text my-1.5 sm:my-2">{price}<span className="text-xs sm:text-sm font-sans text-night/50 dark:text-dark-textMuted">/month</span></p>
                            <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-3 sm:mb-4 flex-grow">{description}</p>
                            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-4 sm:mb-6">
                                {features.map(f => <li key={f} className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-primary" /> <span className="text-night dark:text-dark-text">{f}</span></li>)}
                            </ul>
                            <button onClick={onSelect} disabled={isCurrent || price === 'Contact Us'} className={`w-full mt-auto py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg font-semibold transition-colors ${isCurrent ? 'bg-mercury/50 dark:bg-dark-border text-night/50 dark:text-dark-textMuted cursor-default' : 'bg-primary text-night hover:bg-secondary disabled:opacity-70'}`}>
                                {buttonText}
                            </button>
                        </div>
                    );
                };
                return (
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">Subscription & Billing</h3>

                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700/50 rounded-lg text-yellow-800 dark:text-yellow-200">
                            <h4 className="text-sm sm:text-base font-bold">Developer Controls</h4>
                            <p className="text-xs sm:text-sm mb-2">Use these controls to test different application states.</p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                                <div className="w-full sm:w-auto">
                                    <span className="text-xs sm:text-sm font-semibold mr-2">Current Plan:</span>
                                    <div className="inline-flex flex-wrap gap-2 mt-1 sm:mt-0">
                                        {(['Starter', 'Pro', 'Enterprise']).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => handleSetPlan(p)}
                                                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md font-semibold ${plan === p ? 'bg-primary text-night' : 'bg-white/50 dark:bg-dark-border'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="demo-toggle" className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" id="demo-toggle" className="sr-only" checked={isDemoMode} onChange={handleToggleDemoMode} />
                                            <div className={`block w-14 h-8 rounded-full transition-colors ${isDemoMode ? 'bg-secondary' : 'bg-mercury dark:bg-dark-border'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isDemoMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <div className="ml-3 font-medium">
                                            Demo Mode: <span className="font-bold">{isDemoMode ? 'ON' : 'OFF'}</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                                <div className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border p-4 sm:p-5 md:p-6 rounded-lg">
                                    <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-1">Current Plan</h4>
                                    <p className="text-xl sm:text-2xl font-bold font-heading text-secondary dark:text-dark-secondary">{plan} Plan</p>
                                    <ul className="text-[10px] sm:text-xs space-y-1 my-3 sm:my-4 text-night/70 dark:text-dark-textMuted">
                                        <li className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-primary" /> Unlimited Grant Matches</li>
                                        <li className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-primary" /> Advanced AI Assistance</li>
                                        <li className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-primary" /> Team Collaboration</li>
                                    </ul>
                                    <div className="space-y-2">
                                        <button className="w-full text-center text-sm font-bold text-night bg-primary rounded-md py-2.5 transition-all duration-300 hover:bg-secondary">Change Plan</button>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border p-4 sm:p-5 md:p-6 rounded-lg">
                                    <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-2 sm:mb-3 flex items-center gap-2"><ReceiptIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Billing History</h4>
                                    <p className="text-xs sm:text-sm text-night/50 dark:text-dark-textMuted">Your invoices will appear here.</p>
                                </div>
                                <div className="bg-white dark:bg-dark-surface border-2 border-red-500/50 dark:border-red-500/30 p-4 sm:p-5 md:p-6 rounded-lg">
                                    <h4 className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 mb-2">Cancel Subscription</h4>
                                    <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-3">This action will downgrade your plan to &apos;Starter&apos; at the end of your billing cycle.</p>
                                    <button className="w-full text-center text-sm font-bold text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-md py-2 transition-all duration-300 hover:bg-red-200 dark:hover:bg-red-900/50">Request Cancellation</button>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-3">Compare Plans</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                    <PlanCard name="Starter" price="$29" description="For individuals and small teams getting started." features={["5 Grant Matches/Month", "Standard AI Assistance", "1 User Seat"]} onSelect={() => handleSetPlan('Starter')} isCurrent={plan === 'Starter'} />
                                    <PlanCard name="Pro" price="$79" description="For growing teams that need more power and collaboration." features={["Unlimited Grant Matches", "Advanced AI Assistance", "5 User Seats", "Team Collaboration"]} isPopular onSelect={() => handleSetPlan('Pro')} isCurrent={plan === 'Pro'} />
                                    <PlanCard name="Enterprise" price="Contact Us" description="Custom solutions for large organizations needing advanced collaboration and support." features={["Everything in Pro", "Dedicated Team Chat", "Advanced Task Assignment", "Priority Support"]} onSelect={() => { }} isCurrent={plan === 'Enterprise'} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Notifications':
                const Toggle = ({ label, description, checked, onChange }) => (
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4 py-3 sm:py-4 border-b border-mercury/30 dark:border-dark-border/50">
                        <div className="flex-1">
                            <p className="text-sm sm:text-base font-semibold text-night dark:text-dark-text">{label}</p>
                            <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mt-0.5 sm:mt-0">{description}</p>
                        </div>
                        <button
                            role="switch"
                            aria-checked={checked}
                            onClick={onChange}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-mercury dark:bg-dark-border'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                );
                return (
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">Notification Settings</h3>
                        <div className="max-w-2xl">
                            <Toggle label="New Grant Matches" description="Get notified when our AI finds a grant that fits your profile." checked={true} onChange={() => { }} />
                            <Toggle label="Deadline Reminders" description="Receive alerts for applications that are nearing their deadline." checked={true} onChange={() => { }} />
                            <Toggle label="Product Updates" description="Stay in the loop with new features and announcements." checked={false} onChange={() => { }} />
                        </div>
                    </div>
                );
        }
    };

    const settingsNavItems = [
        { id: 'Profile', label: 'Business Profile', icon: <UserCircleIcon className="w-5 h-5" /> },
        { id: 'Appearance', label: 'Appearance', icon: <SwatchIcon className="w-5 h-5" /> },
        { id: 'Subscription', label: 'Subscription', icon: <CreditCardIcon className="w-5 h-5" /> },
        { id: 'Notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
    ];

    return (
        <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">Settings</h2>
            <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">Manage your profile, subscription, and preferences.</p>
            {!profile && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-200 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base font-semibold">Your profile is not yet complete.</p>
                    <p className="text-xs sm:text-sm">Please fill out your business profile to unlock the full power of Grantiv&apos;s AI matching and get personalized assistance.</p>
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
                <aside className="w-full md:w-56 flex-shrink-0">
                    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
                        {settingsNavItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                disabled={!profile && item.id !== 'Profile'}
                                className={`flex items-center justify-center md:justify-start w-auto md:w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors whitespace-nowrap ${activeTab === item.id ? 'bg-primary text-night font-semibold' : 'text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label={`Maps to ${item.label} settings`}
                            >
                                <span className="md:hidden">{item.icon}</span>
                                <span className="hidden md:flex items-center">{item.icon}<span className="ml-3">{item.label}</span></span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 md:p-8 rounded-lg border border-mercury dark:border-dark-border flex-1 w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;