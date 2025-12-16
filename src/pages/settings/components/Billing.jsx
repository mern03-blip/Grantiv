import React, { useCallback, useEffect, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { CheckCircleIcon, ReceiptIcon } from "../../../components/icons/Icons";
import { createCheckoutSession } from "../../../api/endpoints/payment";

const MOCK_BUSINESS_PROFILE = {
  id: "1",
  companyName: "Grantiv Inc.",
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

const Billing = () => {
  const [plan, setPlan] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [profile, setProfile] = useState(MOCK_BUSINESS_PROFILE);
  const [loadingPlan, setLoadingPlan] = useState(null); // Track which plan is loading

  // Handle subscription upgrade
  const handleUpgrade = useCallback(
    async (planName) => {
      if (plan === planName || planName === "Enterprise") {
        return; // Don't process if it's current plan or Enterprise
      }

      setLoadingPlan(planName); // Set loading for specific plan
      try {
        // Convert plan name to lowercase for API
        const planParam = planName.toLowerCase();

        // Call the checkout session API
        const response = await createCheckoutSession(planParam);

        // Redirect to Stripe Checkout
        if (response.url) {
          window.location.href = response.url;
        } else {
          console.error("No checkout URL received");
          alert("Unable to process payment. Please try again.");
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
        alert("Payment processing failed. Please try again later.");
      } finally {
        setLoadingPlan(null); // Clear loading state
      }
    },
    [plan]
  );

  const handleSetPlan = useCallback((newPlan) => {
    setPlan(newPlan);
    try {
      localStorage.setItem("grantiv_user_plan", newPlan);
    } catch (error) {
      console.error("Failed to save plan to local storage", error);
    }
  }, []);

  const handleToggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const newMode = !prev;
      try {
        localStorage.setItem("grantiv_demo_mode", JSON.stringify(newMode));
      } catch (error) {
        console.error("Failed to save demo mode to local storage", error);
      }
      return newMode;
    });
  }, []);

  useEffect(() => {
    setProfile(getProfileFromLocalStorage() || MOCK_BUSINESS_PROFILE);
    try {
      const savedPlan = localStorage.getItem("grantiv_user_plan");
      if (savedPlan) setPlan(savedPlan);
      const savedDemoMode = localStorage.getItem("grantiv_demo_mode");
      if (savedDemoMode) setIsDemoMode(JSON.parse(savedDemoMode));
    } catch (error) {
      console.error("Failed to load settings from local storage", error);
    }
  }, []);

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">
        Subscription & Billing
      </h3>

      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700/50 rounded-lg text-yellow-800 dark:text-yellow-200">
        <h4 className="text-sm sm:text-base font-bold">Developer Controls</h4>
        <p className="text-xs sm:text-sm mb-2">
          Use these controls to test different application states.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          <div className="w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-semibold mr-2">
              Current Plan:
            </span>
            <div className="inline-flex flex-wrap gap-2 mt-1 sm:mt-0">
              {["Starter", "Pro", "Enterprise"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSetPlan(p)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md font-semibold ${
                    plan === p
                      ? "bg-primary text-night"
                      : "bg-white/50 dark:bg-dark-border"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="demo-toggle"
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="demo-toggle"
                  className="sr-only"
                  checked={isDemoMode}
                  onChange={handleToggleDemoMode}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition-colors ${
                    isDemoMode
                      ? "bg-secondary"
                      : "bg-mercury dark:bg-dark-border"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    isDemoMode ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
              <div className="ml-3 font-medium">
                Demo Mode:{" "}
                <span className="font-bold">{isDemoMode ? "ON" : "OFF"}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border p-4 sm:p-5 md:p-6 rounded-lg">
            <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-1">
              Current Plan
            </h4>
            <p className="text-xl sm:text-2xl font-bold font-heading text-secondary dark:text-dark-secondary">
              {plan} Plan
            </p>
            <ul className="text-[10px] sm:text-xs space-y-1 my-3 sm:my-4 text-night/70 dark:text-dark-textMuted">
              <li className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-primary" /> Unlimited
                Grant Matches
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-primary" /> Advanced AI
                Assistance
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-primary" /> Team
                Collaboration
              </li>
            </ul>
            <div className="space-y-2">
              <button className="w-full text-center text-sm font-bold text-night bg-primary rounded-md py-2.5 transition-all duration-300 hover:bg-secondary">
                Change Plan
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border p-4 sm:p-5 md:p-6 rounded-lg">
            <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-2 sm:mb-3 flex items-center gap-2">
              <ReceiptIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Billing History
            </h4>
            <p className="text-xs sm:text-sm text-night/50 dark:text-dark-textMuted">
              Your invoices will appear here.
            </p>
          </div>
          <div className="bg-white dark:bg-dark-surface border-2 border-red-500/50 dark:border-red-500/30 p-4 sm:p-5 md:p-6 rounded-lg">
            <h4 className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 mb-2">
              Cancel Subscription
            </h4>
            <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-3">
              This action will downgrade your plan to 'Starter' at the end of
              your billing cycle.
            </p>
            <button className="w-full text-center text-sm font-bold text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-md py-2 transition-all duration-300 hover:bg-red-200 dark:hover:bg-red-900/50">
              Request Cancellation
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-3">
            Compare Plans
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <SubscriptionCard
              name="Starter"
              price="$29"
              description="For individuals and small teams getting started."
              features={[
                "5 Grant Matches/Month",
                "Standard AI Assistance",
                "1 User Seat",
              ]}
              onSelect={() => handleUpgrade("Starter")}
              isCurrent={plan === "Starter"}
              isLoading={loadingPlan === "Starter"}
            />
            <SubscriptionCard
              name="Pro"
              price="$79"
              description="For growing teams that need more power and collaboration."
              features={[
                "Unlimited Grant Matches",
                "Advanced AI Assistance",
                "5 User Seats",
                "Team Collaboration",
              ]}
              isPopular
              onSelect={() => handleUpgrade("Pro")}
              isCurrent={plan === "Pro"}
              isLoading={loadingPlan === "Pro"}
            />
            <SubscriptionCard
              name="Enterprise"
              price="Contact Us"
              description="Custom solutions for large organizations needing advanced collaboration and support."
              features={[
                "Everything in Pro",
                "Dedicated Team Chat",
                "Advanced Task Assignment",
                "Priority Support",
              ]}
              onSelect={() => {}}
              isCurrent={plan === "Enterprise"}
              isLoading={loadingPlan === "Enterprise"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
