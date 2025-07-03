import {BrowserRouter, Routes, Route} from "react-router-dom"

import Landing from "./pages/Landing"
import RoleQuestionaire from "./pages/AuthSteps/RoleQuest"
import SignUp from "./pages/AuthSteps/SignUp"
import MedProf from "./pages/AuthSteps/CreateProfile/MedProf"
import Patient from "./pages/AuthSteps/CreateProfile/Patient"

import Dock from "./pages/Main/Dock"
import CalendarDock from "./pages/Main/Calendar"
import DocumentDock from "./pages/Main/Documents"
import PaDock from "./pages/Main/PaList"
import Profile from "./pages/Main/Profile"
import ProfileP from "./pages/Patient/ProfileP"
import Prescription from "./pages/Main/Perscribe"

import Dockboard from "./pages/Patient/DockP"
import CalendarPDock from "./pages/Patient/CalendarP"
import DocumentPDock from "./pages/Patient/DocumentP"

import BackToLogin from "./pages/PassReset/BackToLogin"
import LinkSent from "./pages/PassReset/LinkSent"
import NewPass from "./pages/PassReset/NewPass"
import EnterEmail from "./pages/PassReset/EnterEmail"

import Component from "./pages/loading"
import { Toaster } from 'react-hot-toast'
import React from "react";

import StaffRoute from "./component/Protected/StaffRoute"
import PatientRoute from "./component/Protected/PatientRoute"

function App() {

  return (
    <BrowserRouter>
    <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Landing/>}/>

        <Route 
          path="/dock/staff/:id" 
          element={
            <StaffRoute>
                <Dock/>
            </StaffRoute>
          }
        />

        <Route 
          path="/prescription/staff/:id" 
          element={
            <StaffRoute>
                <Prescription/>
            </StaffRoute>
          }
        />


        <Route 
          path="/dock/patient/:id" 
          element={
            <PatientRoute>
              <Dockboard/>
            </PatientRoute>
          }
        />


        <Route 
          path="/calendar/staff/:id" 
          element={
            <StaffRoute>
              <CalendarDock/>
            </StaffRoute>
          }
        />

        <Route 
          path="/calendar/patient/:id" 
          element={
            <PatientRoute>
              <CalendarPDock/>
            </PatientRoute>
          }
        />
        
        <Route 
          path="/docs/staff/:id" 
          element={
            <StaffRoute>
              <DocumentDock/>
            </StaffRoute>
          }
        />

        <Route 
          path="/docs/patient/:id" 
          element={
            <PatientRoute>
              <DocumentPDock/>
            </PatientRoute>
          }
        />


        <Route 
          path="/patinfo/:id" 
          element={
            <StaffRoute>
              <PaDock/>
            </StaffRoute>
          }
        />

        <Route 
          path="/profile/staff/:id" 
          element={
            <StaffRoute>
              <Profile/>
            </StaffRoute>
          }
        />
        <Route 
          path="/profile/patient/:id" 
          element={
            <PatientRoute>
              <ProfileP/>
            </PatientRoute>
          }
        />
        
        <Route path="/role" element={<RoleQuestionaire/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/medprofile" element={<MedProf/>}/>
        <Route path="/patprofile" element={<Patient/>}/>

        <Route path="/enteremail" element={<EnterEmail/>}/>
        <Route path="/linksent" element={<LinkSent/>}/>
        <Route path="/newpass" element={<NewPass/>}/>
        <Route path="/back" element={<BackToLogin/>}/>

        <Route path="/loading" element={<Component/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
