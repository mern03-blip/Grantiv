import React from "react";
import { Select } from "antd";

const { Option, OptGroup } = Select;

const ContextSelector = ({ contexts, selectedContext, onSelect }) => {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="p-3  transition-colors dark:bg-dark-surface border-mercury dark:border-dark-border relative z-20">
      <Select
        value={selectedContext?.contextId || "general"}
        onChange={(value) => onSelect(value)}
        //  className="w-full mt-16 lg:mt-0"
        className="w-full"
        size="large"
        placeholder="Select a context"
        style={{
          width: "100%",
        }}
        // Ant Design style overrides for dark mode would typically go in global CSS,
        // but inline style works for quick integration
        popupClassName={isDark ? "dark-dropdown" : ""}
      >
        <OptGroup label="General">
          <Option value="general">General Chat</Option>
        </OptGroup>

        {contexts?.projects?.length > 0 && (
          <OptGroup label="Favorite Projects">
            {contexts.projects.map((p) => (
              <Option
                key={p._id}
                value={p._id}
                data-type="project"
                data-title={p.title}
              >
                {p.title}{" "}
                <span className="text-xs opacity-50 ml-2">(Project)</span>
              </Option>
            ))}
          </OptGroup>
        )}

        {contexts?.grants?.length > 0 && (
          <OptGroup label="Favorite Grants">
            {contexts.grants.map((g) => (
              <Option
                key={g._id}
                value={g._id}
                data-type="grant"
                data-title={g.title}
              >
                {g.title}{" "}
                <span className="text-xs opacity-50 ml-2">(Grant)</span>
              </Option>
            ))}
          </OptGroup>
        )}
      </Select>
    </div>
  );
};

export default ContextSelector;
