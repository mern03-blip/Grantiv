import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SparklesIcon } from "../../components/icons/Icons";
import ContextSelector from "./components/ContextSelector";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import {
  getCopilotContexts,
  initCopilotSession,
  sendCopilotMessage,
} from "../../api/endpoints/copilot";
import { getSubscriptionStatus } from "../../api/endpoints/payment";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loading/Loader";

const AIAssistant = () => {
  // --- ALL HOOKS MUST COME FIRST (before any conditional returns) ---
  
  // Navigation
  const navigate = useNavigate();

  // --- State ---
  const [currentContext, setCurrentContext] = useState({
    type: "general",
    id: null,
    title: "General Chat",
  });

  const [chatId, setChatId] = useState(null); // The active Mongo DB Chat ID
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Ref for typing effect
  const typingIntervalRef = useRef(null);

  // --- 1. Fetch Subscription Status (MOVED TO TOP) ---
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription-plan"],
    queryFn: getSubscriptionStatus,
  });

  // --- 2. Fetch Available Contexts (Grants/Projects) ---
  const { data: contextsData } = useQuery({
    queryKey: ["copilotContexts"],
    queryFn: getCopilotContexts,
    staleTime: 5 * 60 * 1000,
  });

  // --- 3. Initialize Session Mutation ---
  const initSessionMutation = useMutation({
    mutationFn: initCopilotSession,
    onSuccess: (data) => {
      setChatId(data._id);
      // Map database messages to UI format
      const history = data.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      setMessages(history);

      // If new chat, add welcome message locally
      if (history.length === 0) {
        const welcomeText =
          currentContext.type === "general"
            ? "Hi! I'm Grantiv Copilot. How can I help you today?"
            : `I'm ready to help you with **${currentContext.title}**. What do you need?`;

        setMessages([{ role: "assistant", content: welcomeText }]);
      }
    },
  });

  // --- 4. Send Message Mutation ---
  const sendMessageMutation = useMutation({
    mutationFn: sendCopilotMessage,
    onSuccess: (data) => {
      // Data is the complete AI response object { role: 'assistant', content: '...' }
      simulateTypingEffect(data.content);
    },
    onError: () => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error." },
      ]);
    },
  });

  // --- 5. Effects ---
  // When context changes (user selects dropdown), init session
  useEffect(() => {
    initSessionMutation.mutate({
      contextType: currentContext.type,
      contextId: currentContext.id,
      contextTitle: currentContext.title,
    });
    // Cleanup typing interval on switch
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setIsTyping(false);
  }, [currentContext.id, currentContext.type]);

  // --- NOW WE CAN USE CONDITIONAL LOGIC (after all hooks) ---
  
  const plan = subscriptionData?.plan || "free";

  // Show loader while checking subscription
  if (isLoadingSubscription) {
    return <Loader />;
  }

  // --- Helper Components ---
  const UpgradeNotice = ({ featureName, onUpgrade }) => (
    <div className="text-center p-4 sm:p-6 md:p-8 bg-mercury/30 dark:bg-dark-surface/50 rounded-lg border-2 border-dashed border-mercury/80 dark:border-dark-border max-w-2xl mx-auto">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-night dark:text-dark-text">
        {featureName}
      </h2>
      <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mt-2 mb-3 sm:mb-4">
        Chatting with Grantiv Copilot is a premium feature. Upgrade your
        plan to unlock powerful collaboration tools.
      </p>
      <button
        onClick={onUpgrade}
        className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-primary text-night rounded-lg hover:bg-secondary transition-colors"
      >
        View Subscription Plans
      </button>
    </div>
  );

  // --- Handlers ---

  const handleContextSelect = (value) => {
    if (value === "general") {
      setCurrentContext({ type: "general", id: null, title: "General Chat" });
      return;
    }

    // Find the object in projects or grants
    const project = contextsData?.projects?.find((p) => p._id === value);
    if (project) {
      setCurrentContext({
        type: "project",
        id: project._id,
        title: project.title,
      });
      return;
    }

    const grant = contextsData?.grants?.find((g) => g._id === value);
    if (grant) {
      setCurrentContext({ type: "grant", id: grant._id, title: grant.title });
    }
  };

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;

    // 1. Add User Message Locally
    // Note: If you have attachments, you might want to upload them first
    // or include their names in the text sent to AI.
    let contentToSend = input;
    if (attachments.length > 0) {
      contentToSend += `\n[Attachments: ${attachments
        .map((f) => f.name)
        .join(", ")}]`;
    }

    const newUserMsg = { role: "user", content: contentToSend };
    setMessages((prev) => [...prev, newUserMsg]);

    setInput("");
    setAttachments([]);
    setIsTyping(true);

    // 2. Call API
    sendMessageMutation.mutate({
      chatId,
      message: contentToSend,
    });
  };

  const simulateTypingEffect = (fullText) => {
    let index = 0;
    // Add an empty assistant message to fill
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    typingIntervalRef.current = setInterval(() => {
      setMessages((prev) => {
        const newHistory = [...prev];
        const lastMsg = newHistory[newHistory.length - 1];
        lastMsg.content = fullText.substring(0, index + 1);
        return newHistory;
      });

      index++;
      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 15); // Speed of typing
  };

  // --- Render ---

  // Background Pattern
  const lightPattern = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgODAwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNFMkRGREUiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTcuMiA3LjJsNzE3LjIgNzE3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03MjQuNCA3LjJMNy4yIDcyNC40IiBvcGFjaXR5PSIuMTUiLz48cGF0aCBkPSJNNTAzLjIgNzI0LjRMMjIzLjIgNDQ0LjQiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0yOTUuNiA3LjJMNTc1LjYgMjg3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03OTIuOCAzOTIuOGMwLTIxNy0xNzUuMi0zOTIuOC0zOTIuOC0zOTIuOCIgb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNNy4yIDM5Mi44YzAtMjE3IDE3NS4yLTM5Mi44IDM5Mi44LTM5Mi44IiBvcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')`;
  const darkPattern = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgODAwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzYTNkNDAiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTcuMiA3LjJsNzE3LjIgNzE3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03MjQuNCA3LjJMNy4yIDcyNC40IiBvcGFjaXR5PSIuMTUiLz48cGF0aCBkPSJNNTAzLjIgNzI0LjRMMjIzLjIgNDQ0LjQiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0yOTUuNiA3LjJMNTc1LjYgMjg3LjIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik03OTIuOCAzOTIuOGMwLTIxNy0xNzUuMi0zOTIuOC0zOTIuOC0zOTIuOCIgb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJNNy4yIDM5Mi44YzAtMjE3IDE3NS4yLTM5Mi44IDM5Mi44LTM5Mi44IiBvcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')`;

  // Show upgrade notice if not on pro plan
   if (plan !== "pro" && plan !== "enterprise" && plan !== "starter") {
    return (
      <div className="p-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-night dark:text-dark-text mb-2 font-heading">
          AI-Assistant
        </h2>
        <p className="text-sm sm:text-base text-night/60 dark:text-dark-textMuted mb-6 sm:mb-8">
          This is where you can chat with Grantiv Copilot to get assistance
          with your grants and projects.
        </p>
        <UpgradeNotice
          featureName="AI-Assistant"
          onUpgrade={() => navigate("/settings")}
        />
      </div>
    );
  }

  // Main chat interface for pro users
  return (
    <div className="relative flex h-[100vh] transition-colors bg-alabaster dark:bg-dark-background text-night dark:text-dark-text">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(168, 221, 107, 0.25) 0%, transparent 60%), ${
            document.documentElement.classList.contains("dark")
              ? darkPattern
              : lightPattern
          }`,
          backgroundSize: "cover, auto",
        }}
      />

      <motion.main className="flex-1 flex flex-col min-h-0 relative z-10">
        {/* 1. Context Selector (Sidebar/Header) */}
        <ContextSelector
          contexts={contextsData}
          selectedContext={currentContext}
          onSelect={handleContextSelect}
        />

        {/* 2. Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Welcome Intro (Only if no messages yet) */}
          {messages.length === 0 && !initSessionMutation.isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-50">
              <SparklesIcon className="w-16 h-16 mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Grantiv Copilot</h2>
              <p>Select a context to start chatting</p>
            </div>
          )}

          {/* Messages */}
          <MessageList
            messages={messages}
            isLoading={
              isTyping ||
              sendMessageMutation.isPending ||
              initSessionMutation.isPending
            }
          />

          {/* 3. Input Area */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isTyping || sendMessageMutation.isPending}
            attachments={attachments}
            setAttachments={setAttachments}
            placeholder={
              currentContext.type === "general"
                ? "Ask a general question..."
                : `Ask about ${currentContext.title}...`
            }
          />
        </div>
      </motion.main>
    </div>
  );
};

export default AIAssistant;