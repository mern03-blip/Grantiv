import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingView from '../components/onboardingview/OnboardingView';
import { Sidebar } from './sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

// Function to get the initial theme from localStorage
const getInitialTheme = () => {
    try {
        const savedTheme = localStorage.getItem('grantiv_theme');
        // If a saved theme exists, return it, otherwise default to 'light'
        return savedTheme || 'light';
    } catch (error) {
        console.error("Failed to load theme from local storage", error);
        return 'light';
    }
};
//   console.log(getInitialTheme());

const MainContent = () => {
    return (
        <div className="flex flex-col flex-grow">
            <Outlet />
        </div>
    );
};

const AdminLayout = () => {
    // Initialize the theme state directly by calling the function
    const [theme, setTheme] = useState(getInitialTheme);
    const [currentView, setCurrentView] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);

    // This useEffect will now only handle saving the theme when it changes
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


    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('grantiv_business_profile');
            const onboardingSkipped = localStorage.getItem('grantiv_onboarding_skipped');

            if (savedProfile) {
                let profileData = JSON.parse(savedProfile);
                if (profileData.location && !profileData.city) {
                    const parts = profileData.location.split(',');
                    profileData.city = parts[0]?.trim() || '';
                    profileData.state = parts[1]?.trim() || '';
                    delete profileData.location;
                }
            } else if (onboardingSkipped === 'true') {
                setIsOnboarding(false);
            } else {
                setIsOnboarding(true);
            }
        } catch (error) {
            console.error("Failed to load data from local storage", error);
        } finally {
            // setIsLoadingProfile(false);
        }
    }, []);

    const handleSaveProfile = useCallback((profile) => {
        try {
            localStorage.setItem('grantiv_business_profile', "false");
            localStorage.removeItem('grantiv_onboarding_skipped');
            if (isOnboarding) {
                setIsOnboarding(false);
            }
            if (currentView === 'settings' || isOnboarding) {
                setCurrentView('dashboard');
            }
        } catch (error) {
            console.error("Failed to save business profile to local storage", error);
            alert("There was an error saving your profile.");
        }
    }, [currentView, isOnboarding]);

    const handleSkipOnboarding = useCallback(() => {
        try {
            localStorage.setItem('grantiv_onboarding_skipped', 'true');
            setIsOnboarding(false);
        } catch (error) {
            console.error("Failed to save onboarding skip status to local storage", error);
            setIsOnboarding(false);
        }
    }, []);

    const navigateTo = useCallback((view) => {
        const validViews = ['dashboard', 'find_grants', 'my_grants', 'ai_assistant', 'settings', 'teams'];
        if (validViews.includes(view)) {
            setCurrentView(view);
        } else {
            console.log(`Maps to ${view} (placeholder)`);
        }
    }, []);

    if (isOnboarding) {
        return <OnboardingView onSave={() => setIsOnboarding(false)} onSkip={handleSkipOnboarding} />;
    }

    return (
        <div className="flex h-screen bg-alabaster dark:bg-dark-background font-sans">
            {currentView !== 'ai_assistant' && (
                <Sidebar
                    currentView={currentView}
                    onNavigate={navigateTo}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
                    theme={theme}
                    setTheme={setTheme}
                />
            )}
            <main className={`flex-1 transition-all duration-300 overflow-y-auto ${currentView === 'ai_assistant' ? 'w-screen h-screen p-0' : 'p-8 bg-[#F7F7F7] dark:bg-dark-background'}`}>
                <div className={currentView === 'ai_assistant' ? 'h-full' : 'max-w-7xl mx-auto'}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }} >

                            <MainContent />

                        </motion.div>
                    </AnimatePresence>
                    {/* <MainContent /> */}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;



