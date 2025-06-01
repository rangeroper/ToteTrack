import React, { useState } from "react";
import { User, Bell, Tag, MapPin, BarChart } from "lucide-react";
import Modal from "./Modal";
import TagsManager from "./TagsManager";
import LocationsManager from "./LocationsManager";
import StatusesManager from "./StatusesManager";

// import AccountSettings from "./AccountSettings";
// import NotificationSettings from "./NotificationSettings";

export default function Settings({ onClose }) {
  const [activeSection, setActiveSection] = useState(null);

  // Define all sections in one place, now using Lucide icons
  const sections = [
    {
      group: "Account",
      items: [
        {
          key: "account",
          label: "Account / Profile",
          icon: <User size={32} className="card-icon" />,
          component: null, // AccountSettings
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
          component: null, // NotificationSettings
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

  // When a section is active, render its component
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

    // Find and render the chosen section component
    for (const { items } of sections) {
      const match = items.find((item) => item.key === activeSection);
      if (match && match.component) {
        const SectionComp = match.component;
        return <SectionComp onClose={() => setActiveSection(null)} />;
      }
    }

    return null; // no match
  };

  return (
    <>
      <style>
        {`
          /* ----------------------------------------------------
             Container & Header Styles
          ---------------------------------------------------- */
          .settings-header {
            padding: 1.5rem 2rem;
            background-color: #fafafa;
            border-bottom: 1px solid #e0e0e0;
          }
          .settings-header h2 {
            margin: 0;
            font-size: 1.75rem;
            font-weight: 700;
            color: #333;
          }

          /* ----------------------------------------------------
             Section Group Title
          ---------------------------------------------------- */
          .section-group {
            margin-top: 2rem;
            padding: 0 1rem;
          }
          .section-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #505050;
            margin-bottom: 1rem;
            position: relative;
          }
          .section-title::after {
            content: "";
            display: block;
            width: 40px;
            height: 3px;
            background-color: #4a90e2;
            margin-top: 4px;
            border-radius: 2px;
          }

          /* ----------------------------------------------------
             Card‐Style Buttons
          ---------------------------------------------------- */
          .section-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1rem;
          }
          .card-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            cursor: pointer;
            transition: box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
            text-align: center;
          }
          .card-button:hover {
            background-color: #f0f8ff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
          .card-icon {
            color: #4a90e2;
            margin-bottom: 0.5rem;
          }
          .card-label {
            font-size: 1rem;
            font-weight: 600;
            color: #333;
          }

          /* ----------------------------------------------------
             Decorative Footer (SVG Wave)
          ---------------------------------------------------- */
          .settings-footer {
            margin-top: 2rem;
            overflow: hidden; /* ensure wave doesn't overflow */
            line-height: 0;  /* remove extra whitespace */
          }
          .settings-footer svg {
            display: block;
            width: 100%;
            height: 40px;
          }
          .wave-fill {
            fill: #4a90e2;
          }

          /* ----------------------------------------------------
             Modal container override
          ---------------------------------------------------- */
          .settings-modal {
            width: 400px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 8px 8px 0 0;
            padding: 0;
            background-color: #fff;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
          }

          /* ----------------------------------------------------
             Mobile Adaptation (<= 600px)
          ---------------------------------------------------- */
          @media (max-width: 600px) {
            .settings-modal {
              width: 100%;
              height: 100%;
              border-radius: 0;
            }
            .section-group {
              margin-top: 1.5rem;
              padding: 0 0.5rem;
            }
            .section-title {
              font-size: 1rem;
            }
            .section-cards {
              grid-template-columns: 1fr;
              gap: 0.75rem;
            }
            .card-button {
              padding: 0.75rem;
            }
            .card-icon {
              margin-bottom: 0.4rem;
            }
            .card-label {
              font-size: 0.95rem;
            }
            /* Footer wave height scales down a bit on mobile */
            .settings-footer svg {
              height: 30px;
            }
          }
        `}
      </style>

      <Modal
        onClose={onClose}
        showBackButton={!!activeSection}
        onBack={() => setActiveSection(null)}
        modalClass="settings-modal"
      >
        {renderActive()}

        {/* Decorative footer with an SVG wave */}
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
      </Modal>
    </>
  );
}
