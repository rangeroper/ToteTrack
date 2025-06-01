import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Settings as SettingsIcon } from "lucide-react";
import Settings from "./Settings";

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <style>
        {`
          /* ---------- Base Styles ---------- */
          .header-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.5rem;
            background-color: #1e1e2f;
            color: white;
            width: 100%;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .header-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: white;
            gap: 0.5rem;
          }

          .header-icon {
            flex-shrink: 0;
          }

          .header-title {
            font-size: 1.35rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: opacity 0.3s ease;
          }

          .header-nav {
            display: flex;
            align-items: center;
          }

          .settings-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
          }

          .settings-btn:hover {
            color: #4a90e2;
          }

          /* ---------- Mobile (max-width: 600px) ---------- */
          @media (max-width: 600px) {
            .header-title {
              display: none;
            }
          }
        `}
      </style>

      <header className="header-container">
        <Link to="/" className="header-link">
          <Package className="header-icon" size={28} strokeWidth={2.2} />
          <h1 className="header-title">ToteTrack</h1>
        </Link>

        <nav className="header-nav">
          <button
            onClick={() => setShowSettings(true)}
            className="settings-btn"
            aria-label="Open Settings"
            title="Settings"
          >
            <SettingsIcon size={24} strokeWidth={2} />
          </button>
        </nav>

        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </header>
    </>
  );
}
