import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

const Sidebar = ({ links }) => {
  return (
    <div className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col shadow-xl">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <Menu size={22} className="text-slate-400" />
        <h1 className="text-xl font-semibold tracking-wide text-white">
          AMS
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 space-y-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
