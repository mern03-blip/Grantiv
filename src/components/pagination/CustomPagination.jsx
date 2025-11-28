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
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-2">
            {/* ✅ Show per page dropdown */}
            <div className="flex items-center gap-2 justify-start sm:justify-end mt-1">
                <label className="text-xs sm:text-sm text-night dark:text-dark-textMuted whitespace-nowrap">
                    Grants Per Page:
                </label>
                <Select
                    value={grantsPerPage}
                    onChange={(value) => onGrantsPerPageChange(value)}
                    className="custom-select w-16 sm:w-20"
                    size="small"
                >
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                </Select>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 md:gap-4">
                {/* Prev Button */}
                <Button
                    type="primary"
                    className={`${safeCurrentPage === 1
                        ? "bg-mercury  dark:bg-mercury"
                        : "bg-mainColor hover:!bg-mainColor"
                        } text-white font-custom border-none text-xs sm:text-sm !py-3 sm:!py-4 md:!py-5 !px-2 sm:!px-3 md:!px-4 rounded-lg sm:rounded-[1.2rem] flex items-center gap-1 sm:gap-2`}
                    icon={<SlArrowLeft className="text-xs sm:text-sm" />}
                    onClick={handlePrev}
                    disabled={safeCurrentPage === 1}
                >
                    <span className="hidden sm:inline">Prev</span>
                </Button>

                {/* Page Numbers */}
                <Segmented
                    className="rounded-lg sm:rounded-[1.2rem] bg-white border border-mainColor !py-0.5 sm:!py-1 !px-0.5 sm:!px-1 flex gap-1 sm:gap-2 md:gap-3 custom-pagination text-xs sm:text-sm"
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
                        } text-white font-custom border-none text-xs sm:text-sm !py-3 sm:!py-4 md:!py-5 !px-2 sm:!px-4 md:!px-7 rounded-lg sm:rounded-[1.2rem] flex items-center gap-1 sm:gap-2`}
                    onClick={handleNext}
                    disabled={safeCurrentPage === pageCount}
                >
                    <span className="hidden sm:inline">Next</span>
                    <SlArrowRight className="text-xs sm:text-sm" />
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

