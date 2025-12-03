import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from "@tanstack/react-query";
import { handleOnboardingForm } from "../../api/endpoints/businessform";
import { message } from "antd";

// Define OrganizationType with the new options from your design
const OrganizationType = {
    'Not-for-Profit': 'Not-for-Profit',
    'Small Business (1-19 employees)': 'Small Business',
    'Medium Business (20-199 employees)': 'Medium Business',
    'Social Enterprise': 'Social Enterprise',
    'Individual Artist/Sole Trader': 'Individual Artist/Sole Trader',
    'Unincorporated Community Group': 'Unincorporated Community Group',
    'Other': 'Other',
};

// Progress Bar Component
const ProgressBar = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center justify-center mb-6 sm:mb-8">
            {Array.from({ length: totalSteps }, (_, index) => (
                <div key={index} className="flex items-center">
                    <div 
                        className={`h-1.5 sm:h-2 w-20 sm:w-32 rounded-full ${
                            index < currentStep ? 'bg-primary' : 'bg-gray-300'
                        }`}
                    />
                    {index < totalSteps - 1 && <div className="w-1.5 sm:w-2" />}
                </div>
            ))}
        </div>
    );
};

const BusinessProfileForm = ({ initialProfile, onSave, buttonText, Data }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialProfile || {
        organizationName: "",
        organizationType: "",
        city: '',
        state: '',
        industry: '',
        briefDescription: '',
        abn: '',
        dateEstablished: '',
        targetAudience: '',
        projectFocusAreas: '',
        previousFundingHistory: '',
        specificProjectGoals: '',
    });

    useEffect(() => {
        if (Data && Data != null) {
            setFormData(prev => ({
                ...prev,
                ...Data,
                organizationName: Data?.organizationName
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                organizationName: localStorage.getItem("orgName"),
            }));
        }
    }, [Data]);

    const { mutate: saveBusinessProfile } = useMutation({
        mutationFn: handleOnboardingForm,
        onSuccess: () => {
            message.success("Business profile saved successfully!");
            onSave && onSave();
            localStorage.setItem('grantiv_onboarding_skipped', 'true');
        },
        onError: (error) => {
            console.error("Error saving profile:", error);
            message.error("Failed to save business profile. Please try again.");
        },
    });

    const AUSTRALIAN_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
    const INDUSTRY_OPTIONS = [
        'Arts & Culture',
        'Community Services',
        'Education & Training',
        'Environment & Conservation',
        'Health & Wellbeing',
        'Indigenous',
        'Regional Development',
        'Science & Technology',
        'Social Enterprise',
        'Sport & Recreation',
        'Other'
    ];

    const commonInputClasses = "w-full p-3 sm:p-4 bg-white border border-custom rounded-custom focus:ring-2 focus:ring-primary focus:outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base";

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            organizationName: formData.organizationName,
            abn: formData.abn,
            organizationType: formData.organizationType,
            city: formData.city,
            state: formData.state,
            industry: formData.industry,
            dateEstablished: formData.dateEstablished,
            targetAudience: formData.targetAudience,
            projectFocusAreas: formData.projectFocusAreas,
            briefDescription: formData.briefDescription,
            previousFundingHistory: formData.previousFundingHistory,
            specificProjectGoals: formData.specificProjectGoals,
        };

        saveBusinessProfile(payload);
        console.log("Submitting Business Profile:", payload);
    };

    

    const renderStep1 = () => (
        <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                <h2 className="text-lg sm:text-xl text-gray-600 dark:text-white">Step 1 of 3: Core Details</h2>
            </div>

            <ProgressBar currentStep={1} totalSteps={3} />

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 dark:text-white">Let&apos;s start with the basics.</h1>

            <div className="space-y-6">
                <div>
                    <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">Organization Name</label>
                    <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        className={commonInputClasses}
                        placeholder="e.g., Acme Innovations Pty Ltd"
                    />
                </div>

                <div>
                    <label className="block text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base dark:text-white">Organization Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {Object.entries(OrganizationType).map(([key, type]) => {
                            const isSelected = formData.organizationType === type;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, organizationType: type }))}
                                    className={`p-3 sm:p-4 rounded-custom border transition-all duration-200 text-center text-xs sm:text-sm ${
                                        isSelected 
                                            ? 'bg-primary text-white border-primary' 
                                            : 'bg-white text-gray-900 border-custom hover:border-primary hover:bg-gray-50'
                                    }`}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end pt-6 sm:pt-8">
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!formData.organizationName || !formData.organizationType}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-primary text-white font-semibold rounded-custom hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next Step →
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                <h2 className="text-lg sm:text-xl text-gray-600 dark:text-white">Step 2 of 3: Location & Focus</h2>
            </div>

            <ProgressBar currentStep={2} totalSteps={3} />

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 dark:text-white">Where are you and what do you do?</h1>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">City / Town</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={commonInputClasses}
                            placeholder="e.g., Sydney"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">State / Territory</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={commonInputClasses}
                        >
                            <option value="" disabled>Select a State...</option>
                            {AUSTRALIAN_STATES.map(s => (
                                <option key={s} value={s} className="bg-white">{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">Industry / Sector</label>
                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={commonInputClasses}
                    >
                        <option value="" disabled>Select an industry...</option>
                        {INDUSTRY_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-white">{opt}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">Brief Description of Your Work (1-2 sentences)</label>
                    <textarea
                        name="briefDescription"
                        value={formData.briefDescription}
                        onChange={handleChange}
                        rows={4}
                        className={commonInputClasses}
                        placeholder="Briefly describe what your organization does and its mission."
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 sm:pt-8">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-gray-600 dark:text-white hover:text-primary transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!formData.city || !formData.state || !formData.industry || !formData.briefDescription}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-primary text-white font-semibold rounded-custom hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next Step →
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
                <h2 className="text-lg sm:text-xl text-gray-600 dark:text-white">Step 3 of 3: AI Power-Up</h2>
            </div>

            <ProgressBar currentStep={3} totalSteps={3} />

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 dark:text-white">Supercharge the AI (Optional)</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-white">Adding these extra details will greatly improve the accuracy of your grant matches.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">ABN (Australian Business Number)</label>
                        <input
                            type="text"
                            name="abn"
                            value={formData.abn}
                            onChange={handleChange}
                            className={commonInputClasses}
                            placeholder="e.g., 12 345 678 901"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">Date Established</label>
                        <input
                            type="text"
                            name="dateEstablished"
                            value={formData.dateEstablished}
                            onChange={handleChange}
                            className={commonInputClasses}
                            placeholder="mm/dd/yyyy"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">Target Audience / Community Served</label>
                    <input
                        type="text"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        className={commonInputClasses}
                        placeholder="e.g., Young people aged 12-25"
                    />
                </div>

                <div>
                    <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">Project Focus Areas (comma-separated)</label>
                    <input
                        type="text"
                        name="projectFocusAreas"
                        value={formData.projectFocusAreas}
                        onChange={handleChange}
                        className={commonInputClasses}
                        placeholder="e.g., Youth engagement, Digital literacy"
                    />
                </div>

                <div>
                    <label className="block text-gray-600 mb-3 text-sm sm:text-base dark:text-white">Specific Project Goals for Funding</label>
                    <textarea
                        name="specificProjectGoals"
                        value={formData.specificProjectGoals}
                        onChange={handleChange}
                        rows={4}
                        className={commonInputClasses}
                        placeholder="e.g., To build a digital literacy program for seniors, aiming to train 100 individuals..."
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 sm:pt-8">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base dark:text-white text-gray-600 hover:text-primary transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base dark:text-white bg-primary text-white font-semibold rounded-custom hover:bg-secondary transition-colors"
                    >
                        Finish & Get Started
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-night text-gray-900 p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default BusinessProfileForm;