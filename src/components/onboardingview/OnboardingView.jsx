import React from 'react';
import { GrantivLogo } from '../icons/Icons';
import BusinessProfileForm from '../businessprofileform/BusinessProfileForm';


const OnboardingView = ({ onSave, onSkip }) => (
    <div className="flex items-center justify-center min-h-screen bg-alabaster dark:bg-dark-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl w-full bg-white dark:bg-dark-surface p-8 md:p-12 rounded-2xl shadow-lg border border-mercury/50 dark:border-dark-border">
            <GrantivLogo className="h-10 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-center font-heading text-night dark:text-dark-text">Welcome to Grantiv!</h1>
            <p className="text-center text-night/70 dark:text-dark-textMuted mt-2 mb-8">Let's get started by setting up your profile. This helps our AI find the perfect grants for you.</p>
            <BusinessProfileForm  buttonText="Save & Get Started" />
            <div className="text-center mt-6">
                <button
                    onClick={onSkip}
                    className="text-sm text-night/60 dark:text-dark-textMuted hover:text-night dark:hover:text-dark-text hover:underline transition-colors"
                    aria-label="Skip profile setup and continue to the app"
                >
                    I'll do this later, skip for now
                </button>
            </div>
        </div>
    </div>
);

export default OnboardingView;