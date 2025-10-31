// import React, { useState } from 'react';
// import { Modal, Input, Select, Button, Space } from 'antd'; // Ant Design imports
// import { CiFilter } from 'react-icons/ci'; // For the title icon
// import './Search.scss'
// const { Option } = Select; // Destructure Option for the Select component

// // const cities = [
// //     'Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Rawalpindi',
// //     'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
// // ];

// const SearchFilterPopup = ({ isOpen, onClose, onSave, cities }) => {
//     // Local state for the form fields
//     const [maxAmount, setMaxAmount] = useState('');
//     const [minAmount, setMinAmount] = useState('');
//     const [agencyName, setAgencyName] = useState('');
//     const [city, setCity] = useState(null);

//     // Simple validation check
//     const isFormValid = maxAmount && minAmount && agencyName && city;

//     const handleSave = () => {
//         // Here, AntD Modal automatically handles its own closing if you use it right,
//         // but we'll call onClose after the custom save logic.
//         onSave({ maxAmount, minAmount, agencyName, city });
//         onClose();
//     };

//     // The footer buttons will be controlled by the AntD Modal, so we define them here.
//     const modalFooter = (
//         <Space>
//             {/* Save Button (AntD default primary style - blue) */}
//             <Button
//                 type="primary"
//                 onClick={handleSave}
//                 disabled={!isFormValid}
//                 className="!bg-mainColor font-custom font-b6"
//             >
//                 Apply Filter
//             </Button>
//         </Space>
//     );

//     return (
//         <Modal
//             // `open` is the prop for visibility in AntD v5+ (older versions use `visible`)
//             open={isOpen}
//             title={
//                 <span className="flex items-center gap-2 text-night dark:text-dark-text">
//                     <CiFilter size={24} />
//                     Save Search Filter
//                 </span>
//             }
//             onCancel={onClose} // Function to call when user clicks X or mask
//             footer={modalFooter}
//             // Optional: Set width if needed
//             width={520}
//         // Optional: Customize class names for dark mode support (requires Tailwind AntD setup)
//         // className="dark:bg-dark-surface dark:text-dark-text ant-modal-wrap"
//         >
//             <div className="grid grid-cols-2 gap-4 mt-4">

//                 {/* 1. Max Amount Field (Col 1) */}
//                 <div className="col-span-1">
//                     <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">Max Amount</label>
//                     <Input
//                         type="number"
//                         className='!border !border-grey-500  hover:border-custom focus:border-custom h-10'
//                         placeholder="e.g., 500000"
//                         value={maxAmount}
//                         onChange={(e) => setMaxAmount(e.target.value)}
//                     />
//                 </div>

//                 {/* 2. Min Amount Field (Col 2) */}
//                 <div className="col-span-1">
//                     <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">Min Amount</label>
//                     <Input
//                         type="number"
//                         className='!border !border-grey-500  hover:border-custom focus:border-custom h-10'
//                         placeholder="e.g., 100000"
//                         value={minAmount}
//                         onChange={(e) => setMinAmount(e.target.value)}
//                     />
//                 </div>

//                 {/* 3. Agency Name Field (Full width) */}
//                 <div className="col-span-2">
//                     <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">Agency Name</label>
//                     <Input
//                         placeholder="e.g., XYZ Real Estate"
//                         className='!border !border-grey-500  hover:border-custom focus:border-custom h-10'
//                         value={agencyName}
//                         onChange={(e) => setAgencyName(e.target.value)}
//                     />
//                 </div>

//                 {/* 4. City Select Field (Searchable / Inputable) */}
//                 <div className="col-span-2">
//                     <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">City</label>
//                     <Select
//                         showSearch // This makes the Select searchable/inputable
//                         placeholder="Select or type a City"
//                         optionFilterProp="children"
//                         onChange={setCity}
//                         value={city}
//                         filterOption={(input, option) =>
//                             // This ensures the search works correctly
//                             (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
//                         }
//                         style={{ width: '100%', height: "40px" }} // Ensures it takes full width
//                         className="custom-select"
//                     >
//                         {cities.map((c) => (
//                             <Option key={c} value={c}>{c}</Option>
//                         ))}
//                     </Select>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default SearchFilterPopup;




import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Space } from 'antd';
import { CiFilter } from 'react-icons/ci';
import './Search.scss';

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
        <Space>
            {/* Clear Button */}
            <Button onClick={handleClear}>
                Clear All
            </Button>

            {/* Apply Filter Button */}
            <Button
                type="primary"
                onClick={handleSave}
                disabled={!isFormValid}
                className="!bg-mainColor font-custom font-b6"
            >
                Apply Filter
            </Button>
        </Space>
    );

    return (
        <Modal
            open={isOpen}
            title={
                <span className="flex items-center gap-2 text-night dark:text-dark-text">
                    <CiFilter size={24} />
                    Filter Grants
                </span>
            }
            onCancel={onClose}
            footer={modalFooter}
            width={520}
        >
            <div className="grid grid-cols-2 gap-4 mt-4">
                {/* 1. Max Amount Field */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">
                        Max Amount
                    </label>
                    <Input
                        type="number"
                        className='!border !border-grey-500 hover:border-custom focus:border-custom h-10'
                        placeholder="e.g., 500000"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                    />
                </div>

                {/* 2. Min Amount Field */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">
                        Min Amount
                    </label>
                    <Input
                        type="number"
                        className='!border !border-grey-500 hover:border-custom focus:border-custom h-10'
                        placeholder="e.g., 100000"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                    />
                </div>

                {/* 3. Agency Name Field */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-night dark:text-dark-textMuted mb-1">
                        Agency Name
                    </label>
                    <Input
                        placeholder="e.g., XYZ Real Estate"
                        className='!border !border-grey-500 hover:border-custom focus:border-custom h-10'
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