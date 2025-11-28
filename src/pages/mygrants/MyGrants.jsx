import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '../../components/progressbar/ProgressBar';

const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const GrantStatus = {
  DRAFTING: 'Drafting',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const ALL_GRANTS = [
  {
    id: 'g1',
    title: 'Small Business Innovation Grant',
    funder: 'Tech Foundation',
    amount: 50000,
    deadline: getFutureDate(12), // "Closing in 12 days"
    category: 'National',
    description: 'The Digital Innovation Fund supports nonprofit organizations in developing and implementing technology solutions that enhance their mission impact. This grant focuses on projects that demonstrate measurable outcomes and sustainable digital transformation.',
    eligibility: 'Must be an Australian registered non-profit organization with DGR status. Annual revenue must not exceed $5M.',
    status: GrantStatus.DRAFTING,
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'g2',
    title: 'Community Arts Project Fund',
    funder: 'Arts Council of Australia',
    amount: 15000,
    deadline: '2024-11-30',
    category: 'Arts & Culture',
    description: 'Funding for local community art projects that promote cultural diversity and inclusion.',
    eligibility: 'Open to not-for-profit organizations and individual artists based in Australia.',
    status: GrantStatus.DRAFTING,
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=400&auto=format&fit=crop'
  },
];

const MyGrants = () => {
  const [selectedGrant, setSelectedGrant] = useState(null);

  const handleSelectGrant = useCallback((grant) => {
    setSelectedGrant(grant);
    console.log(`Selected grant: ${grant.title}`);
  }, []);

  const handleViewApplication = useCallback((grant) => {
    console.log(`Viewing application for: ${grant.title}`);
  }, []);

  return (
    <div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">My Grant Applications</h2>
      <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">Track the status and progress of all your grant applications.</p>
      <div className="space-y-4 sm:space-y-6">
        {ALL_GRANTS.length > 0 ? ALL_GRANTS.map(grant => (
          <div key={grant.id} className="bg-white dark:bg-dark-surface p-4 sm:p-5 md:p-6 rounded-lg border border-mercury dark:border-dark-border">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex-1">
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-night dark:text-dark-text font-heading">{grant.title}</h4>
                <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted mt-1">{grant.funder}</p>
              </div>
              <motion.button
                onClick={() => handleViewApplication(grant)}
                className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors whitespace-nowrap"
                aria-label={`Manage application for ${grant.title}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage Application
              </motion.button>
            </div>
            <ProgressBar status={grant.status} />
          </div>
        )) : (
          <div className="text-center p-6 sm:p-8 bg-white dark:bg-dark-surface rounded-lg border border-mercury dark:border-dark-border">
            <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted">You haven't started any applications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrants;