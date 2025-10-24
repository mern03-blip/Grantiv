// import React from "react";
// import { Segmented, Button } from "antd";
// import PropTypes from "prop-types";
// import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
// import "./pagination.scss";

// const CustomPagination = ({ currentPage, totalPages = 4, onPageChange }) => {
//     const pageCount = totalPages > 0 ? totalPages : 1;
//     const safeCurrentPage = currentPage > pageCount ? 1 : currentPage;

//     const handlePrevious = () => {
//         if (currentPage > 1) {
//             onPageChange(currentPage - 1);
//         }
//     };

//     const handleNext = () => {
//         if (currentPage < totalPages) {
//             onPageChange(currentPage + 1);
//         }
//     };

//     const safeTotalPages =
//         Number.isInteger(totalPages) && totalPages > 0 ? totalPages : 1;

//     return (
//         <div className="flex items-center justify-end gap-6">
//             <Button
//                 type="primary"
//                 className={`${currentPage === 1 ? "bg-gray-400 hover:!bg-gray-400" : "bg-mainColor hover:!bg-mainColor"
//                     } text-white font-custom border-none text-sm py-5 px-4 rounded-[1.2rem] `}
//                 icon={<SlArrowLeft />}
//                 onClick={handlePrevious}
//                 disabled={currentPage === 1}
//             // disabled
//             >
//                 Previous
//             </Button>

//             {/* Page Numbers */}
//             <Segmented
//                 className="rounded-[1.2rem] bg-white border border-mainColor py-1 px-1 flex gap-5 custom-pagination"
//                 options={[...Array(pageCount).keys()].map((page) => ({
//                     label: <span>{page + 1}</span>,
//                     value: page + 1,
//                 }))}
//                 value={safeCurrentPage}
//                 onChange={onPageChange}
//             />

//             <Button
//                 type="primary"
//                 className={`${currentPage === safeTotalPages
//                     ? "bg-gray-400 hover:!bg-gray-400"
//                     : "bg-mainColor hover:!bg-mainColor"
//                     } text-white font-custom border-none text-sm py-5 px-7 rounded-[1.2rem]`}
//                 onClick={handleNext}
//                 disabled={currentPage === totalPages}
//             >
//                 <span>Next</span>
//                 <SlArrowRight />
//             </Button>

//         </div>
//     );
// };
// CustomPagination.propTypes = {
//     currentPage: PropTypes.number.isRequired,
//     totalPages: PropTypes.number.isRequired,
//     onPageChange: PropTypes.func.isRequired,
// };

// export default CustomPagination;




// import React, { useState, useEffect } from "react";
// import { Segmented, Button } from "antd";
// import PropTypes from "prop-types";
// import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
// import "./pagination.scss";

// const CustomPagination = ({ currentPage, totalPages = 4, onPageChange }) => {
//   const pageCount = totalPages > 0 ? totalPages : 1;
//   const safeCurrentPage = currentPage > pageCount ? 1 : currentPage;

//   const windowSize = 5;
//   const [pageWindowStart, setPageWindowStart] = useState(1);

//   // ✅ Sync window when currentPage changes (like after new search)
//   useEffect(() => {
//     const newWindowStart =
//       Math.floor((safeCurrentPage - 1) / windowSize) * windowSize + 1;
//     setPageWindowStart(newWindowStart);
//   }, [safeCurrentPage]);

//   const pageWindowEnd = Math.min(pageWindowStart + windowSize - 1, pageCount);

//   const visiblePages = Array.from(
//     { length: pageWindowEnd - pageWindowStart + 1 },
//     (_, i) => pageWindowStart + i
//   );

//   const handlePrevWindow = () => {
//     if (pageWindowStart > 1) {
//       setPageWindowStart(Math.max(pageWindowStart - windowSize, 1));
//     }
//   };

//   const handleNextWindow = () => {
//     if (pageWindowEnd < pageCount) {
//       setPageWindowStart(pageWindowStart + windowSize);
//     }
//   };

//   const handlePageChange = (page) => {
//     onPageChange(page);
//   };

//   return (
//     <div className="flex items-center justify-end gap-4 mt-6">
//       {/* Prev Button */}
//       <Button
//         type="primary"
//         className={`${
//           pageWindowStart === 1
//             ? "bg-gray-400 hover:!bg-gray-400"
//             : "bg-mainColor hover:!bg-mainColor"
//         } text-white font-custom border-none text-sm py-5 px-4 rounded-[1.2rem] flex items-center gap-2`}
//         icon={<SlArrowLeft />}
//         onClick={handlePrevWindow}
//         disabled={pageWindowStart === 1}
//       >
//         Prev
//       </Button>

//       {/* ✅ Segmented (5 pages visible) */}
//       <Segmented
//         className="rounded-[1.2rem] bg-white border border-mainColor py-1 px-1 flex gap-5 custom-pagination"
//         options={visiblePages.map((page) => ({
//           label: <span>{page}</span>,
//           value: page,
//         }))}
//         value={safeCurrentPage}
//         onChange={handlePageChange}
//       />

//       {/* Next Button */}
//       <Button
//         type="primary"
//         className={`${
//           pageWindowEnd >= pageCount
//             ? "bg-gray-400 hover:!bg-gray-400"
//             : "bg-mainColor hover:!bg-mainColor"
//         } text-white font-custom border-none text-sm py-5 px-7 rounded-[1.2rem] flex items-center gap-2`}
//         onClick={handleNextWindow}
//         disabled={pageWindowEnd >= pageCount}
//       >
//         Next
//         <SlArrowRight />
//       </Button>
//     </div>
//   );
// };

// CustomPagination.propTypes = {
//   currentPage: PropTypes.number.isRequired,
//   totalPages: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
// };

// export default CustomPagination;

import React, { useState, useEffect } from "react";
import { Segmented, Button } from "antd";
import PropTypes from "prop-types";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "./pagination.scss";

const CustomPagination = ({ currentPage, totalPages = 4, onPageChange }) => {
    const pageCount = totalPages > 0 ? totalPages : 1;
    const safeCurrentPage = currentPage > pageCount ? 1 : currentPage;

    const windowSize = 5;
    const [pageWindowStart, setPageWindowStart] = useState(1);

    // ✅ Adjust window dynamically when current page changes
    useEffect(() => {
        const newWindowStart =
            Math.floor((safeCurrentPage - 1) / windowSize) * windowSize + 1;
        setPageWindowStart(newWindowStart);
    }, [safeCurrentPage]);

    const pageWindowEnd = Math.min(pageWindowStart + windowSize - 1, pageCount);

    const visiblePages = Array.from(
        { length: pageWindowEnd - pageWindowStart + 1 },
        (_, i) => pageWindowStart + i
    );

    // ✅ Move one page backward
    const handlePrev = () => {
        if (safeCurrentPage > 1) {
            const newPage = safeCurrentPage - 1;
            onPageChange(newPage);
        }
    };

    // ✅ Move one page forward
    const handleNext = () => {
        if (safeCurrentPage < pageCount) {
            const newPage = safeCurrentPage + 1;
            onPageChange(newPage);
        }
    };

    const handlePageChange = (page) => {
        onPageChange(page);
    };

    return (
        <div className="flex items-center justify-end gap-4 mt-6">
            {/* Prev Button */}
            <Button
                type="primary"
                className={`${safeCurrentPage === 1
                    ? "bg-mercury  dark:bg-mercury"
                    : "bg-mainColor hover:!bg-mainColor"
                    } text-white font-custom border-none text-sm py-5 px-4 rounded-[1.2rem] flex items-center gap-2`}
                icon={<SlArrowLeft />}
                onClick={handlePrev}
                disabled={safeCurrentPage === 1}
            >
                Prev
            </Button>

            {/* ✅ Show 5 pages max */}
            <Segmented
                className="rounded-[1.2rem] bg-white border border-mainColor py-1 px-1 flex gap-5 custom-pagination"
                options={visiblePages.map((page) => ({
                    label: <span>{page}</span>,
                    value: page,
                }))}
                value={safeCurrentPage}
                onChange={handlePageChange}
            />

            {/* Next Button */}
            <Button
                type="primary"
                className={`${safeCurrentPage === pageCount
                    ? "bg-mercury  dark:bg-mercury"
                    : "bg-mainColor hover:!bg-mainColor"
                    } text-white font-custom border-none text-sm py-5 px-7 rounded-[1.2rem] flex items-center gap-2`}
                onClick={handleNext}
                disabled={safeCurrentPage === pageCount}
            >
                Next
                <SlArrowRight />
            </Button>
        </div>
    );
};

CustomPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default CustomPagination;
