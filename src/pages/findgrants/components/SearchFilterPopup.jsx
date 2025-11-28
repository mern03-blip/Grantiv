import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Space } from 'antd';
import { CiFilter } from 'react-icons/ci';

const { Option } = Select;

const SearchFilterPopup = ({ isOpen, onClose, onSave, cities, initialFilters = {} }) => {
    // Local state for the form fields
    const [maxAmount, setMaxAmount] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [city, setCity] = useState(null);

    // ✅ Populate form with initial filter values when popup opens
    useEffect(() => {
        if (isOpen) {
            setMaxAmount(initialFilters.maxAmount || '');
            setMinAmount(initialFilters.minAmount || '');
            setAgencyName(initialFilters.agencyName || '');
            setCity(initialFilters.city || null);
        }
    }, [isOpen, initialFilters]);

    // ✅ Changed validation - at least ONE field should be filled
    const isFormValid = maxAmount || minAmount || agencyName || city;

    const handleSave = () => {
        onSave({
            maxAmount,
            minAmount,
            agencyName,
            city
        });
        onClose();
    };

    // ✅ Handle clear/reset
    const handleClear = () => {
        setMaxAmount('');
        setMinAmount('');
        setAgencyName('');
        setCity(null);
    };

    const modalFooter = (
        <Space className="w-full" direction="horizontal" style={{ justifyContent: 'flex-end' }}>
            {/* Clear Button */}
            {/* <Button onClick={handleClear}>
                Clear All
            </Button> */}

            {/* Apply Filter Button */}
            <Button
                type="primary"
                onClick={handleSave}
                disabled={!isFormValid}
                className="!bg-mainColor font-custom font-b6 !h-9 sm:!h-10 text-sm sm:text-base"
                block={window.innerWidth < 640}
            >
                Apply Filter
            </Button>
        </Space>
    );

    return (
        <Modal
            open={isOpen}
            title={
                <span className="flex items-center gap-2 text-night dark:text-dark-text text-base sm:text-lg">
                    <CiFilter size={20} className="sm:w-6 sm:h-6" />
                    Filter Grants
                </span>
            }
            onCancel={onClose}
            footer={modalFooter}
            width="90%"
            style={{ maxWidth: '520px' }}
            centered
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                {/* 1. Max Amount Field */}
                <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-night dark:text-dark-textMuted mb-1">
                        Max Amount
                    </label>
                    <Input
                        type="number"
                        className='!border !border-grey-500 hover:border-custom focus:border-custom h-9 sm:h-10 text-sm'
                        placeholder="e.g., 500000"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                    />
                </div>

                {/* 2. Min Amount Field */}
                <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-night dark:text-dark-textMuted mb-1">
                        Min Amount
                    </label>
                    <Input
                        type="number"
                        className='!border !border-grey-500 hover:border-custom focus:border-custom h-9 sm:h-10 text-sm'
                        placeholder="e.g., 100000"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                    />
                </div>

                {/* 3. Agency Name Field */}
                <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-night dark:text-dark-textMuted mb-1">
                        Agency Name
                    </label>
                    <Input
                        placeholder="e.g., XYZ Real Estate"
                        className='!border !border-grey-500 hover:border-custom focus:border-custom h-9 sm:h-10 text-sm'
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                    />
                </div>

                {/* 4. City Select Field */}
                {/* <div className="col-span-2">
                    <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">
                        City
                    </label>
                    <Select
                        showSearch
                        placeholder="Select or type a City"
                        optionFilterProp="children"
                        onChange={setCity}
                        value={city}
                        allowClear
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        style={{ width: '100%', height: "40px" }}
                        className="custom-select"
                    >
                        {cities.map((c) => (
                            <Option key={c} value={c}>{c}</Option>
                        ))}
                    </Select>
                </div> */}
            </div>
        </Modal>
    );
};

export default SearchFilterPopup;