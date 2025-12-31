import React from "react";
import PropTypes from "prop-types";
import { CheckIcon } from "../../../components/icons/Icons";

const SubscriptionCard = ({
  name,
  price,
  description,
  features = [],
  isCurrent = false,
  isPopular = false,
  onSelect,
  buttonText: customButtonText,
  showMonthlyLabel = true,
  isLoading = false,
}) => {
  const buttonText =
    customButtonText ||
    (isCurrent
      ? "Current Plan"
      : price === "Contact Us"
      ? "Contact Us"
      : isLoading
      ? "Processing..."
      : "Upgrade");

  return (
    <div
      className={`border-2 rounded-lg p-3 sm:p-4 flex flex-col relative h-full w-[100%] ${
        isCurrent
          ? "border-primary"
          : "border-mercury/50 dark:border-dark-border"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-secondary text-night text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <h4 className="text-base sm:text-lg font-bold font-heading text-night dark:text-dark-text">
        {name}
      </h4>
      <p className="text-2xl sm:text-3xl font-bold font-heading text-night dark:text-dark-text my-1.5 sm:my-2">
        {price}
        {showMonthlyLabel && price !== "Contact Us" && (
          <span className="text-xs sm:text-sm font-sans text-night/50 dark:text-dark-textMuted">
            /month
          </span>
        )}
      </p>
      <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mb-3 sm:mb-4 flex-grow">
        {description}
      </p>
      {features.length > 0 && (
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-4 sm:mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-night dark:text-dark-text">{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => {
          if (price === "Contact Us") {
            window.location.href = "mailto:hello@grantiv.com.au";
          } else {
            onSelect();
          }
        }}
        disabled={isCurrent || isLoading}
        className={`w-full mt-auto py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
          isCurrent
            ? "bg-mercury/50 dark:bg-dark-border text-night/50 dark:text-dark-textMuted cursor-default"
            : isLoading
            ? "bg-primary/70 text-night cursor-not-allowed"
            : "bg-primary text-night hover:bg-secondary disabled:opacity-70"
        }`}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {buttonText}
      </button>
    </div>
  );
};

SubscriptionCard.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string),
  isCurrent: PropTypes.bool,
  isPopular: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  showMonthlyLabel: PropTypes.bool,
  isLoading: PropTypes.bool,
};

SubscriptionCard.defaultProps = {
  features: [],
  isCurrent: false,
  isPopular: false,
  showMonthlyLabel: true,
  isLoading: false,
};

export default SubscriptionCard;
