import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tasks", path: "/tasks" },
    { name: "Calendar", path: "/calendar" },
    { name: "Progress", path: "/progress" },
  ];

  return (
    <div className="sidebar">
      {menu.map((item) => (
        <div
          key={item.path}
          className={`sidebar-item ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;