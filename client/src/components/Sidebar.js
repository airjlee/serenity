import React from 'react';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Revive</h2>
      <nav>
        <ul>
          <li>Diagnosis</li>
          <li>Activity Logs</li>
          <li>Usage</li>
          <li>API Keys</li>
          <li>Account</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;