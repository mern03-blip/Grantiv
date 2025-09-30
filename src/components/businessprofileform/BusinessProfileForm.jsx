import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

// Define OrganizationType as a simple object for JSX
const OrganizationType = {
    SMALL_BUSINESS: 'Small Business',
    NON_PROFIT: 'Non-Profit',
    SOCIAL_ENTERPRISE: 'Social Enterprise',
    EDUCATION: 'Education',
    GOVERNMENT: 'Government',
    OTHER: 'Other',
};

// Memoized FormRow component to prevent unnecessary re-renders
const FormRow = memo(({ label, htmlFor, children, className }) => (
    <div className={className}>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1">{label}</label>
        {children}
    </div>
));

// Memoized FormSection component to prevent unnecessary re-renders
const FormSection = memo(({ title, children }) => (
    <div className="space-y-6 pt-6">
        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-mercury/50 dark:border-dark-border/50" />
            </div>
            <div className="relative flex justify-start">
                <span className="bg-white dark:bg-dark-surface pr-3 text-lg font-bold font-heading text-night dark:text-dark-text">{title}</span>
            </div>
        </div>
        {children}
    </div>
));

const BusinessProfileForm = ({ initialProfile, onSave, buttonText }) => {
    const [formData, setFormData] = useState(initialProfile || {
        organizationName: '',
        organizationType: OrganizationType.SMALL_BUSINESS,
        city: '',
        state: '',
        industry: '',
        description: '',
        abn: '',
        establishedDate: '',
        targetAudience: '',
        projectFocusAreas: '',
        fundingHistory: '',
        currentProjectGoals: '',
    });

    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

    const commonInputClasses = "w-full p-3 border border-mercury dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-dark-background text-night dark:text-dark-text placeholder-night/40 dark:placeholder-dark-textMuted/60";

    // Memoize the handleChange function to maintain a stable reference
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.organizationName || !formData.city || !formData.state || !formData.industry || !formData.description) {
            alert("Please fill out all required fields in the Core Details and Organization Focus sections.");
            return;
        }
        onSave(formData);
    };

    // console.log("Business Render");

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text">Core Details</h3>
                <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormRow label="Organization Name" htmlFor="organizationName">
                            <input
                                type="text"
                                id="organizationName"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleChange}
                                className={commonInputClasses}
                                placeholder="e.g., Acme Innovations Pty Ltd"
                                required
                            />
                        </FormRow>
                        <FormRow label="ABN (Australian Business Number)" htmlFor="abn">
                            <input
                                type="text"
                                id="abn"
                                name="abn"
                                value={formData.abn}
                                onChange={handleChange}
                                className={commonInputClasses}
                                placeholder="e.g., 12 345 678 901"
                            />
                        </FormRow>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-night/80 dark:text-dark-textMuted mb-2">Organization Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.values(OrganizationType).map(type => {
                                const isSelected = formData.organizationType === type;
                                const typeId = slugify(type);
                                return (
                                    <div key={type}>
                                        <input
                                            type="radio"
                                            id={typeId}
                                            name="organizationType"
                                            value={type}
                                            checked={isSelected}
                                            onChange={handleChange}
                                            className="sr-only"
                                            aria-label={`Select organization type: ${type}`}
                                        />
                                        <label htmlFor={typeId} className={`flex items-center justify-center h-full cursor-pointer p-4 border rounded-lg text-center text-sm font-medium transition-all duration-200 ${isSelected ? 'bg-primary border-secondary text-night font-bold shadow-lg' : 'bg-white dark:bg-dark-surface border-mercury dark:border-dark-border text-night dark:text-dark-text hover:border-secondary dark:hover:border-dark-secondary hover:shadow-md'}`}>
                                            {type}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormRow label="City / Town" htmlFor="city">
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={commonInputClasses}
                                placeholder="e.g., Sydney"
                                required
                            />
                        </FormRow>
                        <FormRow label="State / Territory" htmlFor="state">
                            <select
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={commonInputClasses}
                                required
                            >
                                <option value="" disabled>Select a State/Territory...</option>
                                {AUSTRALIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </FormRow>
                        <FormRow label="Industry / Sector" htmlFor="industry">
                            <select
                                id="industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className={commonInputClasses}
                                required
                            >
                                <option value="" disabled>Select an industry...</option>
                                {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </FormRow>
                        <FormRow label="Date Established" htmlFor="establishedDate">
                            <input
                                type="date"
                                id="establishedDate"
                                name="establishedDate"
                                value={formData.establishedDate}
                                onChange={handleChange}
                                className={`${commonInputClasses} dark:[color-scheme:dark]`}
                            />
                        </FormRow>
                    </div>
                </div>
            </div>

            <FormSection title="Organization Focus">
                <div className="grid grid-cols-1 gap-6">
                    <FormRow label="Target Audience / Community Served" htmlFor="targetAudience">
                        <input
                            type="text"
                            id="targetAudience"
                            name="targetAudience"
                            value={formData.targetAudience}
                            onChange={handleChange}
                            className={commonInputClasses}
                            placeholder="e.g., Young people aged 12-25"
                        />
                    </FormRow>
                    <FormRow label="Project Focus Areas" htmlFor="projectFocusAreas">
                        <textarea
                            id="projectFocusAreas"
                            name="projectFocusAreas"
                            value={formData.projectFocusAreas}
                            onChange={handleChange}
                            rows={3}
                            className={commonInputClasses}
                            placeholder="List your main activities, separated by commas. e.g., Youth engagement, Environmental sustainability, Digital literacy"
                        />
                    </FormRow>
                    <FormRow label="Brief Description of Your Work" htmlFor="description">
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={commonInputClasses}
                            placeholder="Briefly describe what your organization does, its mission, and its primary activities."
                            required
                        />
                    </FormRow>
                </div>
            </FormSection>

            <FormSection title="Advanced AI Matching Details (Optional)">
                <div className="grid grid-cols-1 gap-6">
                    <FormRow label="Previous Funding History" htmlFor="fundingHistory">
                        <textarea
                            id="fundingHistory"
                            name="fundingHistory"
                            value={formData.fundingHistory}
                            onChange={handleChange}
                            rows={3}
                            className={commonInputClasses}
                            placeholder="Describe any grants or significant funding your organization has received in the past. e.g., 'Received a $20,000 local council grant in 2022 for a community arts project.'"
                        />
                    </FormRow>
                    <FormRow label="Specific Project Goals for Funding" htmlFor="currentProjectGoals">
                        <textarea
                            id="currentProjectGoals"
                            name="currentProjectGoals"
                            value={formData.currentProjectGoals}
                            onChange={handleChange}
                            rows={3}
                            className={commonInputClasses}
                            placeholder="What are the specific goals of the project you're seeking funding for? e.g., 'To build a digital literacy program for seniors, aiming to train 100 individuals in the first year.'"
                        />
                    </FormRow>
                </div>
            </FormSection>

            <motion.button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-primary font-semibold text-night rounded-lg hover:bg-secondary transition-colors duration-300"
                aria-label={buttonText === 'Save & Get Started' ? 'Save your profile and get started with Grantiv' : 'Save your updated profile information'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {buttonText}
            </motion.button>
        </form>
    );
};

export default BusinessProfileForm;