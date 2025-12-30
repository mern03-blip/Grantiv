import React, { useEffect, useState } from "react";
import { MOCK_TEAM_CHAT_MESSAGES } from "../../../constants";
import { XIcon, PaperAirplaneIcon } from "../../components/icons/Icons";
import { inviteMember } from "../../api/endpoints/invitation";
import { useQuery } from "@tanstack/react-query";
import {
  deleteMember,
  getOrganizationMembers,
  updateMemberRole,
} from "../../api/endpoints/teams";
import Loader from "../../components/loading/Loader";
import { Placeholder } from "../../assets/image";
import { jwtDecode } from "jwt-decode";
import { TeamChat } from "./components/TeamChat";
import DeleteUserModal from "../../components/modals/DeleteUserModal";
import { useNavigate } from "react-router-dom";
import { getSubscriptionStatus } from "../../api/endpoints/payment";

const UpgradeNotice = ({ featureName, onUpgrade }) => (
  <div className="text-center p-4 sm:p-6 md:p-8 bg-mercury/30 dark:bg-dark-surface/50 rounded-lg border-2 border-dashed border-mercury/80 dark:border-dark-border max-w-2xl mx-auto">
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-night dark:text-dark-text">
      {featureName}
    </h2>
    <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mt-2 mb-3 sm:mb-4">
      Managing teams and assigning roles is a premium feature. Upgrade your plan
      to unlock powerful collaboration tools.
    </p>
    <button
      onClick={onUpgrade}
      className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors"
    >
      View Subscription Plans
    </button>
  </div>
);

const TeamsView = ({ isDemoMode, navigateTo }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [chatMessages, setChatMessages] = useState(MOCK_TEAM_CHAT_MESSAGES);
  const [inviteRole, setInviteRole] = useState("Member");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const organizationId = localStorage.getItem("orgId");
  const navigate = useNavigate();

  // --- 1. Fetch Subscription Status (MOVED TO TOP) ---
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery(
    {
      queryKey: ["subscription-plan"],
      queryFn: getSubscriptionStatus,
    }
  );

  // ✅ React Query to fetch members
  const {
    data: team,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organizationMembers", organizationId],
    queryFn: () => getOrganizationMembers(organizationId),
    enabled: !!organizationId, // Only run if orgId exists
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      // The user ID is often stored in 'id' or 'sub' field of the token
      setCurrentUser({
        _id: decodedToken.id,
        name: decodedToken.name /* add other user fields */,
      });
    }
  }, []);

  // ✅ Handle send invite button
  const handleSendInvite = async () => {
    try {
      setLoading(true);
      setMessage("");

      // 1️⃣ Get organizationId from localStorage
      const organizationId = localStorage.getItem("orgId");
      // console.log(organizationId);

      if (!organizationId) {
        setMessage("Organization ID not found.");
        setLoading(false);
        return;
      }

      // 2️⃣ Call imported inviteMember function
      const response = await inviteMember(organizationId, {
        email: inviteEmail,
        role: inviteRole,
        organizationId,
        userId,
      });

      console.log("✅ Invite Response:", response);
      setMessage("Invitation sent successfully!");

      // Reset form
      setInviteEmail("");
      // setInviteRole("member");
    } catch (error) {
      console.error("❌ Error inviting member:", error);
      setMessage(error.message || "Failed to send invitation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      // Optional: show loading feedback if needed
      console.log(`Updating role for member ${memberId} to ${newRole}`);

      // ✅ Call backend function
      await updateMemberRole(memberId, newRole);

      // ✅ Locally update state (for instant UI update)
      refetch(); // or if using local state → update directly
    } catch (error) {
      console.error("❌ Failed to update member role:", error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      console.log("Removing member:", memberId);

      await deleteMember(memberId);

      // Refetch updated list
      refetch();

      console.log("✅ Member removed successfully");
    } catch (error) {
      console.error("❌ Failed to remove member:", error);
    }
  };

  // const handleSendMessage = (text) => {
  //   const newMessage = {
  //     id: `msg${Date.now()}`,
  //     memberId: "t1", // Mocking current user as Jane Doe
  //     text,
  //     timestamp: new Date().toISOString(),
  //   };
  //   setChatMessages((prev) => [...prev, newMessage]);
  // };

  const plan = subscriptionData?.plan || "free";


  // Show loader while checking subscription
  if (isLoadingSubscription) {
    return <Loader />;
  }

  if (plan !== "pro" && plan !== "enterprise") {
    return (
      <div className="p-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
          Teams
        </h2>
        <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">
          This is where you would manage your team members, roles, and
          permissions.
        </p>
        <UpgradeNotice
          featureName="Team Management"
          onUpgrade={() => navigate("/settings")}
        />
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="text-center text-red-500">
        Failed to load team members: {error.message}
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
        Teams & Collaboration
      </h2>
      <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">
        Manage your team members and collaborate in real-time.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
        {/* Left Column: Team Chat */}
        <div className="lg:col-span-1 h-full">
          <TeamChat currentUser={currentUser} selectedOrgId={organizationId} />
        </div>

        {/* Right Column: Management */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-dark-surface p-4 sm:p-5 md:p-6 rounded-lg border border-mercury dark:border-dark-border">
            <h3 className="text-base sm:text-lg font-bold font-heading text-night dark:text-dark-text mb-3 sm:mb-4">
              Team Members ({team.length})
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {team.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-mercury/50 dark:hover:bg-dark-background/50"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={member.avatar || Placeholder}
                      alt={member.user.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-night dark:text-dark-text">
                        {member.user.name}
                      </p>
                      <p className="text-xs sm:text-sm text-night/60 dark:text-dark-textMuted">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {(() => {
                    // ✅ Get logged-in user role from localStorage
                    const currentUserRole = localStorage.getItem("Role");

                    // ✅ Show only if logged-in user is admin
                    if (currentUserRole === "admin") {
                      return (
                        <div className="flex items-center gap-1 sm:gap-2">
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleRoleChange(member.user._id, e.target.value)
                            }
                            disabled={member.role === "admin"} // disable dropdown for admin members
                            className={`text-xs sm:text-sm border-mercury/80 dark:border-dark-border rounded-md focus:ring-primary focus:border-primary text-night bg-white dark:bg-dark-surface dark:text-dark-text py-1 sm:py-1.5 pl-1.5 sm:pl-2 pr-6 sm:pr-7 
                                                        ${
                                                          member.role ===
                                                          "admin"
                                                            ? "cursor-not-allowed opacity-60"
                                                            : ""
                                                        }`}
                          >
                            <option>admin</option>
                            <option>lead-writer</option>
                            <option>financials</option>
                            <option>reviewer</option>
                            <option>member</option>
                          </select>

                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={member.role === "admin"}
                            className={`p-1.5 sm:p-2 text-night/50 dark:text-dark-textMuted/70 hover:text-red-500 dark:hover:text-red-400 
                                                        ${
                                                          member.role ===
                                                          "admin"
                                                            ? "cursor-not-allowed opacity-60 hover:text-night/50 dark:hover:text-dark-textMuted/70"
                                                            : ""
                                                        }`}
                            aria-label={`Remove ${member.name}`}
                          >
                            <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          <DeleteUserModal
                            open={isDeleteModalOpen}
                            memberName={selectedMember?.user?.name}
                            text={"Are you sure you want to delete this user?"}
                            handleCancel={() => setIsDeleteModalOpen(false)}
                            handleOk={() => {
                              if (selectedMember) {
                                handleRemoveMember(selectedMember.user._id);
                                setIsDeleteModalOpen(false);
                              }
                            }}
                          />
                        </div>
                      );
                    }

                    // ✅ If user is not admin → return nothing (hide completely)
                    return null;
                  })()}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-dark-surface p-4 sm:p-5 md:p-6 rounded-lg border border-mercury dark:border-dark-border">
            <h3 className="text-base sm:text-lg font-bold font-heading text-night dark:text-dark-text mb-3 sm:mb-4">
              Invite New Member
            </h3>
            <div className="space-y-2.5 sm:space-y-3">
              <div>
                <label
                  htmlFor="inviteEmail"
                  className="text-xs sm:text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1 block"
                >
                  Email address
                </label>
                <input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-2 sm:p-2.5 text-sm sm:text-base border border-mercury dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
                />
              </div>

              <div>
                <label
                  htmlFor="inviteRole"
                  className="text-xs sm:text-sm font-medium text-night/80 dark:text-dark-textMuted mb-1 block"
                >
                  Role
                </label>
                <select
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2 sm:p-2.5 text-sm sm:text-base border border-mercury dark:border-dark-border rounded-lg focus:ring-primary focus:outline-none bg-white dark:bg-dark-background dark:text-dark-text"
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
                className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 text-sm sm:text-base bg-primary text-night font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {loading ? "Sending..." : "Send Invite"}
              </button>

              {message && (
                <p className="text-xs sm:text-sm text-center mt-2 text-night dark:text-dark-textMuted">
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
