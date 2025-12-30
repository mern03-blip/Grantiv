import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  TargetIcon,
  DocumentIcon,
  ListBulletIcon,
  CurrencyDollarIcon,
} from "../../../components/icons/Icons";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getMyGrants } from "../../../api/endpoints/customGrant";
import { gettasks } from "../../../api/endpoints/personaltask";

// --- StatCard Component (Converted to JSX) ---
const StatCard = ({ icon: Icon, title, value }) => (
  <motion.div
    className="bg-white/80 dark:bg-dark-surface/50 backdrop-blur-sm p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-black/20 border border-white/50 dark:border-dark-border/20"
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-night/60 dark:text-dark-textMuted" />
      <h3 className="text-sm font-semibold text-night/80 dark:text-dark-textMuted">
        {title}
      </h3>
    </div>
    <p className="text-4xl font-bold text-night dark:text-dark-text font-heading mt-2">
      {value}
    </p>
  </motion.div>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const StatCards = () => {
  const { aiTotalAmount } = useSelector((state) => state.grants);

  const { data } = useQuery({
    queryKey: ["myGrants"],
    queryFn: getMyGrants,
  });

  const { data: tasksData } = useQuery({
      queryKey: ["tasks"],
      queryFn: () => gettasks(),
    });
  
    const totalTasks = tasksData?.data.length || 0;

  const inProgressGrants = data?.filter(
    (grant) => grant.status !== "awarded"
  ).length;

const calculateTotalGrantAmount = (grants = []) => {
  return grants.reduce((total, grant) => {
    if (grant.status !== "awarded") return total;

    const amount = Number(grant.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
};

const totalGrantAmount = calculateTotalGrantAmount(data);


  // Helper function to format AUD currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
      <StatCard
        icon={TargetIcon}
        title="Potential Funding"
        value={aiTotalAmount}
      />
      <StatCard
        icon={DocumentIcon}
        title="In Progress"
        value={`${inProgressGrants}`}
      />
      <StatCard
        icon={ListBulletIcon}
        title="Tasks To-Do"
        value={`${totalTasks}`}
      />
      <StatCard
        icon={CurrencyDollarIcon}
        title="Total Awarded"
        value={formatCurrency(totalGrantAmount)}
      />
    </div>
  );
};

StatCards.propTypes = {
  potentialFunding: PropTypes.number.isRequired,
  inProgressGrants: PropTypes.number.isRequired,
  incompleteTasks: PropTypes.number.isRequired,
  awardedAmount: PropTypes.number.isRequired,
};


export default StatCards;
