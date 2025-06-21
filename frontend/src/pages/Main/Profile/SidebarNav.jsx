import { Calendar, FileText, Home, Bed } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SidebarNav({ userId }) {
  const navigate = useNavigate();

  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
      <button 
        onClick={() => navigate(`/dock/staff/${userId}`)} 
        className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Home className="w-5 h-5" />
      </button>
      <button 
        onClick={() => navigate(`/calendar/staff/${userId}`)} 
        className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Calendar className="w-5 h-5" />
      </button>
      <button 
        onClick={() => navigate(`/docs/staff/${userId}`)} 
        className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <FileText className="w-5 h-5" />
      </button>
      <button 
        onClick={() => navigate(`/patinfo/${userId}`)} 
        className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <Bed className="w-5 h-5" />
      </button>
    </div>
  );
}