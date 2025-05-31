import React, { useState } from "react";
import Modal from "./Modal";
import TagsManager from "./TagsManager";

export default function Settings({ onClose }) {
  const [showTagsManager, setShowTagsManager] = useState(false);

  return (
    <Modal
      onClose={onClose}
      showBackButton={showTagsManager}
      onBack={() => setShowTagsManager(false)}
    >
      {!showTagsManager ? (
        <>
          <h2>Settings</h2>
          <button
            onClick={() => setShowTagsManager(true)}
            style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}
          >
            Manage Tags
          </button>
        </>
      ) : (
        <TagsManager onClose={() => setShowTagsManager(false)} />
      )}
    </Modal>
  );
}
