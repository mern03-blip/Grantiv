import React, { useCallback, useEffect, useState } from "react";
import SubscriptionCard from "../../pages/settings/components/SubscriptionCard";
import { createCheckoutSession } from "../../api/endpoints/payment";
import { message } from "antd";

const Payment = () => {
  const [plan, setPlan] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(null);

  // Load plan from localStorage on component mount
  useEffect(() => {
    const savedPlan = localStorage.getItem("plan");
    if (savedPlan) {
      setPlan(savedPlan);
    }
  }, []);

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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-night p-4">
      {/* Red Expiration Banner */}
      <div className="w-full max-w-4xl mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
        <p className="font-medium text-center sm:text-left">
          Your free trial has expired, you need to select a plan to continue
          your subscription
        </p>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl">
        <h3 className="text-lg sm:text-xl font-bold font-heading text-night dark:text-dark-text mb-4 sm:mb-6 text-center lg:text-left">
          Subscription & Billing
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-3">
            {" "}
            {/* Changed to col-span-3 to help centering the cards */}
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
      </div>
    </div>
  );
};

export default Payment;
