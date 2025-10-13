import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// A simple SVG icon component for visual flair. You can replace this with any icon library.
const BriefcaseIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.998a2.25 2.25 0 01-2.25-2.25v-4.07a2.25 2.25 0 01.52-1.42l3.5-4.5a2.25 2.25 0 013.44 0l3.5 4.5a2.25 2.25 0 01.52 1.42zM3 10.5h18M7.5 6.75h.008v.008H7.5V6.75z" />
    </svg>
);

const OrganizationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- Mock Data: Replace this with data from your API ---
    // This is what the `organizations` array from your login response should look like.
    // const dummyOrganizations = [
    //     { id: '635ab123cde4567890abcdef', name: 'Innovate Inc.', role: 'admin' },
    //     { id: '635ab456cde7890123ghijkl', name: 'Quantum Solutions', role: 'member' },
    //     { id: '635ab789cde0123456mnopqr', name: 'Synergy Labs', role: 'reviewer' },
    // ];
    // In your real app, you'd get this from the router's location state.
    const organizations = location.state?.organizations;
    // ----------------------------------------------------

    /**
     * Handles the user's selection.
     * 1. Saves the organization ID to Local Storage.
     * 2. Navigates the user to the main dashboard.
     */
    const handleSelectOrg = (orgId, orgName) => {
        console.log(`Selected Organization: ${orgName} (${orgId})`);

        // Save selected organization
        localStorage.setItem("orgId", orgId);
        localStorage.setItem("orgName", orgName);

        // Check if OrgId exists before navigation
        const storedOrgId = localStorage.getItem("orgId");

        if (storedOrgId) {
            navigate("/"); // ✅ navigate only if OrgId exists
        } else {
            navigate("/organization-page")
        }
    };


    // Handle the case where the user is not part of any organization
    if (!organizations || organizations.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">No Organizations Found</h1>
                <p className="text-gray-600">You are not currently a member of any organization.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">Select Your Workspace</h1>
                <p className="text-lg text-gray-600">Choose the organization you want to work in.</p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                    <div
                        key={org.id}
                        onClick={() => handleSelectOrg(org.id, org.name)}
                        className="group bg-white rounded-xl shadow-md p-6 cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-indigo-500"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                <BriefcaseIcon className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{org.name}</h3>
                            <p className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full">
                                Your Role: {org.role.replace('-', ' ')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="text-center text-gray-500 mt-12">
                <p>You can switch organizations later from your account settings.</p>
            </footer>
        </div>
    );
};

export default OrganizationPage;