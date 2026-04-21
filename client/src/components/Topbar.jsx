import { useNavigate } from "react-router-dom";
import "./Topbar.css";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="topbar">
      <h2 onClick={() => navigate("/dashboard")} className="logo">
        Smart Study Planner
      </h2>

      <div className="topbar-right">
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;