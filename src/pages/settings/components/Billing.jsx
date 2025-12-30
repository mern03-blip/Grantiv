import React, { useCallback, useEffect, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import SubCancelModal from "../../../components/modals/SubCancelModal";
import { CheckCircleIcon, ReceiptIcon } from "../../../components/icons/Icons";
import {
  createCheckoutSession,
  getSubscriptionStatus,
} from "../../../api/endpoints/payment";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../components/loading/Loader";

const Billing = () => {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

    const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription-plan"],
    queryFn: getSubscriptionStatus,
  });

  const plan = subscriptionData?.plan || 'trial';

  // Get plan-specific features
  const getPlanFeatures = (planName) => {
    switch (planName?.toLowerCase()) {
      case "starter":
        return [
          "5 Grant Matches/Month",
          "Standard AI Assistance",
          "1 User Seat",
        ];
      case "pro":
        return [
          "Unlimited Grant Matches",
          "Advanced AI Assistance",
          "5 User Seats",
          "Team Collaboration",
        ];
      case "enterprise":
        return [
          "Everything in Pro",
          "Dedicated Team Chat",
          "Advanced Task Assignment",
          "Priority Support",
        ];
      default:
        return ["Not Purchased"];
    }
  };

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
          message.error("Unable to process payment. Please try again.");
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
        message.error("Payment processing failed. Please try again later.");
      } finally {
        setLoadingPlan(null);
      }
    },
    [plan]
  );


   // Show loader while checking subscription
  if (isLoadingSubscription) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6">
        Subscription & Billing
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border p-4 sm:p-5 md:p-6 rounded-lg">
            <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-1">
              Current Plan
            </h4>
            <p className="text-xl sm:text-2xl font-bold font-heading text-secondary dark:text-dark-secondary">
              {plan || "Free Trail"}
            </p>
            <ul className="text-[10px] sm:text-xs space-y-1 my-3 sm:my-4 text-night/70 dark:text-dark-textMuted">
              {getPlanFeatures(plan).map((feature, index) => (
                <li key={index} className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-primary" /> {feature}
                </li>
              ))}
            </ul>
            {/* <div className="space-y-2">
              <button className="w-full text-center text-sm font-bold text-night bg-primary rounded-md py-2.5 transition-all duration-300 hover:bg-secondary">
                Change Plan
              </button>
            </div> */}
          </div>
          {/* <div className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border p-4 sm:p-5 md:p-6 rounded-lg">
            <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-2 sm:mb-3 flex items-center gap-2">
              <ReceiptIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Billing History
            </h4>
            <p className="text-xs sm:text-sm text-night/50 dark:text-dark-textMuted">
              Your invoices will appear here.
            </p>
          </div> */}
          {plan?.toLowerCase() === "starter" && (
            <div className="bg-white dark:bg-dark-surface border-2 border-red-500/50 dark:border-red-500/30 p-4 sm:p-5 md:p-6 rounded-lg">
              <h4 className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 mb-2">
                Cancel Subscription
              </h4>
              <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-3">
                This action will downgrade your plan to <b>Free</b> at the end
                of your billing cycle.
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full text-center text-sm font-bold transition-all duration-300 rounded-md py-2 text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                Request Cancellation
              </button>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <h4 className="text-sm sm:text-base font-bold text-night dark:text-dark-text mb-3">
            Compare Plans
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
              isCurrent={plan?.toLowerCase() === "starter"}
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
              isCurrent={plan?.toLowerCase() === "pro"}
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
              isCurrent={plan?.toLowerCase() === "enterprise"}
              isLoading={loadingPlan === "Enterprise"}
            />
          </div>
        </div>
      </div>

      <SubCancelModal
        open={showCancelModal}
        handleOk={() => setShowCancelModal(false)}
        handleCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
};

export default Billing;
