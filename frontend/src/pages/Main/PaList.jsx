import { useState } from "react";
import {
  Calendar,
  Plus,
  FileText,
  Home,
  Bed,
  Search,
  Filter,
  MoreVertical,
  User,
} from "lucide-react";
import DockHeader from "../../component/DockHeader"
import { useNavigate } from "react-router-dom";

import AddPatientModal from "./List/AddPatientModal";


export default function PaDock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      condition: "Hypertension",
      status: "stable",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-02-10",
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      age: 32,
      condition: "Diabetes Type 2",
      status: "monitoring",
      lastVisit: "2024-01-20",
      nextAppointment: "2024-01-28",
      phone: "+1 (555) 234-5678",
      email: "sarah.j@email.com"
    },
    {
      id: 3,
      name: "Michael Chen",
      age: 58,
      condition: "Heart Disease",
      status: "critical",
      lastVisit: "2024-01-22",
      nextAppointment: "2024-01-25",
      phone: "+1 (555) 345-6789",
      email: "m.chen@email.com"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      age: 28,
      condition: "Asthma",
      status: "stable",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-02-15",
      phone: "+1 (555) 456-7890",
      email: "emily.r@email.com"
    },
    {
      id: 5,
      name: "David Wilson",
      age: 67,
      condition: "Arthritis",
      status: "monitoring",
      lastVisit: "2024-01-18",
      nextAppointment: "2024-02-05",
      phone: "+1 (555) 567-8901",
      email: "d.wilson@email.com"
    }
  ]);

  const Id = localStorage.getItem("Id")
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    switch (status) {
      case "stable":
        return "bg-cyan-600 text-gray-50";
      case "monitoring":
        return "bg-sky-500 text-white";
      case "critical":
        return "bg-amber-500 text-gray-50";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = (newPatientData) => {
    // Create new patient with unique ID
    const newId = Math.max(...patients.map(p => p.id)) + 1;
    const patientToAdd = {
      ...newPatientData,
      id: newId
    };

    // Add to patients list
    setPatients([...patients, patientToAdd]);
  };

  return (
    <div>
      <DockHeader />
      <div className="w-full min-h-screen bg-gray-50 flex flex-row">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center gap-4 py-6">
          <button onClick={(e)=>navigate(`/dock/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/calendar/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/docs/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/patinfo/${Id}`)} className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Bed className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patients</h1>
              <p className="text-gray-600">Your list of patients and their status</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add Patient
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or condition..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="stable">Stable</option>
                <option value="monitoring">Monitoring</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Patients List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm">
              <div className="col-span-3">Patient</div>
              <div className="col-span-2">Condition</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Last Visit</div>
              <div className="col-span-2">Next Appointment</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">Age {patient.age}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-900">{patient.condition}</div>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-900">{patient.lastVisit || "N/A"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-900">{patient.nextAppointment || "N/A"}</div>
                  </div>
                  <div className="col-span-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-600">{patients.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Critical Patients</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {patients.filter(p => p.status === 'critical').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Bed className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stable Patients</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {patients.filter(p => p.status === 'stable').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
}