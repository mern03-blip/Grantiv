import React, { useState, useEffect, useCallback } from "react";
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  UserCircleIcon,
  CreditCardIcon,
  SwatchIcon,
} from "../../components/icons/Icons";
import BusinessProfileForm from "../../components/businessprofileform/BusinessProfileForm";
import { handleBusinessForm } from "../../api/endpoints/businessform";
import { useQuery } from "@tanstack/react-query";
import Billing from "./components/Billing";
import Notification from "./components/Notification";

// Mock types for a self-contained component
const MOCK_BUSINESS_PROFILE = {
  id: "1",
  companyName: "Grantiv Inc.",
};

const saveProfileToLocalStorage = (profile) => {
  try {
    localStorage.setItem("grantiv_business_profile", JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save profile to local storage", error);
  }
};

const getProfileFromLocalStorage = () => {
  try {
    const savedProfile = localStorage.getItem("grantiv_business_profile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  } catch (error) {
    console.error("Failed to load profile from local storage", error);
    return null;
  }
};

const getThemeFromLocalStorage = () => {
  try {
    const savedTheme = localStorage.getItem("grantiv_theme");
    return savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : "light";
  } catch (error) {
    return "light";
  }
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [profile, setProfile] = useState(MOCK_BUSINESS_PROFILE);
  const [theme, setTheme] = useState(getThemeFromLocalStorage());

  // Effect to load initial state from local storage on mount
  useEffect(() => {
    setProfile(getProfileFromLocalStorage() || MOCK_BUSINESS_PROFILE);
    setTheme(getThemeFromLocalStorage());
  }, []);

  // Effect to sync theme with document and local storage
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

  // Handlers
  const handleSaveProfile = useCallback((newProfile) => {
    setProfile(newProfile);
    saveProfileToLocalStorage(newProfile);
  }, []);

  const { data } = useQuery({
    queryKey: ["businessProfile"],
    queryFn: handleBusinessForm,
  });

  console.log(data);

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-1">
              Business Profile
            </h3>
            <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-4 sm:mb-6">
              This information helps our AI match you with the right grants.
            </p>
            <BusinessProfileForm
              initialProfile={profile || undefined}
              onSave={handleSaveProfile}
              buttonText={profile ? "Save Changes" : "Save Profile"}
              Data={data}
            />
          </div>
        );
      case "Appearance":
        return (
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">
              Appearance
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-night dark:text-dark-text mb-2">
                  Theme
                </h4>
                <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-3 sm:mb-4">
                  Choose how Grantiv looks. Select a theme or sync with your
                  system.
                </p>
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg border-2 ${
                      theme === "light"
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-md bg-white border border-mercury flex items-center justify-center">
                      <SunIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-night dark:text-dark-text">
                      Light
                    </span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg border-2 ${
                      theme === "dark" ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-md bg-night border border-dark-border flex items-center justify-center">
                      <MoonIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-night dark:text-dark-text">
                      Dark
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "Subscription":
        return <Billing />;
      case "Notifications":
        return <Notification />;
    }
  };

  const settingsNavItems = [
    {
      id: "Profile",
      label: "Business Profile",
      icon: <UserCircleIcon className="w-5 h-5" />,
    },
    {
      id: "Appearance",
      label: "Appearance",
      icon: <SwatchIcon className="w-5 h-5" />,
    },
    {
      id: "Subscription",
      label: "Subscription",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
    {
      id: "Notifications",
      label: "Notifications",
      icon: <BellIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
        Settings
      </h2>
      <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">
        Manage your profile, subscription, and preferences.
      </p>
      {/* {!profile && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-200 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base font-semibold">Your profile is not yet complete.</p>
                    <p className="text-xs sm:text-sm">Please fill out your business profile to unlock the full power of Grantiv&apos;s AI matching and get personalized assistance.</p>
                </div>
            )} */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
            {settingsNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                // disabled={!profile && item.id !== 'Profile'}
                className={`flex items-center justify-center md:justify-start w-auto md:w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? "bg-primary text-night font-semibold"
                    : "text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Maps to ${item.label} settings`}
              >
                <span className="md:hidden">{item.icon}</span>
                <span className="hidden md:flex items-center">
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </span>
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
