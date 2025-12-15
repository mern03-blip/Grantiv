import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardView from './DashboardView';
import DashboardOnboarding from './components/DashboardOnboarding';

const Dashboard = () => {
    const navigate = useNavigate();
    const [profileComplete] = useState(false); 
    const [grantFound] = useState(false);
    const [projectStarted] = useState(false);
    
    // Initialize hasSkippedOnboarding by reading from localStorage immediately
    const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState(() => {
        const skippedValue = localStorage.getItem('dashboard-onboarding-skipped');
        return skippedValue === 'true';
    });

    // Mock props data for DashboardView
    const mockMyGrants = [];
    const mockSavedGrants = [];
    const mockTasks = [];
    const mockBusinessProfile = { organizationName: 'Mock Business Co.', industry: 'Technology' };

    // --- Navigation Handlers ---
    const handleNavigate = (view) => {
        switch(view) {
            case 'settings':
                navigate('/settings');
                break;
            case 'find_grants':
                navigate('/find-grants');
                break;
            case 'ai_assistant':
                navigate('/ai-assistant');
                break;
            default:
                break;
        }
    };

    const handleAddGrant = () => {
        navigate('/my-grants');
    };

    const handleSkip = () => {
        localStorage.setItem('dashboard-onboarding-skipped', 'true');
        setHasSkippedOnboarding(true);
    };

    // --- Mock Interaction Handlers ---
    const handleViewApplication = (grant) => {
        console.log('View application:', grant);
        // navigate(`/my-grants/${grant.id}`);
    };

    const handleSelectGrant = (grant, matchPercentage) => {
        console.log('Select grant:', grant, matchPercentage);
        // navigate(`/grants/${grant.id}`);
    };

    const handleToggleTask = (taskId) => {
        console.log('Toggle task:', taskId);
        // Logic to update tasks state goes here
    };

    // --- Conditional Rendering Logic ---
    const allStepsComplete = profileComplete && grantFound && projectStarted;
    const shouldShowDashboard = allStepsComplete || hasSkippedOnboarding;

    if (shouldShowDashboard) {
        return (
            <DashboardView
                onNavigate={handleNavigate}
                onViewApplication={handleViewApplication}
                onAddGrant={handleAddGrant}
                myGrants={mockMyGrants}
                savedGrants={mockSavedGrants}
                tasks={mockTasks}
                onRequestToggleTask={handleToggleTask}
                businessProfile={mockBusinessProfile}
                handleSelectGrant={handleSelectGrant}
                hasSkippedDashboardOnboarding={hasSkippedOnboarding}
                onSkipDashboardOnboarding={handleSkip}
            />
        );
    }

    return (
        <DashboardOnboarding
            onNavigate={handleNavigate}
            onAddGrant={handleAddGrant}
            isProfileComplete={profileComplete}
            isGrantFound={grantFound}
            isProjectStarted={projectStarted}
            onSkip={handleSkip}
        />
    );
};

export default Dashboard;