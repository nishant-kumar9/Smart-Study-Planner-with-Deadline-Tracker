import { useNavigate } from "react-router-dom";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2";
import { useTheme } from "../context/ThemeContext";
import "./Topbar.css";

function Topbar({ sidebarCollapsed, mobileSidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className={`menu-btn ${sidebarCollapsed || mobileSidebarOpen ? "active" : ""}`}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <HiOutlineBars3 />
        </button>

        <div className="brand-wrap" onClick={() => navigate("/dashboard")}> 
          <h2 className="logo">Smart Study Planner</h2>
          <p className="tagline">Deadline tracker for focused students</p>
        </div>
      </div>

      <div className="topbar-right">
        <p className="date-pill">{today}</p>
        <button type="button" className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
        </button>
        <button className="profile-btn" onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={handleLogout} className="logout" type="button">
          <HiOutlineArrowRightOnRectangle />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;