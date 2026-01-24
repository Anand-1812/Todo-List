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
import { toast } from "sonner";

const AfterLogin = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Logout successful");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-neutral-900/80 backdrop-blur-xl z-50 hidden sm:flex flex-col
          transition-all duration-500 ease-in-out border-r border-white/10 shadow-2xl ${isOpen ? "w-64" : "w-20"
          }`}
      >
        <div className="flex items-center justify-between h-20 px-5 border-b border-white/10 shrink-0">
          {isOpen && (
            <div
              className="flex flex-col overflow-hidden cursor-pointer"
              onClick={() => navigate("/")}
            >
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
            className={`p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer ${!isOpen ? "mx-auto" : ""}`}
          >
            {isOpen ? (
              <PanelRightOpen size={20} />
            ) : (
              <PanelRightClose size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto overflow-x-hidden">
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

        <div className="p-3 border-t border-white/10 shrink-0 mb-2">
          <NavItem
            to="/settings"
            title="Settings"
            icon={<Settings size={22} />}
            isOpen={isOpen}
          />
          <button
            onClick={handleLogout}
            className={`group flex items-center h-12 w-full rounded-xl text-red-400/80 hover:bg-red-500/10 transition-all ${!isOpen ? "justify-center" : "px-4 gap-4"}`}
          >
            <LogOut size={22} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* 2. MOBILE BOTTOM BAR (Visible only on phone) */}
      <div className="fixed bottom-0 left-0 w-full h-16 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 z-50 flex sm:hidden items-center justify-around px-2">
        <MobileNavItem to="/dashboard" icon={<House size={20} />} />
        <MobileNavItem to="/products" icon={<ShoppingCart size={20} />} />
        <MobileNavItem to="/orders" icon={<PackageSearch size={20} />} />
        <MobileNavItem to="/settings" icon={<Settings size={20} />} />
        <button onClick={handleLogout} className="p-3 text-red-400/80">
          <LogOut size={20} />
        </button>
      </div>
    </>
  );
};

function NavItem({ to, title, icon, isOpen }: any) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center h-12 w-full rounded-xl transition-all duration-200
        ${!isOpen ? "justify-center" : "px-4 gap-4"}
        ${isActive ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"}
      `}
    >
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

function MobileNavItem({ to, icon }: any) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        p-3 rounded-2xl transition-all
        ${isActive ? "text-sky-400 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]" : "text-neutral-400"}
      `}
    >
      {icon}
    </NavLink>
  );
}

export default AfterLogin;
