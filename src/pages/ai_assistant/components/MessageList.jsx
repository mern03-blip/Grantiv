import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon } from "../../../components/icons/Icons"; // Adjust path

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <AnimatePresence mode="popLayout">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0 mb-1" />
            )}

            <div
              className={`max-w-[85%] sm:max-w-lg p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-white dark:bg-dark-surface text-night dark:text-dark-text rounded-bl-none border border-gray-100 dark:border-dark-border shadow-sm"
              }`}
            >
              {/* Note: In a real app, use a library like react-markdown here */}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {/* Basic Bold Rendering */}
                {msg.content
                  .split("**")
                  .map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-start items-end gap-2">
          <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0 mb-1" />
          <div className="p-3 bg-white dark:bg-dark-surface rounded-xl rounded-bl-none border border-gray-100">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
