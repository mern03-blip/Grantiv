import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  DashboardIcon,
  SearchIcon,
  DocumentIcon,
  SparklesIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronLeftIcon,
  MoonIcon,
  UsersIcon,
  SunIcon,
} from "../../components/icons/Icons";
import Logout from "../../components/modals/Logout";
import { DarkLogo, SidebarLogo } from "../../assets/image";

export const Sidebar = ({
  currentView,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  theme,
  setTheme,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Helper function to map view to a valid URL path
  const getPathForView = (view) => {
    switch (view) {
      case "dashboard":
        return "/";
      case "find_grants":
        return "/find-grants";
      case "my_grants":
        return "/my-grants";
      case "teams":
        return "/teams";
      case "settings":
        return "/settings";
      case "ai_assistant":
        return "/ai-assistant";
      default:
        return "#"; // fallback
    }
  };

  const NavItem = ({ icon, label, view, ariaLabel }) => {
    const isActive = currentView === view;
    const path = getPathForView(view);

    // Only logout will be a button to trigger modal
    if (view === "logout") {
      return (
        <button
          onClick={() => setShowLogoutModal(true)} // Set state to show modal
          className={`flex items-center w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-left text-sm lg:text-base transition-colors ${
            isActive
              ? "bg-primary text-night font-semibold"
              : "text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50"
          } ${isCollapsed ? "justify-center" : ""}`}
          // aria-label={ariaLabel} // commented out as it was in original
        >
          {icon}
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2 lg:ml-3"
            }`}
          >
            {label}
          </span>
        </button>
      );
    }

    // Rest (including ai_assistant) will be NavLink
    return (
      <NavLink
        to={path}
        className={({ isActive: navIsActive }) =>
          `flex items-center w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-left text-sm lg:text-base transition-colors ${
            navIsActive
              ? "bg-primary text-night font-semibold"
              : "text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50"
          } ${isCollapsed ? "justify-center" : ""}`
        }
        aria-label={ariaLabel}
        onClick={() => onNavigate(view)}
      >
        {icon}
        <span
          className={`whitespace-nowrap transition-opacity duration-200 ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2 lg:ml-3"
          }`}
        >
          {label}
        </span>
      </NavLink>
    );
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <aside
      className={`bg-white overflow-y-auto no-scrollbar dark:bg-dark-surface border-r border-mercury dark:border-dark-border p-4 pt-20 lg:pt-4 flex flex-col transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center py-4 mb-6 transition-all duration-300 ${
          isCollapsed ? "justify-center px-0" : "px-2"
        }`}
      >
        {isCollapsed ? (
          <div className="w-8 h-8 flex items-center justify-center">
            {/* Light mode logo */}
            <img
              src={SidebarLogo}
              alt="Grantiv Logo"
              className="h-8 w-8 object-contain block dark:hidden"
            />
            {/* Dark mode logo */}
            <img
              src={DarkLogo}
              alt="Grantiv Dark Logo"
              className="h-8 w-8 object-contain hidden dark:block"
            />
          </div>
        ) : (
          <div className="flex items-center justify-cente">
            <img
              src={SidebarLogo}
              alt="Grantiv Logo"
              className="w-[180px] lg:w-[320px] h-auto block dark:hidden"
            />
            <img
              src={DarkLogo}
              alt="Grantiv Dark Logo"
              className="w-[180px] lg:w-[320px] h-auto hidden dark:block"
            />
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 lg:gap-2 flex-grow">
        <NavItem
          icon={<DashboardIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
          label="Dashboard"
          view="dashboard"
          ariaLabel="Navigate to Dashboard"
        />

        <NavItem
          icon={<SparklesIcon className={"w-4 h-4 lg:w-5 lg:h-5"} />}
          label={
            <span>
              <span
                className="font-semibold"
                style={{
                  color: "#8CC84B",
                  filter: "drop-shadow(0 0 5px #8CC84B)",
                }}
              >
                AI
              </span>{" "}
              Assistant
            </span>
          }
          view="ai_assistant"
          ariaLabel="Navigate to AI Assistant"
        />

        <NavItem
          icon={<SearchIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
          label="Find Grants"
          view="find_grants"
          ariaLabel="Navigate to Find Grants"
        />
        <NavItem
          icon={<DocumentIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
          label="My Grants"
          view="my_grants"
          ariaLabel="Navigate to My Grants"
        />
        <NavItem
          icon={<UsersIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
          label="Teams"
          view="teams"
          ariaLabel="Navigate to Teams Management"
        />

        <div className="flex-grow" />

        <NavItem
          icon={<SettingsIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
          label="Settings"
          view="settings"
          ariaLabel="Navigate to Settings"
        />
        <NavItem
          icon={<LogoutIcon className="w-4 h-4 lg:w-5 lg:h-5" />}
          label="Logout"
          ariaLabel="Logout of your account"
          view="logout"
        />
      </nav>

      {/* Footer Controls */}
      <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-mercury/50 dark:border-dark-border/50 space-y-1 lg:space-y-2">
        <button
          onClick={toggleTheme}
          className={`flex items-center w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-sm lg:text-base text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <MoonIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          ) : (
            <SunIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          )}
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2 lg:ml-3"
            }`}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>

        <button
          onClick={onToggleCollapse}
          className={`flex items-center w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-sm lg:text-base text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeftIcon
            className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2 lg:ml-3"
            }`}
          >
            Collapse
          </span>
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <Logout
          open={showLogoutModal}
          handleOk={() => {
            localStorage.clear();
            // localStorage.removeItem('token');
            // localStorage.removeItem('userId');
            // localStorage.removeItem('grantiv_onboarding_skipped');
            // localStorage.removeItem("orgId");
            // localStorage.removeItem("orgName");
            setShowLogoutModal(false);
            navigate("auth/login");
          }}
          onClose={() => setShowLogoutModal(false)}
          handleCancel={() => setShowLogoutModal(false)}
        />
      )}
    </aside>
  );
};
