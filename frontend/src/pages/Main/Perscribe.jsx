import { useState, useEffect } from "react";
import {
  Calendar,
  Pill,
  Settings,
  FileText,
  Home,
  Bed,
  Edit,
  Trash2
} from "lucide-react";
import DockHeader from "../../component/DockHeader"

import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";


export default function Prescription() {
  const [patientData, setPatientData] = useState([])
  const Id = localStorage.getItem("Id")

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
          <button onClick={(e)=>navigate(`/calendar/staff/${Id}`)} className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors">
            <Pill className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/docs/staff/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={(e)=>navigate(`/patinfo/${Id}`)} className="w-12 h-12 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Bed className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <Settings className="w-5 h-5" />
                Manage Widgets
              </button>
            </div>
          </div>
    
          {/* Patient Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Patient List</h3>
                <button onClick={(e)=> navigate(`/patinfo/${Id}`)} className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>       
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>                 
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telehealth</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientData.map((patient, index) => (
                    <tr key={index+1} className="hover:bg-gray-50 transition-colors">
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{index+1}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm font-medium text-sky-800 hover:text-blue-800 cursor-pointer">{patient.name}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.diagnosis}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.tele_avail}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone}</td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}