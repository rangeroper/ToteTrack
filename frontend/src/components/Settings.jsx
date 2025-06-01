import React, { useState } from "react";
import { User, Bell, Tag, MapPin, BarChart } from "lucide-react";
import Modal from "./Modal";
import TagsManager from "./TagsManager";
import LocationsManager from "./LocationsManager";
import StatusesManager from "./StatusesManager";
import "../components/Settings.css"; // <- import the stylesheet

// import AccountSettings from "./AccountSettings";
// import NotificationSettings from "./NotificationSettings";

export default function Settings({ onClose }) {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      group: "Account",
      items: [
        {
          key: "account",
          label: "Account / Profile",
          icon: <User size={32} className="card-icon" />,
          component: null,
        },
      ],
    },
    {
      group: "Notifications",
      items: [
        {
          key: "notifications",
          label: "Notification Preferences",
          icon: <Bell size={32} className="card-icon" />,
          component: null,
        },
      ],
    },
    {
      group: "Data Management",
      items: [
        {
          key: "tags",
          label: "Manage Tags",
          icon: <Tag size={32} className="card-icon" />,
          component: TagsManager,
        },
        {
          key: "locations",
          label: "Manage Locations",
          icon: <MapPin size={32} className="card-icon" />,
          component: LocationsManager,
        },
        {
          key: "statuses",
          label: "Manage Statuses",
          icon: <BarChart size={32} className="card-icon" />,
          component: StatusesManager,
        },
      ],
    },
  ];

  const renderActive = () => {
    if (!activeSection) {
      return (
        <>
          <div className="settings-header">
            <h2>Settings</h2>
          </div>
          {sections.map(({ group, items }) => (
            <div className="section-group" key={group}>
              <div className="section-title">{group}</div>
              <div className="section-cards">
                {items.map(({ key, label, icon }) => (
                  <div
                    key={key}
                    className="card-button"
                    onClick={() => setActiveSection(key)}
                  >
                    {icon}
                    <div className="card-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      );
    }

    for (const { items } of sections) {
      const match = items.find((item) => item.key === activeSection);
      if (match && match.component) {
        const SectionComp = match.component;
        return <SectionComp onClose={() => setActiveSection(null)} />;
      }
    }

    return null;
  };

  return (
    <Modal
      onClose={onClose}
      showBackButton={!!activeSection}
      onBack={() => setActiveSection(null)}
      modalClass="settings-modal"
    >
      <div className="settings-scrollable-content">
        {renderActive()}
        <div className="settings-footer">
          <svg
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 C300,40 900,-40 1200,0 L1200,40 L0,40 Z"
              className="wave-fill"
            />
          </svg>
        </div>
      </div>
    </Modal>
  );
}