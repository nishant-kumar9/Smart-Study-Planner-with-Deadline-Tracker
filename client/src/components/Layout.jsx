import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Layout.css";

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 980px)");

    const handleChange = (event) => {
      if (!event.matches) {
        setMobileSidebarOpen(false);
      }
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const closeSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const toggleSidebar = () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setMobileSidebarOpen((currentValue) => !currentValue);
      return;
    }

    setSidebarCollapsed((currentValue) => !currentValue);
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="app-shell-main">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onNavigate={closeSidebar}
        />
        {mobileSidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar} />}

        <div className="app-content-wrap">
          <main className="app-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default Layout;