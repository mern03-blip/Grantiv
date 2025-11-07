import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, DocumentTextIcon } from '../icons/Icons';
import GrantDetailModal from "../modals/GrantsDetail";
import { formatAmount } from '../../utils/formatAmount';
import { getDaysRemaining, parseAustralianDate } from '../../utils/deadlineDate';


const GrantCard = ({ grant, matchPercentage }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const deadlineDateString = grant.closeDateTime;
    const validDeadlineDate = parseAustralianDate(deadlineDateString);
    const daysRemaining = getDaysRemaining(deadlineDateString);

    return (
        <motion.div
            className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden group h-full"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="relative">
                {grant.grantImg ? (
                    <img src={grant.grantImg} alt={grant.title} className="w-full h-36 object-cover" />
                ) : (
                    <div className="w-full h-36 bg-mercury/30 dark:bg-dark-background flex items-center justify-center">
                        <DocumentTextIcon className="w-12 h-12 text-mercury dark:text-dark-border" />
                    </div>
                )}
                {typeof matchPercentage === 'number' && (
                    <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-night font-bold text-lg font-heading p-2 rounded-md leading-none shadow-md">
                        {matchPercentage}%
                        <p className="text-xs font-sans font-normal -mt-1 text-center">Match</p>
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-bold text-night dark:text-dark-text mb-1 font-heading
                 group-hover:text-secondary dark:group-hover:text-dark-secondary transition-colors cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >{grant.title}</h3>
                {/* UPDATED: Use the 'funder' (agency) variable */}
                <p className="text-xs text-night/60 dark:text-dark-textMuted mb-3 flex-grow font-medium">{grant.agency || 'N/A Agency'}</p>

                <p className="text-sm text-night/80 dark:text-dark-text/80 mb-4 line-clamp-2">{grant.description}</p>

                <div className="text-sm text-night dark:text-dark-text space-y-2 mt-auto">
                    <div>
                        <span className="font-semibold text-secondary dark:text-dark-secondary text-base">
                            {formatAmount(grant)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-night/70 dark:text-dark-textMuted/80">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>
                            {/* UPDATED: Use the validDeadlineDate or fallback string */}
                            Deadline: {validDeadlineDate ? validDeadlineDate.toLocaleDateString('en-AU') : 'N/A Date'}

                            {daysRemaining !== null ? (
                                <span className={`font-semibold ml-1 ${daysRemaining < 14 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                    ({daysRemaining === 0 ? 'Due today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`})
                                </span>
                            ) : (
                                <span className="font-semibold ml-1 text-night/50 dark:text-dark-textMuted/60">(Closed)</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-4 pt-2">
                <motion.button
                    // UPDATED: Use the '_id' property for navigation
                    // onClick={() => navigate(`/find-grants/${grantId}`)}
                    onClick={() => setIsModalOpen(true)}
                    className="w-full text-center text-sm font-bold text-night bg-primary/70 group-hover:bg-primary rounded-md py-2.5 transition-all duration-300"
                >
                    View Details
                </motion.button>
            </div>

            {/* 👇 Modal Component */}
            <GrantDetailModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                grant={grant}
            />
        </motion.div>
    );
};


export default GrantCard;





