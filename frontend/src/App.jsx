import {BrowserRouter, Routes, Route} from "react-router-dom"

import Landing from "./pages/Landing"
import RoleQuestionaire from "./pages/AuthSteps/RoleQuest"
import SignUp from "./pages/AuthSteps/SignUp"
import MedProf from "./pages/AuthSteps/CreateProfile/MedProf"
import Patient from "./pages/AuthSteps/CreateProfile/Patient"

import Dock from "./pages/Dock"
import CalendarDock from "./pages/Main/Calendar"
import DocumentDock from "./pages/Main/Documents"

import BackToLogin from "./pages/PassReset/BackToLogin"
import LinkSent from "./pages/PassReset/LinkSent"
import NewPass from "./pages/PassReset/NewPass"
import EnterEmail from "./pages/PassReset/EnterEmail"

import Component from "./pages/loading"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/dock" element={<Dock/>}/>
        <Route path="/calendar" element={<CalendarDock/>}/>
        <Route path="/docs" element={<DocumentDock/>}/>

        
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
