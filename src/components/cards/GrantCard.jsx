// import React from 'react';
// import { motion } from 'framer-motion';
// import { CalendarDaysIcon, DocumentTextIcon } from '../icons/Icons'; // Assuming these are valid JSX components
// import { useNavigate } from 'react-router-dom';

// const GrantCard = ({ grant, onSelect, matchPercentage }) => {
//     const currencyFormatter = new Intl.NumberFormat('en-AU', {
//         style: 'currency',
//         currency: 'AUD',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     });

//     const getDaysRemaining = () => {
//         const deadlineDate = new Date(grant.deadline);
//         const today = new Date();
//         // Compare dates without time component for accuracy
//         today.setHours(0, 0, 0, 0);
//         // Set deadline to the end of its day
//         deadlineDate.setHours(23, 59, 59, 999);

//         const diffTime = deadlineDate.getTime() - today.getTime();
//         if (diffTime < 0) return null; // Grant has passed

//         // Use floor to get the number of full days remaining
//         const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays;
//     };
//     const daysRemaining = getDaysRemaining();
//     const navigate = useNavigate();

//     return (
//         <motion.div
//             className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden group h-full"
//             whileHover={{ y: -5 }}
//             transition={{ type: 'spring', stiffness: 300 }}
//         >
//             <div className="relative">
//                 {grant.imageUrl ? (
//                     <img src={grant.imageUrl} alt={grant.title} className="w-full h-36 object-cover" />
//                 ) : (
//                     <div className="w-full h-36 bg-mercury/30 dark:bg-dark-background flex items-center justify-center">
//                         <DocumentTextIcon className="w-12 h-12 text-mercury dark:text-dark-border" />
//                     </div>
//                 )}
//                 {typeof matchPercentage === 'number' && (
//                     <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-night font-bold text-lg font-heading p-2 rounded-md leading-none shadow-md">
//                         {matchPercentage}%
//                         <p className="text-xs font-sans font-normal -mt-1 text-center">Match</p>
//                     </div>
//                 )}
//             </div>
//             <div className="p-4 flex flex-col flex-grow">
//                 <h3 className="text-md font-bold text-night dark:text-dark-text mb-1 font-heading group-hover:text-secondary dark:group-hover:text-dark-secondary transition-colors">{grant.title}</h3>
//                 <p className="text-xs text-night/60 dark:text-dark-textMuted mb-3 flex-grow font-medium">{grant.funder}</p>

//                 <p className="text-sm text-night/80 dark:text-dark-text/80 mb-4 line-clamp-2">{grant.description}</p>

//                 <div className="text-sm text-night dark:text-dark-text space-y-2 mt-auto">
//                     <div>
//                         <span className="font-bold text-secondary dark:text-dark-secondary text-base">{currencyFormatter.format(grant.amount)}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-night/70 dark:text-dark-textMuted/80">
//                         <CalendarDaysIcon className="w-4 h-4" />
//                         <span>Deadline: {new Date(grant.deadline).toLocaleDateString('en-AU')}
//                             {daysRemaining !== null ? (
//                                 <span className={`font-semibold ml-1 ${daysRemaining < 14 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
//                                     ({daysRemaining === 0 ? 'Due today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`})
//                                 </span>
//                             ) : (
//                                 <span className="font-semibold ml-1 text-night/50 dark:text-dark-textMuted/60">(Closed)</span>
//                             )}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//             <div className="p-4 pt-2">
//                 <motion.button
//                     // onClick={() => onSelect(grant, matchPercentage)}
//                     onClick={() => navigate(`/dashboard/${grant.id}`)}
//                     className="w-full text-center text-sm font-bold text-night bg-primary/70 group-hover:bg-primary rounded-md py-2.5 transition-all duration-300"
//                 >
//                     View Details
//                 </motion.button>
//             </div>
//         </motion.div>
//     );
// };

// export default GrantCard;


import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, DocumentTextIcon } from '../icons/Icons'; 
import { useNavigate } from 'react-router-dom';

// Function to safely parse the Australian date format like "30-Sep-2025 2:00 pm (ACT Local Time)"
const parseAustralianDate = (dateString) => {
    if (!dateString) return null;
    // Attempt to parse the date string.
    // Replace short month names with full names for better compatibility if needed, 
    // but modern JS Date() constructor usually handles this format.
    // Example: "30-Sep-2025 2:00 pm (ACT Local Time)"
    const date = new Date(dateString);
    // Check if the date is valid
    return isNaN(date.getTime()) ? null : date;
};

const GrantCard = ({ grant, onSelect, matchPercentage }) => {
    // --- Map API Data to Card Props ---
    // 1. Funder: Use 'agency' from the API
    const funder = grant.agency;
    
    // 2. Amount: Use 'totalAmountAvailable' from the API, remove currency symbols/commas for formatting
    const amountValue = grant.totalAmountAvailable ? 
        parseFloat(String(grant.totalAmountAvailable).replace(/[^0-9.]/g, '')) : 
        0; // Use 0 or null if not available

    // 3. Deadline: Use 'closeDateTime' from the API
    const deadlineDateString = grant.closeDateTime;
    
    // 4. ID: Use '_id' from the API for the key and navigation
    const grantId = grant._id;


    const currencyFormatter = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const getDaysRemaining = () => {
        const deadlineDate = parseAustralianDate(deadlineDateString);
        if (!deadlineDate) return null; // Handle invalid date

        const today = new Date();
        // Compare dates without time component for accuracy
        today.setHours(0, 0, 0, 0);
        
        // Use the actual deadline time for comparison, or set to end of day if only date is used
        // Since the API includes time, we'll compare against the actual time.
        // If you still want to set to the end of the day:
        // deadlineDate.setHours(23, 59, 59, 999);

        const diffTime = deadlineDate.getTime() - today.getTime();
        
        // If the difference is less than zero, the grant has closed.
        if (diffTime < 0) return null;

        // Use floor to get the number of full days remaining
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    
    const daysRemaining = getDaysRemaining();
    const navigate = useNavigate();

    // Check for a valid deadline date for display
    const validDeadlineDate = parseAustralianDate(deadlineDateString);

    return (
        <motion.div
            className="bg-white dark:bg-dark-surface border border-mercury dark:border-dark-border rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden group h-full"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="relative">
                {grant.imageUrl ? (
                    <img src={grant.imageUrl} alt={grant.title} className="w-full h-36 object-cover" />
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
                <h3 className="text-md font-bold text-night dark:text-dark-text mb-1 font-heading group-hover:text-secondary dark:group-hover:text-dark-secondary transition-colors">{grant.title}</h3>
                {/* UPDATED: Use the 'funder' (agency) variable */}
                <p className="text-xs text-night/60 dark:text-dark-textMuted mb-3 flex-grow font-medium">{funder || 'N/A Agency'}</p> 

                <p className="text-sm text-night/80 dark:text-dark-text/80 mb-4 line-clamp-2">{grant.description}</p>

                <div className="text-sm text-night dark:text-dark-text space-y-2 mt-auto">
                    <div>
                        {/* UPDATED: Use the 'amountValue' variable */}
                        <span className="font-bold text-secondary dark:text-dark-secondary text-base">{currencyFormatter.format(amountValue)}</span>
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
                    onClick={() => navigate(`/dashboard/${grantId}`)} 
                    className="w-full text-center text-sm font-bold text-night bg-primary/70 group-hover:bg-primary rounded-md py-2.5 transition-all duration-300"
                >
                    View Details
                </motion.button>
            </div>
        </motion.div>
    );
};

export default GrantCard;

