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
  Edit3
} from "lucide-react";

export default function PatientSearchModal({ isOpen, onClose, onAddPatient }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
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

  // Mock database search function - replace with actual API call
  const searchPatients = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock search results - replace with actual database query
    const mockPatients = [
      { id: 1, name: "John Smith", age: 45, phone: "+1 (555) 123-4567", email: "john.smith@email.com", lastVisit: "2024-05-15" },
      { id: 2, name: "Jane Doe", age: 32, phone: "+1 (555) 987-6543", email: "jane.doe@email.com", lastVisit: "2024-04-20" },
      { id: 3, name: "Robert Johnson", age: 58, phone: "+1 (555) 456-7890", email: "r.johnson@email.com", lastVisit: "2024-03-10" },
      { id: 4, name: "Mary Williams", age: 41, phone: "+1 (555) 321-0987", email: "mary.w@email.com", lastVisit: "2024-06-01" },
    ];

    const filtered = mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(term.toLowerCase()) ||
      patient.phone.includes(term) ||
      patient.email.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filtered);
    setIsLoading(false);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPatients(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientData({
      name: patient.name,
      age: patient.age.toString(),
      condition: "",
      status: "stable",
      lastVisit: patient.lastVisit || "",
      nextAppointment: "",
      phone: patient.phone,
      email: patient.email
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
      id: selectedPatient?.id || Date.now() // Use existing ID or generate new one
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
              {!isLoading && searchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Found {searchResults.length} patient(s)</h3>
                  {searchResults.map((patient) => (
                    <div
                      key={patient.id}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                            <p className="text-sm text-gray-600">Age: {patient.age} • Last visit: {patient.lastVisit}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{patient.phone}</p>
                          <p>{patient.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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

              {/* Initial State */}
              {!searchTerm && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Search for a patient</h3>
                  <p className="text-gray-600">Enter a name, phone number, or email to find existing patients</p>
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