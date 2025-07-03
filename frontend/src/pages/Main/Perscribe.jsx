import { useState, useEffect } from "react";
import { 
  Calendar, 
  Pill, 
  Settings, 
  FileText, 
  Home, 
  Bed, 
  Search, 
  User, 
  Clock, 
  Stethoscope 
} from 'lucide-react'
import DockHeader from "../../component/DockHeader"

import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

// Mock data for patients
const mockPatients = [
  { id: 1, name: "Amanda Carson", age: 34, avatar: "/placeholder.svg?height=40&width=40", status: "Active" },
  { id: 2, name: "Timothy Rogers", age: 28, avatar: "/placeholder.svg?height=40&width=40", status: "Active" },
  { id: 3, name: "Beatrice Jones", age: 45, avatar: "/placeholder.svg?height=40&width=40", status: "Waiting" },
  { id: 4, name: "Francis Hamilton", age: 52, avatar: "/placeholder.svg?height=40&width=40", status: "Active" },
  { id: 5, name: "Freddie Williamson", age: 38, avatar: "/placeholder.svg?height=40&width=40", status: "Active" },
  { id: 6, name: "Gabrielle Burgess", age: 29, avatar: "/placeholder.svg?height=40&width=40", status: "Active" },
  { id: 7, name: "Owen Perkins", age: 41, avatar: "/placeholder.svg?height=40&width=40", status: "Active" },
  { id: 8, name: "Galina Wolcott", age: 33, avatar: "/placeholder.svg?height=40&width=40", status: "Active" },
]

// Mock data for medications
const mockMedications = [
  {
    id: 1,
    name: "Advil",
    description: "Ibuprofen 200mg tablets",
    color: "bg-green-500",
    dosage: "200mg",
    frequency: "Every 6-8 hours",
  },
  {
    id: 2,
    name: "Aleve",
    description: "Naproxen sodium 220mg tabs, for 10",
    color: "bg-blue-500",
    dosage: "220mg",
    frequency: "Every 12 hours",
  },
  {
    id: 3,
    name: "Tylenol",
    description: "Acetaminophen 500mg tablets, No. 1, 2, 3, 5, 10",
    color: "bg-red-500",
    dosage: "500mg",
    frequency: "Every 4-6 hours",
  },
  {
    id: 4,
    name: "Benadryl Allergy",
    description: "Allergy Relief Tablets, Diphenhydramine HCl 25mg, 100 ct",
    color: "bg-purple-500",
    dosage: "25mg",
    frequency: "Every 4-6 hours",
  },
  {
    id: 5,
    name: "Sodium Chlorhexidine",
    description: "Chlorhexidine gluconate 0.12% oral rinse",
    color: "bg-yellow-500",
    dosage: "15ml",
    frequency: "Twice daily",
  },
]

// Button component
const Button = ({ children, variant = "default", size = "default", className = "", onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    outline: "border border-gray-300 bg-white hover:bg-gray-50"
  }
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Input component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  )
}

// Card components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 px-6 py-5 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

// Tabs components
const Tabs = ({ children, value, onValueChange, className = "" }) => (
  <div className={className} data-value={value} data-on-value-change={onValueChange}>
    {children}
  </div>
)

const TabsContent = ({ children, value, className = "" }) => (
  <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}>
    {children}
  </div>
)

export default function Prescription() {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("prescription")
  const Id = "staff123" // Mock ID

  const filteredMedications = mockMedications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePrescribe = (medication) => {
    console.log(`Prescribing ${medication.name} to ${selectedPatient.name}`)
    // Add prescription logic here
  }

  useEffect(()=> {
    async function getPatients(){
      const response = await axios.get(API_ROUTES.GET_PATIENTS)
      const allPatient = response.data
      const staffPatient = allPatient.filter(patient => patient.staff_in_charge === Id)
      console.log(staffPatient)
      setPatientData(staffPatient)

    }
    getPatients()
  }, [])

  const navigate = useNavigate()

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
          <button onClick={(e)=>navigate(`/prescription/staff/${Id}`)} className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Pill className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/docs/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/patinfo/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Bed className="w-5 h-5" />
          </button>
        </div>
        {/* */}

        <div className="flex flex-col w-full bg-gray-50">

        <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                 <h1 className="text-2xl font-bold text-gray-900">Perscriptions</h1>
              </div>
            </div> 
        <div className="flex flex-1">
          {/* Patient List Sidebar */}
          
          <div className="w-80 bg-white border-r border-gray-200">
            <div className="p-4">
              <div className="space-y-2">
                {mockPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPatient.id === patient.id ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                      <p className="text-xs text-gray-500">Age {patient.age}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="visit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Visit scheduled at 2:30 PM</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Chief Complaint</label>
                          <p className="text-sm text-gray-600 mt-1">Routine checkup and medication review</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Vital Signs</label>
                          <p className="text-sm text-gray-600 mt-1">BP: 120/80, HR: 72, Temp: 98.6°F</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prescription" className="space-y-6">
                {/* Search Section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search drugs or choose from suggestions"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Current Prescriptions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Prescriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No active prescriptions for this patient</p>
                      <p className="text-sm">Start by searching and prescribing medications above</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}