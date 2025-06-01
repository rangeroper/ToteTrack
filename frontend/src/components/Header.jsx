import React, { useState } from "react";
import { Link } from "react-router-dom";
import Settings from "./Settings"; // adjust if needed

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <style>
        {`
          /* ---------- Desktop / Default Styles ---------- */
          .header-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background-color: #282c34;
            color: white;
            box-sizing: border-box;
            width: 100%;
          }

          .header-link {
            text-decoration: none;
            color: white;
            display: flex;
            align-items: center;
            flex-shrink: 1;
            min-width: 0;
          }

          .header-icon {
            font-weight: bold;
            font-size: 1.5rem;
            margin-right: 0.5rem;
          }

          .header-title {
            margin: 0;
            font-size: 1.25rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            flex-grow: 1;
            min-width: 0;
          }

          .header-nav {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            /* NO flex-basis here */
          }

          .settings-btn {
            background-color: transparent;
            border: 1px solid white;
            border-radius: 4px;
            color: white;
            padding: 0.3rem 0.8rem;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
          }

          /* ---------- Mobile Styles (max-width: 600px) ---------- */
          @media (max-width: 600px) {
            .header-container {
              flex-direction: column;
              align-items: flex-start;
            }
            .header-title {
              font-size: 1rem;
              white-space: normal;
              overflow: visible;
            }
            .header-nav {
              width: 100%;
              justify-content: flex-end;
              margin-top: 0.5rem;
            }
          }
        `}
      </style>

      <header className="header-container">
        <Link to="/" className="header-link">
          <div className="header-icon" aria-label="Truck icon" role="img">
            📦
          </div>
          <h1 className="header-title">Inventory Management Suite</h1>
        </Link>

        <nav className="header-nav">
          <button
            onClick={() => setShowSettings(true)}
            className="settings-btn"
            aria-label="Open Settings"
          >
            Settings ⚙️
          </button>
        </nav>

        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </header>
    </>
  );
}
