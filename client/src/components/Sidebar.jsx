import { NavLink } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import "./Sidebar.css";

function Sidebar({ isOpen, onNavigate }) {

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <HiOutlineSquares2X2 /> },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <HiOutlineClipboardDocumentList />,
    },
    { name: "Calendar", path: "/calendar", icon: <HiOutlineCalendarDays /> },
    { name: "Progress", path: "/progress", icon: <HiOutlineChartBar /> },
    { name: "Profile", path: "/profile", icon: <HiOutlineUserCircle /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <p className="sidebar-label">Workspace</p>

      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">{item.icon}</span>
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;