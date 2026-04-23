import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Layout.css";
import { useState } from "react";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <Topbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="app-shell-main">
        <Sidebar isOpen={sidebarOpen} onNavigate={closeSidebar} />
        {sidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} />}

        <div className="app-content-wrap">
          <main className="app-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default Layout;