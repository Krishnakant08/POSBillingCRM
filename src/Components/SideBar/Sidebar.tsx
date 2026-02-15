
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    UtensilsCrossed,
    Armchair,
    FileBarChart,
    Settings,
    LogOut,
    TrendingUp,
} from "lucide-react";
import logo from "../../assets/logo.png"
import "./Sidebar.css";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const isCollapsed = false; // Collapsed state currently disabled/unused

    // This would typically come from an auth context
    const user = {
        name: "Test User",
        role: "Product Designer",
        avatar: "https://i.pravatar.cc/150?u=mohit", // Placeholder
    };

    const navItems = [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Menu Management", path: "/menu-management", icon: UtensilsCrossed },
        { label: "Orders History", path: "/orders", icon: FileBarChart }, // Reusing icon or using a new one if available. History icon often clock or list.
        { label: "Tables", path: "/tables", icon: Armchair },
        { label: "Reports", path: "/reports", icon: TrendingUp },
        { label: "Settings", path: "/settings", icon: Settings },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        console.log("Logging out...");
        window.location.href = "/login";
    };

    return (
        <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isOpen ? "mobile-open" : ""}`}>
            {/* 1. Branding Section */}
            <div className="sidebar-header">
                <Link to="/dashboard" className="sidebar-brand" onClick={onClose}>
                    <div className="brand-logo">
                        {/* <span className="logo-icon">💠</span> */}
                        <img src={logo} alt="Bill Easy" className="logo-img" />
                    </div>
                    {!isCollapsed && <span className="brand-name">Arambh</span>}
                </Link>
            </div>

            {/* 2. User Profile Section */}
            <div className="sidebar-user">
                <div className="user-avatar">
                    <img src={user.avatar} alt={user.name} />
                </div>
                {!isCollapsed && (
                    <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                )}
            </div>

            {/* 3. Navigation Menu */}
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path} className="nav-item">
                                <Link
                                    to={item.path}
                                    className={`nav-link ${isActive ? "active" : ""}`}
                                    title={isCollapsed ? item.label : ""}
                                    onClick={onClose}
                                >
                                    <Icon size={20} className="nav-icon" />
                                    {!isCollapsed && <span className="nav-label">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* 4. Logout (Bottom Fixed) */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <LogOut size={20} className="logout-icon" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
