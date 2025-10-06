import React from "react";
import { Segmented, Button } from "antd";
import PropTypes from "prop-types";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "./pagination.scss";

const CustomPagination = ({ currentPage, totalPages = 4, onPageChange }) => {
    const pageCount = totalPages > 0 ? totalPages : 1;
    const safeCurrentPage = currentPage > pageCount ? 1 : currentPage;

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const safeTotalPages =
        Number.isInteger(totalPages) && totalPages > 0 ? totalPages : 1;

    return (
        <div className="flex items-center justify-end gap-6">
            <Button
                type="primary"
                className={`${currentPage === 1 ? "bg-gray-400 hover:!bg-gray-400" : "bg-mainColor hover:!bg-mainColor"
                    } text-white font-custom border-none text-sm py-5 px-4 rounded-[1.2rem] `}
                icon={<SlArrowLeft />}
                onClick={handlePrevious}
                disabled={currentPage === 1}
            // disabled
            >
                Previous
            </Button>

            {/* Page Numbers */}
            {/* <Segmented
                className="rounded-[1.2rem] bg-white border border-mainColor py-1 px-1 flex gap-5 custom-pagination"
                options={[...Array(pageCount).keys()].map((page) => ({
                    label: <span>{page + 1}</span>,
                    value: page + 1,
                }))}
                value={safeCurrentPage}
                onChange={onPageChange}
            /> */}
            {/* <Segmented
                className="rounded-[1.2rem] bg-white border border-mainColor py-1 px-1 flex gap-5 custom-pagination"
                options={[
                    // { label: <span>1</span>, value: 1 }, // first page

                    // dots (conditionally show agar pages zyada hain)
                    ...(safeCurrentPage > 3 ? [{ label: <span>...</span>, value: "dots-start", disabled: true }] : []),

                    // current page
                    { label: <span>{safeCurrentPage}</span>, value: safeCurrentPage },

                    // dots before last page
                    ...(safeCurrentPage < pageCount - 2 ? [{ label: <span>...</span>, value: "dots-end", disabled: true }] : []),

                    // last page
                    { label: <span>{pageCount}</span>, value: pageCount },
                ]}
                value={safeCurrentPage}
                onChange={onPageChange}
            /> */}

            <Button
                type="primary"
                className={`${currentPage === safeTotalPages
                    ? "bg-gray-400 hover:!bg-gray-400"
                    : "bg-mainColor hover:!bg-mainColor"
                    } text-white font-custom border-none text-sm py-5 px-7 rounded-[1.2rem]`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                <span>Next</span>
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


