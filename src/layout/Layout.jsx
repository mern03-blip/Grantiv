import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingView from "../components/onboardingview/OnboardingView";
import { Sidebar } from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { DarkLogo, SidebarLogo } from "../assets/image";

// Function to get the initial theme from localStorage
const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("grantiv_theme");
    // If a saved theme exists, return it, otherwise default to 'light'
    return savedTheme || "light";
  } catch (error) {
    console.error("Failed to load theme from local storage", error);
    return "light";
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
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // This useEffect will now only handle saving the theme when it changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("grantiv_theme", theme);
    } catch (error) {
      console.error("Failed to save theme to local storage", error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("grantiv_business_profile");
      const onboardingSkipped = localStorage.getItem(
        "grantiv_onboarding_skipped"
      );

      if (savedProfile) {
        let profileData = JSON.parse(savedProfile);
        if (profileData.location && !profileData.city) {
          const parts = profileData.location.split(",");
          profileData.city = parts[0]?.trim() || "";
          profileData.state = parts[1]?.trim() || "";
          delete profileData.location;
        }
      } else if (onboardingSkipped === "true") {
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

  const handleSkipOnboarding = useCallback(() => {
    try {
      localStorage.setItem("grantiv_onboarding_skipped", "true");
      setIsOnboarding(false);
    } catch (error) {
      console.error(
        "Failed to save onboarding skip status to local storage",
        error
      );
      setIsOnboarding(false);
    }
  }, []);

  const navigateTo = useCallback((view) => {
    const validViews = [
      "dashboard",
      "find_grants",
      "my_grants",
      "ai_assistant",
      "settings",
      "teams",
    ];
    if (validViews.includes(view)) {
      setCurrentView(view);
    } else {
      console.log(`Maps to ${view} (placeholder)`);
    }
  }, []);

  if (isOnboarding) {
    return (
      <OnboardingView
        onSave={() => setIsOnboarding(false)}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  // return (
  //     <div className="flex h-screen bg-alabaster dark:bg-dark-background font-sans">
  //         {currentView !== 'ai_assistant' && (
  //             <Sidebar
  //                 currentView={currentView}
  //                 onNavigate={navigateTo}
  //                 isCollapsed={isSidebarCollapsed}
  //                 onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
  //                 theme={theme}
  //                 setTheme={setTheme}
  //             />
  //         )}
  //         <main className={`flex-1 transition-all duration-300 overflow-y-auto no-scrollbar ${currentView === 'ai_assistant' ? 'w-screen h-screen p-0' : 'p-8 bg-[#F7F7F7] dark:bg-dark-background'}`}>
  //             <div className={currentView === 'ai_assistant' ? 'h-full' : 'max-w-7xl mx-auto'}>
  //                 <AnimatePresence mode="wait">
  //                     <motion.div
  //                         key={currentView}
  //                         initial={{ opacity: 0, y: 15 }}
  //                         animate={{ opacity: 1, y: 0 }}
  //                         exit={{ opacity: 0, y: -15 }}
  //                         transition={{ duration: 0.25 }} >

  //                         <MainContent />

  //                     </motion.div>
  //                 </AnimatePresence>
  //                 {/* <MainContent /> */}
  //             </div>
  //         </main>
  //     </div>
  // );
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-alabaster dark:bg-dark-background font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-surface shadow-md border-b border-mercury dark:border-dark-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Hamburger/Close Menu Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-surface/50 transition-colors"
            aria-label={isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isMobileSidebarOpen ? (
              <svg
                className="w-6 h-6 text-night dark:text-dark-textMuted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-night dark:text-dark-textMuted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center flex-1">
            <img
              src={SidebarLogo}
              alt="Grantiv Logo"
              className="h-9 sm:h-8 w-auto max-w-[120px] sm:max-w-[140px] object-contain block dark:hidden"
            />
            <img
              src={DarkLogo}
              alt="Grantiv Dark Logo"
              className="h-9 sm:h-8 w-auto max-w-[120px] sm:max-w-[140px] object-contain hidden dark:block"
            />
          </div>

          {/* Empty div for balance */}
          <div className="w-10"></div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          navigateTo(view);
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        theme={theme}
        setTheme={setTheme}
      />
      <main
        className={`flex-1 transition-all duration-300 overflow-y-auto no-scrollbar 
                    ${
                      currentView === "ai_assistant"
                        ? "pt-20 md:pt-20 lg:pt-0"
                        : "p-4  pt-20 lg:pt-4 lg:p-4 xl:p-6 2xl:p-8 bg-[#F7F7F7] dark:bg-dark-background"
                    }`}
      >
        <div className="w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <MainContent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
