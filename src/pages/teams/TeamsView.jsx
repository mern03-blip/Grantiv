import React, { useState } from 'react';
import { MOCK_TEAM, MOCK_TEAM_CHAT_MESSAGES } from '../../../constants';
import { UsersIcon, XIcon, PaperAirplaneIcon } from '../../components/icons/Icons';
import { TeamChat } from '../../components/collaborationtools/CollaborationTools';
import { inviteMember } from '../../api/endpoints/invitation';
import { useQuery } from '@tanstack/react-query';
import { getOrganizationMembers } from '../../api/endpoints/teams';
import Loader from '../../components/loading/Loader';

const UpgradeNotice = ({ featureName, onUpgrade }) => (
    <div className="text-center p-8 bg-mercury/30 dark:bg-dark-surface/50 rounded-lg border-2 border-dashed border-mercury/80 dark:border-dark-border max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold font-heading text-night dark:text-dark-text">{featureName}</h2>
        <p className="text-night/60 dark:text-dark-textMuted mt-2 mb-4">Managing teams and assigning roles is a premium feature. Upgrade your plan to unlock powerful collaboration tools.</p>
        <button onClick={onUpgrade} className="px-5 py-2.5 text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors">
            View Subscription Plans
        </button>
    </div>
);


const TeamsView = ({ plan, isDemoMode, navigateTo }) => {
    // const [team, setTeam] = useState(MOCK_TEAM);
    const [inviteEmail, setInviteEmail] = useState('');
    const [chatMessages, setChatMessages] = useState(MOCK_TEAM_CHAT_MESSAGES);

    const [inviteRole, setInviteRole] = useState("Member");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const organizationId = localStorage.getItem('orgId');

    // ✅ React Query to fetch members
    const {
        data: team,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['organizationMembers', organizationId],
        queryFn: () => getOrganizationMembers(organizationId),
        enabled: !!organizationId, // Only run if orgId exists
    });

    // ✅ Handle send invite button
    const handleSendInvite = async () => {
        try {
            setLoading(true);
            setMessage("");

            // 1️⃣ Get organizationId from localStorage
            const organizationId = localStorage.getItem("orgId");
            if (!organizationId) {
                setMessage("Organization ID not found.");
                setLoading(false);
                return;
            }

            // 2️⃣ Call imported inviteMember function
            const response = await inviteMember(organizationId, {
                email: inviteEmail,
                role: inviteRole,
            });

            console.log("✅ Invite Response:", response);
            setMessage("Invitation sent successfully!");

            // Reset form
            setInviteEmail("");
            setInviteRole("member");
        } catch (error) {
            console.error("❌ Error inviting member:", error);
            setMessage(error.message || "Failed to send invitation. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <Loader />;

    if (isError)
        return (
            <div className="text-center text-red-500">
                Failed to load team members: {error.message}
            </div>
        );


    const handleRoleChange = (memberId, newRole) => {
        setTeam(team.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    const handleRemoveMember = (memberId) => {
        setTeam(team.filter(m => m.id !== memberId));
    };

    const handleSendMessage = (text) => {
        const newMessage = {
            id: `msg${Date.now()}`,
            memberId: 't1', // Mocking current user as Jane Doe
            text,
            timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, newMessage]);
    };

    if (plan === 'Starter' && !isDemoMode) {
        return (
            <div>
                <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">Teams</h2>
                <p className="text-night/60 dark:text-dark-textMuted mb-8">This is where you would manage your team members, roles, and permissions.</p>
                <UpgradeNotice featureName="Team Management" onUpgrade={() => navigateTo('settings')} />
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">Teams & Collaboration</h2>
            <p className="text-night/60 dark:text-dark-textMuted mb-8">Manage your team members and collaborate in real-time.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Team Chat */}
                <div className="lg:col-span-1 h-full">
                    <TeamChat
                        plan={plan}
                        isDemoMode={isDemoMode}
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        navigateToSettings={() => navigateTo('settings')}
                    />
                </div>

                {/* Right Column: Management */}
                <div className="lg:col-span-1 space-y-8">
                    {/* <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
                        <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text mb-4">Team Members ({team.length})</h3>
                        <div className="space-y-3">
                            {team.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-background/50">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-night dark:text-dark-text">{member.name}</p>
                                            <p className="text-sm text-night/60 dark:text-dark-textMuted">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                            className="text-sm border-mercury/80 dark:border-dark-border rounded-md focus:ring-primary focus:border-primary text-night bg-white dark:bg-dark-surface dark:text-dark-text py-1.5 pl-2 pr-7"
                                        >
                                            <option>admin</option>
                                            <option>lead-Writer</option>
                                            <option>financials</option>
                                            <option>reviewer</option>
                                            <option>member</option>
                                        </select>
                                        <button onClick={() => handleRemoveMember(member.id)} className="p-2 text-night/50 dark:text-dark-textMuted/70 hover:text-red-500 dark:hover:text-red-400" aria-label={`Remove ${member.name}`}>
                                            <XIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
                        <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text mb-4">
                            Team Members ({team?.length || 0})
                        </h3>
                        <div className="space-y-3">
                            {team?.map((member, index) => (
                                <div
                                    key={member?.id || index}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-background/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={member?.avatar || '/default-avatar.png'}
                                            alt={member?.name || "N/A"}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold text-night dark:text-dark-text">{member?.name || "N/A"}</p>
                                            <p className="text-sm text-night/60 dark:text-dark-textMuted">{member?.role || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
                        <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text mb-4">
                            Invite New Member
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label
                                    htmlFor="inviteEmail"
                                    className="text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1 block"
                                >
                                    Email address
                                </label>
                                <input
                                    id="inviteEmail"
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full p-2 border border-mercury dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="inviteRole"
                                    className="text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1 block"
                                >
                                    Role
                                </label>
                                <select
                                    id="inviteRole"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full p-2 border border-mercury dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
                                >
                                    <option>admin</option>
                                    <option>lead-writer</option>
                                    <option>financials</option>
                                    <option>reviewer</option>
                                    <option>member</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSendInvite}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                {loading ? "Sending..." : "Send Invite"}
                            </button>

                            {message && (
                                <p className="text-sm text-center mt-2 text-night dark:text-dark-textMuted">
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TeamsView;


// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { UsersIcon, XIcon, PaperAirplaneIcon } from '../../components/icons/Icons';
// import { TeamChat } from '../../components/collaborationtools/CollaborationTools';
// import { inviteMember } from '../../api/endpoints/invitation';
// import Loader from '../../components/loading/Loader'; // Optional loader if you have one
// import { getOrganizationMembers } from '../../api/endpoints/teams';

// const UpgradeNotice = ({ featureName, onUpgrade }) => (
//     <div className="text-center p-8 bg-mercury/30 dark:bg-dark-surface/50 rounded-lg border-2 border-dashed border-mercury/80 dark:border-dark-border max-w-2xl mx-auto">
//         <h2 className="text-2xl font-bold font-heading text-night dark:text-dark-text">{featureName}</h2>
//         <p className="text-night/60 dark:text-dark-textMuted mt-2 mb-4">
//             Managing teams and assigning roles is a premium feature. Upgrade your plan to unlock powerful collaboration tools.
//         </p>
//         <button
//             onClick={onUpgrade}
//             className="px-5 py-2.5 text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors"
//         >
//             View Subscription Plans
//         </button>
//     </div>
// );

// const TeamsView = ({ plan, isDemoMode, navigateTo }) => {
//     const [inviteEmail, setInviteEmail] = useState('');
//     const [inviteRole, setInviteRole] = useState('member');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');

//     const organizationId = localStorage.getItem('orgId');

//     // ✅ React Query to fetch members
//     const {
//         data: team,
//         isLoading,
//         isError,
//         error,
//         refetch,
//     } = useQuery({
//         queryKey: ['organizationMembers', organizationId],
//         queryFn: () => getOrganizationMembers(organizationId),
//         enabled: !!organizationId, // Only run if orgId exists
//     });

//     // ✅ Handle send invite button
//     const handleSendInvite = async () => {
//         try {
//             setLoading(true);
//             setMessage('');

//             if (!organizationId) {
//                 setMessage('Organization ID not found.');
//                 setLoading(false);
//                 return;
//             }

//             const response = await inviteMember(organizationId, {
//                 email: inviteEmail,
//                 role: inviteRole,
//             });

//             console.log('✅ Invite Response:', response);
//             setMessage('Invitation sent successfully!');

//             setInviteEmail('');
//             setInviteRole('member');

//             // Refetch updated members list
//             refetch();
//         } catch (error) {
//             console.error('❌ Error inviting member:', error);
//             setMessage(error.message || 'Failed to send invitation. Try again.');
//         } finally {
//             setLoading(false);
//         }
//     };



//     if (plan === 'Starter' && !isDemoMode) {
//         return (
//             <div>
//                 <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">Teams</h2>
//                 <p className="text-night/60 dark:text-dark-textMuted mb-8">
//                     This is where you would manage your team members, roles, and permissions.
//                 </p>
//                 <UpgradeNotice featureName="Team Management" onUpgrade={() => navigateTo('settings')} />
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">Teams & Collaboration</h2>
//             <p className="text-night/60 dark:text-dark-textMuted mb-8">
//                 Manage your team members and collaborate in real-time.
//             </p>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//                 {/* Left Column: Team Chat */}
//                 <div className="lg:col-span-1 h-full">
//                     <TeamChat
//                         plan={plan}
//                         isDemoMode={isDemoMode}
//                         messages={[]}
//                         onSendMessage={() => { }}
//                         navigateToSettings={() => navigateTo('settings')}
//                     />
//                 </div>

//                 {/* Right Column: Management */}
//                 <div className="lg:col-span-1 space-y-8">
//                     {/* ✅ Team Members Section */}
//                     <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
//                         <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text mb-4">
//                             Team Members ({team?.length || 0})
//                         </h3>
//                         <div className="space-y-3">
//                             {team?.map((member, index) => (
//                                 <div
//                                     key={member?.id || index}
//                                     className="flex items-center justify-between p-3 rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-background/50"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <img
//                                             src={member?.avatar || '/default-avatar.png'}
//                                             alt={member?.name || "N/A"}
//                                             className="w-10 h-10 rounded-full"
//                                         />
//                                         <div>
//                                             <p className="font-semibold text-night dark:text-dark-text">{member?.name || "N/A"}</p>
//                                             <p className="text-sm text-night/60 dark:text-dark-textMuted">{member?.role || "N/A"}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ✅ Invite New Member Section */}
//                     <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
//                         <h3 className="text-lg font-bold font-heading text-night dark:text-dark-text mb-4">
//                             Invite New Member
//                         </h3>
//                         <div className="space-y-3">
//                             <div>
//                                 <label
//                                     htmlFor="inviteEmail"
//                                     className="text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1 block"
//                                 >
//                                     Email address
//                                 </label>
//                                 <input
//                                     id="inviteEmail"
//                                     type="email"
//                                     value={inviteEmail}
//                                     onChange={(e) => setInviteEmail(e.target.value)}
//                                     placeholder="name@company.com"
//                                     className="w-full p-2 border border-mercury dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
//                                 />
//                             </div>

//                             <div>
//                                 <label
//                                     htmlFor="inviteRole"
//                                     className="text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1 block"
//                                 >
//                                     Role
//                                 </label>
//                                 <select
//                                     id="inviteRole"
//                                     value={inviteRole}
//                                     onChange={(e) => setInviteRole(e.target.value)}
//                                     className="w-full p-2 border border-mercury dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
//                                 >
//                                     <option>admin</option>
//                                     <option>lead-writer</option>
//                                     <option>financials</option>
//                                     <option>reviewer</option>
//                                     <option>member</option>
//                                 </select>
//                             </div>

//                             <button
//                                 onClick={handleSendInvite}
//                                 disabled={loading}
//                                 className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
//                             >
//                                 <PaperAirplaneIcon className="w-5 h-5" />
//                                 {loading ? 'Sending...' : 'Send Invite'}
//                             </button>

//                             {message && (
//                                 <p className="text-sm text-center mt-2 text-night dark:text-dark-textMuted">{message}</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TeamsView;
