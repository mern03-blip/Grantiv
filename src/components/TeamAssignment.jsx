import React from 'react';
import { XIcon } from './icons/Icons';

export const TeamAssignment = ({ grant, allTeamMembers, onUpdateGrant }) => {

    const assignedMembers = allTeamMembers?.filter(m => grant.assignedTeamMemberIds?.includes(m.id)) || [];
    const unassignedMembers = allTeamMembers?.filter(m => !grant.assignedTeamMemberIds?.includes(m.id)) || [];

    const handleAssign = (memberId) => {
        if (!memberId) return;
        const newAssignedIds = [...(grant.assignedTeamMemberIds || []), memberId];
        onUpdateGrant({ ...grant, assignedTeamMemberIds: newAssignedIds });
    };

    const handleUnassign = (memberId) => {
        const newAssignedIds = (grant.assignedTeamMemberIds || []).filter(id => id !== memberId);
        onUpdateGrant({ ...grant, assignedTeamMemberIds: newAssignedIds });
    };

    return (
        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-mercury dark:border-dark-border">
            <h3 className="text-lg font-bold text-night dark:text-dark-text font-heading mb-4">Assigned Team</h3>
            <div className="space-y-3 mb-4">
                {assignedMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-mercury/30 dark:hover:bg-dark-background/50 group">
                        <div className="flex items-center gap-3">
                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="font-medium text-sm text-night dark:text-dark-text">{member.name}</p>
                                <p className="text-xs text-night/60 dark:text-dark-textMuted">{member.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleUnassign(member.id)}
                            className="text-night/40 dark:text-dark-textMuted/60 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Unassign ${member.name}`}
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {assignedMembers.length === 0 && (
                    <p className="text-sm text-center text-night/50 dark:text-dark-textMuted py-4">No team members assigned.</p>
                )}
            </div>

            {unassignedMembers.length > 0 && (
                <div>
                    <label htmlFor="assign-member" className="block text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1">Assign a member</label>
                    <select
                        id="assign-member"
                        value=""
                        onChange={(e) => handleAssign(e.target.value)}
                        className="w-full p-2 border border-mercury dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
                    >
                        <option value="" disabled>Select a team member...</option>
                        {unassignedMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

