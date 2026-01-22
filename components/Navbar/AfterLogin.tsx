import { NavLink } from "react-router";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-neutral-900/80 backdrop-blur-xl z-50
        transition-all duration-500 ease-in-out border-r border-white/10 shadow-2xl ${isOpen ? "w-64" : "w-20"
        }`}
    >
      {/* Header with App Identity */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
        {isOpen && (
          <div className="flex flex-col">
            <span className="text-white font-semibold tracking-tight">
              Notes App
            </span>
            <span className="text-[10px] text-neutral-400 truncate w-32">
              {user?.email}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
        >
          {isOpen ? (
            <PanelRightOpen size={20} />
          ) : (
            <PanelRightClose size={20} />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col justify-between h-[calc(100%-120px)] py-6">
        <div className="space-y-2 px-3">
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

        {/* Bottom Section */}
        <div className="space-y-2 px-3 border-t border-white/10 pt-6">
          <NavItem
            to="/settings"
            title="Settings"
            icon={<Settings size={22} />}
            isOpen={isOpen}
          />

          <button
            className={`flex items-center gap-4 w-full px-4 py-3 text-red-400/80
              hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all ${!isOpen && "justify-center"
              }`}
          >
            <LogOut size={22} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

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
        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive
          ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
          : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
        }
        ${!isOpen && "justify-center"}
      `}
      title={!isOpen ? title : ""}
    >
      <div className="flex-shrink-0">{icon}</div>
      {isOpen && <span className="font-medium whitespace-nowrap">{title}</span>}
    </NavLink>
  );
}

export default AfterLogin;
