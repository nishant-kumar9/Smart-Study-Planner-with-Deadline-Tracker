import { useNavigate } from "react-router-dom";
import { HiOutlineBars3, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import "./Topbar.css";

function Topbar({ sidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();

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
          className={`menu-btn ${sidebarOpen ? "active" : ""}`}
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