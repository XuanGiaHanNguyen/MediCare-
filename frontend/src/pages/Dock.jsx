import { useState } from "react";
import {
  Calendar,
  Search,
  Bell,
  Plus,
  Settings,
  Users,
  FileText,
  Home,
  Bed,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DockHeader from "../component/DockHeader"

function Dock (){
    const [selectedTab, setSelectedTab] = useState("Monthly");
  const [currentDate, setCurrentDate] = useState(new Date(2023, 1)); // February 2023

  const statsCards = [
    {
      title: "Total Patient",
      value: "3,195",
      icon: "👥",
      bgColor: "bg-purple-500",
    },
    {
      title: "Total Staff",
      value: "16,256",
      icon: "👨‍⚕️",
      bgColor: "bg-green-500",
    },
    {
      title: "Total Rooms",
      value: "6,134",
      icon: "🏥",
      bgColor: "bg-blue-600",
    },
    {
      title: "Report",
      value: "113",
      icon: "📊",
      bgColor: "bg-blue-500",
    },
  ];

  const patientData = [
    {
      no: 1,
      id: "G-00121",
      name: "Cody Fisher",
      date: "4 Feb 2023",
      age: 60,
      country: "Indonesia",
      gender: "Female",
    },
    {
      no: 2,
      id: "G-00122",
      name: "Albert Flores",
      date: "7 Jan 2023",
      age: 60,
      country: "Indonesia",
      gender: "Male",
    },
  ];

  const recentActivity = [
    {
      name: "Kristin Watson",
      time: "10 Jan 2023, 11:31 am",
      initials: "KW",
    },
    {
      name: "Marvin McKinney",
      time: "12 Jan 2023, 12:40 am",
      initials: "MM",
    },
    {
      name: "Devon Lane",
      time: "31 Jan 2023, 10:30 am",
      initials: "DL",
    },
    {
      name: "Jerome Bell",
      time: "",
      initials: "JB",
    },
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonth = new Date(year, month - 1, 0);
      const day = prevMonth.getDate() - startingDayOfWeek + i + 1;
      days.push({ day, isCurrentMonth: false, isToday: false });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isToday: day === 2, // Highlighting day 2 as shown in the original
      });
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

    return(
        <div>
            <DockHeader></DockHeader>
            <div className="w-full h-screen bg-sky-100 flex items-center justify-center">
               

            </div>
        </div>
    )
}

export default Dock