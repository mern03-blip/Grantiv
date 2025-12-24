import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon,
  PaperclipIcon,
  XIcon,
} from "../../../components/icons/Icons"; // Adjust path

const ChatInput = ({
  input,
  setInput,
  onSend,
  isLoading,
  attachments,
  setAttachments,
  placeholder,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files)
      setAttachments((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 sm:p-4 backdrop-blur-sm z-10 transition-colors bg-white/80 dark:bg-dark-surface/80 border-t border-gray-100 dark:border-dark-border">
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          <AnimatePresence>
            {attachments.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-mercury dark:bg-dark-border text-night dark:text-dark-text"
              >
                <span className="truncate max-w-[100px]">{file.name}</span>
                <button
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Attachment Button */}
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-mercury/80 dark:bg-dark-border hover:bg-mercury dark:hover:bg-dark-border/50 text-night/80 dark:text-dark-textMuted"
        >
          <PaperclipIcon className="w-5 h-5" />
        </motion.button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf"
        />

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-sm sm:text-base border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-background border-mercury dark:border-dark-border text-night dark:text-dark-text"
          disabled={isLoading}
        />

        {/* Send Button */}
        <motion.button
          onClick={onSend}
          disabled={isLoading || (!input.trim() && attachments.length === 0)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput;
