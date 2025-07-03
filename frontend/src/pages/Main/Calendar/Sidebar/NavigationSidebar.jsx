import React from "react";
import { Home, Calendar, FileText, Bed, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NavigationSidebar({ currentPage, userId }) {
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'home', icon: Home, path: `/dock/staff/${userId}`, label: 'Home' },
    { id: 'calendar', icon: Calendar, path: `/calendar/staff/${userId}`, label: 'Calendar' },
    { id: 'perscription', icon: Pill, path: `/prescription/staff/${userId}`, label: 'Perscription' },
    { id: 'docs', icon: FileText, path: `/docs/staff/${userId}`, label: 'Documents' },
    { id: 'patients', icon: Bed, path: `/patinfo/${userId}`, label: 'Patients' }
  ];

  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-colors
              ${isActive 
                ? 'bg-sky-100 text-sky-600 hover:bg-blue-200' 
                : 'text-gray-400 hover:bg-gray-100'
              }
            `}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
}