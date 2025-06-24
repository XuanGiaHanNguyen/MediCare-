import { useState, useEffect } from "react";
import {
  X,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  User,
  UserPlus,
  Edit3, 
  MoreVertical,
  SquareMousePointer
} from "lucide-react";

import axios from "axios"
import API_ROUTES from "../../../constant/APIRoutes"
import toast from "react-hot-toast"

export default function PatientSearchModal({ isOpen, onClose, onAddPatient }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [data, setData] = useState([])
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    condition: "",
    status: "stable",
    lastVisit: "",
    nextAppointment: "",
    phone: "",
    email: ""
  });

  useEffect(()=> {
    async function GetData (){
      const response = await axios.get(API_ROUTES.GET_PATIENTS)
      setData(response.data)
    }
    GetData()
  }, [])

  const searchPatients = (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const results = data.filter((patient) =>
      patient.name.toLowerCase().includes(lowerTerm) ||
      patient.phone?.toLowerCase().includes(lowerTerm) ||
      patient.email?.toLowerCase().includes(lowerTerm)
    );
    setSearchResults(results);
  };

  console.log(data)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPatients(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, data]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientData({
      name: patient.name,
      age: patient.age.toString(),
      condition: patient.diagnosis || "",
      status: "stable",
      lastVisit: patient.lastVisit || "",
      nextAppointment: "",
      phone: patient.phone || "",
      email: patient.email || ""
    });
    setShowAddForm(true);
  };

  const handleCreateNew = () => {
    setSelectedPatient(null);
    setPatientData({
      name: searchTerm,
      age: "",
      condition: "",
      status: "stable",
      lastVisit: "",
      nextAppointment: "",
      phone: "",
      email: ""
    });
    setShowAddForm(true);
  };

  const handleInputChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!patientData.name || !patientData.age || !patientData.condition) {
      alert("Please fill in all required fields (Name, Age, Condition)");
      return;
    }

    // Pass the patient data to parent component
    onAddPatient({
      ...patientData,
      age: parseInt(patientData.age),
      id: selectedPatient?.id || selectedPatient?.userId || Date.now()
    });

    handleClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedPatient(null);
    setShowAddForm(false);
    setPatientData({
      name: "",
      age: "",
      condition: "",
      status: "stable",
      lastVisit: "",
      nextAppointment: "",
      phone: "",
      email: ""
    });
    onClose();
  };

  const handleBack = () => {
    setShowAddForm(false);
    setSelectedPatient(null);
  };

  // Unified patient row component
  const PatientRow = ({ patient, onClick }) => (
    <div 
      key={patient.userId || patient.id} 
      className="px-6 border-2 border-gray-200 rounded-md my-2 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-sky-600" />
        </div>
        <div className="flex flex-col justify-start text-start">
          <div className="font-semibold text-gray-900">{patient.name}</div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="text-sm text-gray-500">Age {patient.age}</div>
      </div>
      <div className="col-span-3 pl-3 flex flex-col justify-start text-start">
        <div className="text-sm text-gray-500">{patient.diagnosis || 'No diagnosis'}</div>
      </div>
      <div className="col-span-2 text-sm text-gray-500">
        {patient.phone && <div>{patient.phone}</div>}
        {patient.email && <div className="truncate">{patient.email}</div>}
      </div>
      <div className="col-span-1 flex align-center justify-center">
        <button onClick={() => onClick(patient)}>
          <SquareMousePointer className="w-6 h-6 text-gray-400 hover:text-gray-600" strokeWidth={1}/>
        </button>
      </div>
      <div className="col-span-1">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={(e) => { e.stopPropagation(); /* Handle menu action */ }}
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {showAddForm && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {showAddForm ? (selectedPatient ? "Update Patient Information" : "Add New Patient") : "Search Patient"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!showAddForm ? (
            // Search Interface
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-lg"
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                </div>
              )}

              {/* Search Results */}
              {!isLoading && searchTerm && searchResults.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Found {searchResults.length} patient(s) for "{searchTerm}"
                    </h3>
                    
                  </div>
                  <div className="px-1">
                    {searchResults.map((patient) => (
                      <PatientRow 
                        key={patient.userId || patient.id} 
                        patient={patient} 
                        onClick={handlePatientSelect}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!isLoading && searchTerm && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-600 mb-4">No patients match "{searchTerm}"</p>
                  <button
                    onClick={handleCreateNew}
                    className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create New Patient
                  </button>
                </div>
              )}

              {/* Initial State - All Patients */}
              {!searchTerm && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      All Patients ({data.length})
                    </h3>
                  </div>
                  <div className="px-1">
                    {data.map((patient) => (
                      <PatientRow 
                        key={patient.userId || patient.id} 
                        patient={patient} 
                        onClick={handlePatientSelect}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Add/Update Form
            <div className="space-y-6">
              {selectedPatient && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-5 h-5 text-sky-600" />
                    <span className="text-sky-800">Updating information for existing patient: <strong>{selectedPatient.name}</strong></span>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter patient's full name"
                      value={patientData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="150"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter age"
                      value={patientData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                        value={patientData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="patient@email.com"
                        value={patientData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Condition *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="e.g., Hypertension, Diabetes"
                      value={patientData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      value={patientData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="stable">Stable</option>
                      <option value="monitoring">Monitoring</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Visit
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        value={patientData.lastVisit}
                        onChange={(e) => handleInputChange('lastVisit', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Appointment
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        value={patientData.nextAppointment}
                        onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back to Search
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {selectedPatient ? "Update Patient" : "Add Patient"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}