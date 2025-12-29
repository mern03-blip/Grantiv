import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleBusinessForm } from '../../api/endpoints/businessform';
import { BriefcaseIcon } from '../icons/Icons';

const OrganizationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loadingOrg, setLoadingOrg] = useState(false);

    // organizations list from login
    const organizations = location.state?.organizations;

    // ✅ Handle organization select
    const handleSelectOrg = async (orgId, orgName, orgRole) => {
        try {
            setLoadingOrg(true);
            console.log(`Selected Organization: ${orgName} (${orgId} ${orgRole})`);

            // Save selected org in localStorage
            localStorage.setItem('orgId', orgId);
            localStorage.setItem('orgName', orgName);
            localStorage.setItem('role', orgRole);

            // ✅ Call API to check organization profile
            const profileData = await handleBusinessForm();

            if (profileData && Object.keys(profileData).length > 0) {
                // If profile exists
                localStorage.setItem('grantiv_onboarding_skipped', 'true');
                console.log('✅ Organization profile found');
                navigate('/');
            } else {
                // If no profile data found
                localStorage.setItem('grantiv_onboarding_skipped', 'false');
                console.log('❌ No organization profile found');
                // navigate('/onboarding');
            }
        } catch (error) {
            // console.error('Error checking organization profile:', error);
            // message.error('Failed to check organization details.');
            localStorage.setItem('grantiv_onboarding_skipped', 'false');
            navigate('/');
        } finally {
            setLoadingOrg(false);
        }
    };

    // Handle if no organization exists
    if (!organizations || organizations.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">No Organizations Found</h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600">You are not currently a member of any organization.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 px-4">Select Your Workspace</h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">Choose the organization you want to work in.</p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-4">
                {organizations.map((org) => (
                    <div
                        key={org.id}
                        onClick={() => !loadingOrg && handleSelectOrg(org.id, org.name, org.role)}
                        className={`group bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 cursor-pointer transform transition-all duration-300 
                                   ${loadingOrg ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl hover:border-mainColor'}
                                   border border-transparent`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-green-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                                <BriefcaseIcon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-mainColor" />
                            </div>
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 break-words w-full">{org.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 capitalize bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                                Your Role: {org.role.replace('-', ' ')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="text-center text-gray-500 mt-8 sm:mt-10 md:mt-12 px-4">
                <p className="text-xs sm:text-sm md:text-base">You can switch organizations later from your account settings.</p>
            </footer>
        </div>
    );
};

export default OrganizationPage;
