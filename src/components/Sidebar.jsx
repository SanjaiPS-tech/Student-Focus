import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Users, Clock, MessageSquare, User } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/notes', label: 'Notes', icon: FileText },
    { path: '/planner', label: 'Planner', icon: Calendar },
    { path: '/rooms', label: 'Study Rooms', icon: Users },
    { path: '/focus', label: 'Focus Mode', icon: Clock },
    { path: '/ask-ai', label: 'Ask AI', icon: MessageSquare },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-app-yellow border-r-4 border-app-black flex flex-col h-screen fixed left-0 top-0 overflow-y-auto font-sans z-50">
      <div className="p-6 border-b-4 border-app-black bg-black text-app-yellow">
        <h1 className="text-2xl font-black italic tracking-tighter">StudySpace</h1>
        <p className="text-xs font-bold tracking-widest text-app-yellow/80">AI-POWERED LEARNING</p>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 font-bold border-2 border-app-black transition-all
                ${isActive
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[2px] translate-y-[2px]'
                  : 'bg-white text-black shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}
              `}
            >
              <Icon size={20} strokeWidth={2.5} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-app-blue border-2 border-app-black p-4 shadow-neobrutalism text-white font-bold text-center">
          💡 Build. Learn. Repeat.
        </div>
      </div>
    </aside >
  );
};

export default Sidebar;
