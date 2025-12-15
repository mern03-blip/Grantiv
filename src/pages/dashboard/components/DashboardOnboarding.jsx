import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  SearchIcon,
  PlusCircleIcon,
  CheckCircleIcon,
} from "../../../components/icons/Icons";
import { DarkLogo, SidebarLogo } from "../../../assets/image";

const EmptyDashboardStep = ({
  title,
  description,
  buttonText,
  onAction,
  icon,
  isComplete,
}) => (
  <motion.div
    className={`p-6 sm:p-8 rounded-2xl border text-left flex flex-col transition-all duration-300 h-full ${
      isComplete
        ? "bg-green-50 border-green-200"
        : "bg-white border-gray-200 hover:border-gray-300"
    }`}
    whileHover={
      !isComplete
        ? { y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }
        : {}
    }
  >
    <div className="flex items-start gap-4 mb-4">
      <div
        className={`p-3 rounded-full flex-shrink-0 ${
          isComplete
            ? "bg-green-100 text-green-600"
            : "bg-primary bg-opacity-10 text-primary"
        }`}
      >
        {isComplete ? <CheckCircleIcon className="w-6 h-6" /> : icon}
      </div>
      <div className="flex-1">
        <h3
          className={`text-xl font-bold mb-3 ${
            isComplete ? "text-green-800" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      </div>
    </div>

    <p
      className={`text-base mb-6 flex-grow leading-relaxed ${
        isComplete ? "text-green-700" : "text-gray-600"
      }`}
    >
      {description}
    </p>

    <button
      onClick={onAction}
      disabled={isComplete}
      className={`font-semibold text-base mt-auto text-left w-fit transition-all duration-200 ${
        isComplete
          ? "text-green-600 cursor-default"
          : "text-primary hover:text-secondary hover:underline"
      }`}
    >
      {isComplete ? "✓ Completed" : `${buttonText} →`}
    </button>
  </motion.div>
);

// PropTypes for EmptyDashboardStep
EmptyDashboardStep.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  isComplete: PropTypes.bool.isRequired
};

const EmptyDashboardView = ({
  onNavigate,
  onAddGrant,
  isProfileComplete = false,
  isGrantFound = false,
  isProjectStarted = false,
  onSkip,
}) => {
  return (
    <div className="min-h-screen bg-alabaster px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
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

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-heading mb-6">
          Let's Get You Funded
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
          Welcome to your dashboard. Complete these steps to unlock the full
          power of Grantiv's AI and start your grant-seeking journey.
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <EmptyDashboardStep
            title="1. Complete Your Profile"
            description="A detailed profile helps our AI find grants that perfectly match your organization's needs."
            buttonText="Go to Settings"
            onAction={() => onNavigate("settings")}
            icon={<UserCircleIcon className="w-6 h-6" />}
            isComplete={isProfileComplete}
          />

          <EmptyDashboardStep
            title="2. Find Your First Grant"
            description="Use our powerful search to discover and save funding opportunities tailored to you."
            buttonText="Find Grants"
            onAction={() => onNavigate("find_grants")}
            icon={<SearchIcon className="w-6 h-6" />}
            isComplete={isGrantFound}
          />

          <EmptyDashboardStep
            title="3. Start a Project"
            description="Add a grant to 'My Grants' to begin tracking your application and collaborating with your team."
            buttonText="Add a Project"
            onAction={onAddGrant}
            icon={<PlusCircleIcon className="w-6 h-6" />}
            isComplete={isProjectStarted}
          />
        </div>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="text-base text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-200"
          aria-label="Skip onboarding steps and go to dashboard"
        >
          I'll do this later, take me to the dashboard
        </button>
      </div>
    </div>
  );
};

// PropTypes for EmptyDashboardView
EmptyDashboardView.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onAddGrant: PropTypes.func.isRequired,
  isProfileComplete: PropTypes.bool,
  isGrantFound: PropTypes.bool,
  isProjectStarted: PropTypes.bool,
  onSkip: PropTypes.func.isRequired
};

EmptyDashboardView.defaultProps = {
  isProfileComplete: false,
  isGrantFound: false,
  isProjectStarted: false
};

const DashboardOnboarding = ({ 
  onNavigate: propOnNavigate,
  onAddGrant: propOnAddGrant,
  isProfileComplete = false,
  isGrantFound = false,
  isProjectStarted = false,
  onSkip
}) => {
  const navigate = useNavigate();

  const handleNavigate = (view) => {
    if (propOnNavigate) {
      propOnNavigate(view);
    } else {
      switch (view) {
        case "settings":
          navigate("/settings");
          break;
        case "find_grants":
          navigate("/find-grants");
          break;
        default:
          break;
      }
    }
  };

  const handleAddGrant = () => {
    if (propOnAddGrant) {
      propOnAddGrant();
    } else {
      navigate("/my-grants");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("dashboard-onboarding-skipped", "true");
    if (onSkip) {
      onSkip(); // Call the parent's onSkip handler
    } else {
      window.location.reload(); // Fallback if no onSkip prop
    }
  };

  // Check if all steps are complete to show main dashboard
  const allStepsComplete = isProfileComplete && isGrantFound && isProjectStarted;

  if (allStepsComplete) {
    // Return main dashboard content here
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard!</h1>
        <p>All onboarding steps completed.</p>
      </div>
    );
  }

  return (
    <EmptyDashboardView
      onNavigate={handleNavigate}
      onAddGrant={handleAddGrant}
      isProfileComplete={isProfileComplete}
      isGrantFound={isGrantFound}
      isProjectStarted={isProjectStarted}
      onSkip={handleSkip}
    />
  );
};

// PropTypes for DashboardOnboarding
DashboardOnboarding.propTypes = {
  onNavigate: PropTypes.func,
  onAddGrant: PropTypes.func,
  isProfileComplete: PropTypes.bool,
  isGrantFound: PropTypes.bool,
  isProjectStarted: PropTypes.bool,
  onSkip: PropTypes.func
};

DashboardOnboarding.defaultProps = {
  onNavigate: null,
  onAddGrant: null,
  isProfileComplete: false,
  isGrantFound: false,
  isProjectStarted: false,
  onSkip: null
};

export default DashboardOnboarding;


