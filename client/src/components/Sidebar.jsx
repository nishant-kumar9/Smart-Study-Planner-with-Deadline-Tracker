import { NavLink } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import "./Sidebar.css";

function Sidebar({ collapsed, mobileOpen, onNavigate }) {

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
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
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
          <span className="sidebar-text">{item.name}</span>
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;