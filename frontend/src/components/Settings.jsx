import React, { useState } from "react";
import Modal from "./Modal";
import TagsManager from "./TagsManager";
import LocationsManager from "./LocationsManager";
import StatusesManager from "./StatusesManager";

export default function Settings({ onClose }) {
  const [activeSection, setActiveSection] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const buttonStyle = {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: 0,
    border: "none",
    backgroundColor: "#4a90e2",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    textAlign: "left",
  };

  const buttonHoverStyle = {
    backgroundColor: "#357ABD",
  };

  // Helper for section header style
  const sectionHeaderStyle = {
    marginTop: "2rem",
    marginBottom: "0.5rem",
    paddingLeft: "1rem",
    fontWeight: "700",
    fontSize: "1.125rem",
    color: "rgb(80, 80, 80)",
    borderBottom: "1px solid #ddd",
  };

  // Helper for container spacing between button groups
  const groupContainerStyle = {
    padding: "0 1rem",
  };

  const renderSection = () => {
    switch (activeSection) {
      case "tags":
        return <TagsManager onClose={() => setActiveSection(null)} />;
      case "locations":
         return <LocationsManager onClose={() => setActiveSection(null)} />;
       case "statuses":
         return <StatusesManager onClose={() => setActiveSection(null)} />;
      // case "account":
      //   return <AccountSettings onClose={() => setActiveSection(null)} />;
      // case "notifications":
      //   return <NotificationSettings onClose={() => setActiveSection(null)} />;
      default:
        return (
          <>
            <div style={{ padding: "1.5rem 2rem" }}>
              <h2
                style={{
                  marginTop: 0,
                  fontWeight: "700",
                  fontSize: "1.75rem",
                  color: "rgb(51, 51, 51)",
                }}
              >
                Settings
              </h2>
            </div>

            {/* Account Section */}
            <div style={groupContainerStyle}>
              <div style={sectionHeaderStyle}>Account</div>
              <button
                style={hoverIndex === 0 ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                onClick={() => setActiveSection("account")}
                onMouseEnter={() => setHoverIndex(0)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                Account / Profile
              </button>
            </div>

            {/* Notifications Section */}
            <div style={groupContainerStyle}>
              <div style={sectionHeaderStyle}>Notifications</div>
              <button
                style={hoverIndex === 1 ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                onClick={() => setActiveSection("notifications")}
                onMouseEnter={() => setHoverIndex(1)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                Notification Preferences
              </button>
            </div>

            {/* Data Management Section */}
            <div style={groupContainerStyle}>
              <div style={sectionHeaderStyle}>Data Management</div>
              <button
                style={hoverIndex === 2 ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                onClick={() => setActiveSection("tags")}
                onMouseEnter={() => setHoverIndex(2)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                Manage Tags
              </button>

              <button
                style={hoverIndex === 3 ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                onClick={() => setActiveSection("locations")}
                onMouseEnter={() => setHoverIndex(3)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                Manage Locations
              </button>

              <button
                style={hoverIndex === 4 ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                onClick={() => setActiveSection("statuses")}
                onMouseEnter={() => setHoverIndex(4)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                Manage Statuses
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <Modal
      onClose={onClose}
      showBackButton={!!activeSection}
      onBack={() => setActiveSection(null)}
      modalStyle={{
        width: "360px",
        height: "60vh",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "6px 6px 0px 0px",
        padding: 0,
        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
        backgroundColor: "#fff",
      }}
    >
      {renderSection()}
    </Modal>
  );
}
