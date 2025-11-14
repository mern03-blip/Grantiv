// import React, { useState, useEffect } from "react";
// import { Segmented, Button } from "antd";
// import PropTypes from "prop-types";
// import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
// import "./pagination.scss";

// const CustomPagination = ({ currentPage, totalPages = 4, onPageChange }) => {
//     const pageCount = totalPages > 0 ? totalPages : 1;
//     const safeCurrentPage = currentPage > pageCount ? 1 : currentPage;

//     const windowSize = 5;
//     const [pageWindowStart, setPageWindowStart] = useState(1);

//     // ✅ Adjust window dynamically when current page changes
//     useEffect(() => {
//         const newWindowStart =
//             Math.floor((safeCurrentPage - 1) / windowSize) * windowSize + 1;
//         setPageWindowStart(newWindowStart);
//     }, [safeCurrentPage]);

//     const pageWindowEnd = Math.min(pageWindowStart + windowSize - 1, pageCount);

//     const visiblePages = Array.from(
//         { length: pageWindowEnd - pageWindowStart + 1 },
//         (_, i) => pageWindowStart + i
//     );

//     // ✅ Move one page backward
//     const handlePrev = () => {
//         if (safeCurrentPage > 1) {
//             const newPage = safeCurrentPage - 1;
//             onPageChange(newPage);
//         }
//     };

//     // ✅ Move one page forward
//     const handleNext = () => {
//         if (safeCurrentPage < pageCount) {
//             const newPage = safeCurrentPage + 1;
//             onPageChange(newPage);
//         }
//     };

//     const handlePageChange = (page) => {
//         onPageChange(page);
//     };

//     return (
//         <div className="flex justify-between gap-2">
//             <div className="flex items-center gap-2 justify-end">
//                 <label className="text-sm text-night dark:text-dark-textMuted">Show per page:</label>
//                 <select
//                     // value={grantsPerPage}
//                     // onChange={(e) => {
//                     //     setGrantsPerPage(Number(e.target.value));
//                     //     setCurrentPage(1); // reset page
//                     // }}
//                     className="border border-mercury dark:border-dark-border rounded-md px-2 py-1 bg-white dark:bg-dark-surface text-night dark:text-dark-text cursor-pointer"
//                 >
//                     <option value={10}>10</option>
//                     <option value={25}>25</option>
//                     <option value={50}>50</option>
//                     <option value={100}>100</option>
//                 </select>
//             </div>
//             <div className="flex items-center justify-end gap-4 ">
//                 {/* Prev Button */}
//                 <Button
//                     type="primary"
//                     className={`${safeCurrentPage === 1
//                         ? "bg-mercury  dark:bg-mercury"
//                         : "bg-mainColor hover:!bg-mainColor"
//                         } text-white font-custom border-none text-sm py-5 px-4 rounded-[1.2rem] flex items-center gap-2`}
//                     icon={<SlArrowLeft />}
//                     onClick={handlePrev}
//                     disabled={safeCurrentPage === 1}
//                 >
//                     Prev
//                 </Button>

//                 {/* ✅ Show 5 pages max */}
//                 <Segmented
//                     className="rounded-[1.2rem] bg-white border border-mainColor py-1 px-1 flex gap-5 custom-pagination"
//                     options={visiblePages.map((page) => ({
//                         label: <span>{page}</span>,
//                         value: page,
//                     }))}
//                     value={safeCurrentPage}
//                     onChange={handlePageChange}
//                 />

//                 {/* Next Button */}
//                 <Button
//                     type="primary"
//                     className={`${safeCurrentPage === pageCount
//                         ? "bg-mercury  dark:bg-mercury"
//                         : "bg-mainColor hover:!bg-mainColor"
//                         } text-white font-custom border-none text-sm py-5 px-7 rounded-[1.2rem] flex items-center gap-2`}
//                     onClick={handleNext}
//                     disabled={safeCurrentPage === pageCount}
//                 >
//                     Next
//                     <SlArrowRight />
//                 </Button>
//             </div>
//         </div>
//     );
// };

// CustomPagination.propTypes = {
//     currentPage: PropTypes.number.isRequired,
//     totalPages: PropTypes.number.isRequired,
//     onPageChange: PropTypes.func.isRequired,
// };

// export default CustomPagination;


import React, { useState, useEffect } from "react";
import { Segmented, Button, Select } from "antd";
import PropTypes from "prop-types";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "./pagination.scss";

const { Option } = Select;

const CustomPagination = ({
    currentPage,
    totalPages = 4,
    onPageChange,
    grantsPerPage,
    onGrantsPerPageChange
}) => {
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

    const handlePrev = () => {
        if (safeCurrentPage > 1) {
            onPageChange(safeCurrentPage - 1);
        }
    };

    const handleNext = () => {
        if (safeCurrentPage < pageCount) {
            onPageChange(safeCurrentPage + 1);
        }
    };

    return (
        <div className="flex justify-between gap-2">
            {/* ✅ Show per page dropdown */}
            <div className="flex items-center gap-2 justify-end mt-1">
                <label className="text-sm text-night dark:text-dark-textMuted">
                    Grants Per Page:
                </label>
                <Select
                    value={grantsPerPage}
                    onChange={(value) => onGrantsPerPageChange(value)}
                    className="custom-select w-20"
                >
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                </Select>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-end gap-4 ">
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

                {/* Page Numbers */}
                <Segmented
                    className="rounded-[1.2rem] bg-white border border-mainColor py-1 px-1 flex gap-5 custom-pagination"
                    options={visiblePages.map((page) => ({
                        label: <span>{page}</span>,
                        value: page,
                    }))}
                    value={safeCurrentPage}
                    onChange={onPageChange}
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
        </div>
    );
};

CustomPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    grantsPerPage: PropTypes.number.isRequired,
    onGrantsPerPageChange: PropTypes.func.isRequired,
};

export default CustomPagination;

