import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

const sidebarItems = [
  {
    name: "Dashboard",
    icon: DashboardIcon,
    link: "/",
    paths: ["/"],
    view: "dashboard"
  },
  {
    name: "AI Assistant",
    icon: SparklesIcon,
    link: "/ai-assistant",
    paths: ["/ai-assistant"],
    view: "ai_assistant",
    isAI: true
  },
  {
    name: "Find Grants",
    icon: SearchIcon,
    link: "/find-grants", 
    paths: ["/find-grants"],
    view: "find_grants"
  },
  {
    name: "My Grants",
    icon: DocumentIcon,
    link: "/my-grants",
    paths: ["/my-grants", "/grant-application"],
    view: "my_grants"
  },
  {
    name: "Teams",
    icon: UsersIcon,
    link: "/teams",
    paths: ["/teams"],
    view: "teams"
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    link: "/settings",
    paths: ["/settings"],
    view: "settings"
  },
  {
    name: "Logout",
    icon: LogoutIcon,
    isLogout: true,
    view: "logout"
  }
];

export const Sidebar = ({
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileSidebarOpen,
  theme,
  setTheme,
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (item) => {
    if (!item.paths) return false;
    if (location.pathname === "/" && item.link === "/") {
      return true;
    }
    return item.paths.some((path) => {
      if (path === "/") return false;
      return location.pathname.startsWith(path);
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const NavItem = ({ item }) => {
    const isActive = isActiveRoute(item);
    const IconComponent = item.icon;

    // Logout button
    if (item.isLogout) {
      return (
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex items-center w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-left text-sm lg:text-base transition-colors ${
            isActive
              ? "bg-primary text-night font-semibold"
              : "text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50"
          } ${isCollapsed ? "justify-center" : ""}`}
        >
          <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2 lg:ml-3"
            }`}
          >
            {item.name}
          </span>
        </button>
      );
    }

    // Regular navigation items
    return (
      <Link
        to={item.link}
        className={`flex items-center w-full px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-left text-sm lg:text-base transition-colors ${
          isActive
            ? "bg-primary text-night font-semibold"
            : "text-night/60 dark:text-dark-textMuted hover:bg-mercury/50 dark:hover:bg-dark-surface/50"
        } ${isCollapsed ? "justify-center" : ""}`}
        onClick={() => onNavigate(item.view)}
      >
        <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
        <span
          className={`whitespace-nowrap transition-opacity duration-200 ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2 lg:ml-3"
          }`}
        >
          {item.isAI ? (
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
          ) : (
            item.name
          )}
        </span>
      </Link>
    );
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
        {sidebarItems.slice(0, -2).map((item, index) => (
          <NavItem key={index} item={item} />
        ))}

        <div className="flex-grow" />

        {sidebarItems.slice(-2).map((item, index) => (
          <NavItem key={index + sidebarItems.length - 2} item={item} />
        ))}
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
