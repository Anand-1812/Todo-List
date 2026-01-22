import { NavLink, useNavigate } from "react-router";
import {
  ShoppingCart,
  PanelRightClose,
  PanelRightOpen,
  House,
  Settings,
  PackageSearch,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const AfterLogin = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:6969/api/auth/logout", {
        method: "POST", // Matches backend requirement
        credentials: "include", // Ensures session cookie is sent
      });

      if (res.ok) {
        navigate("/");
      } else {
        console.error("Logout failed on server");
      }
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-neutral-900/80 backdrop-blur-xl z-50 flex flex-col
        transition-all duration-500 ease-in-out border-r border-white/10 shadow-2xl ${isOpen ? "w-64" : "w-20"
        }`}
    >
      {/* 1. Header Section - Standardized Height */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-white/10 shrink-0">
        {isOpen && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-white font-semibold tracking-tight truncate">
              Notes App
            </span>
            <span className="text-[10px] text-neutral-400 truncate w-32">
              {user?.email}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer ${!isOpen ? "mx-auto" : ""
            }`}
        >
          {isOpen ? (
            <PanelRightOpen size={20} />
          ) : (
            <PanelRightClose size={20} />
          )}
        </button>
      </div>

      {/* 2. Middle Navigation Section - Uses flex-1 to push footer down */}
      <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <NavItem
          to="/dashboard"
          title="Dashboard"
          icon={<House size={22} />}
          isOpen={isOpen}
        />
        <NavItem
          to="/products"
          title="Products"
          icon={<ShoppingCart size={22} />}
          isOpen={isOpen}
        />
        <NavItem
          to="/orders"
          title="Orders"
          icon={<PackageSearch size={22} />}
          isOpen={isOpen}
        />
      </div>

      {/* 3. Bottom Footer Section */}
      <div className="p-3 border-t border-white/10 shrink-0 mb-2">
        <NavItem
          to="/settings"
          title="Settings"
          icon={<Settings size={22} />}
          isOpen={isOpen}
        />

        <button
          title="logout"
          onClick={handleLogout}
          className={`group flex items-center h-12 w-full rounded-xl transition-all duration-200
            text-red-400/80 hover:bg-red-500/10 hover:text-red-400
            ${!isOpen ? "justify-center" : "px-4 gap-4"}`}
        >
          <div className="flex items-center justify-center shrink-0 w-6">
            <LogOut size={22} />
          </div>
          {isOpen && (
            <span className="font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

// Standardized NavItem for perfect alignment
function NavItem({
  to,
  title,
  icon,
  isOpen,
}: {
  to: string;
  title: string;
  icon: any;
  isOpen: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center h-12 w-full rounded-xl transition-all duration-200
        ${!isOpen ? "justify-center" : "px-4 gap-4"}
        ${isActive
          ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
          : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
        }
      `}
      title={!isOpen ? title : ""}
    >
      {/* Icon wrapper ensures center alignment in collapsed mode */}
      <div className="flex items-center justify-center shrink-0 w-6">
        {icon}
      </div>
      {isOpen && (
        <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </span>
      )}
    </NavLink>
  );
}

export default AfterLogin;
