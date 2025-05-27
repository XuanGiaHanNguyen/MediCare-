import {BrowserRouter, Routes, Route} from "react-router-dom"

import Landing from "./pages/Landing"
import RoleQuestionaire from "./pages/AuthSteps/RoleQuest"
import SignUp from "./pages/AuthSteps/SignUp"
import MedProf from "./pages/AuthSteps/CreateProfile/MedProf"
import Patient from "./pages/AuthSteps/CreateProfile/Patient"
import Dock from "./pages/Dock"

import Component from "./pages/loading"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        
        <Route path="/role" element={<RoleQuestionaire/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/medprofile" element={<MedProf/>}/>
        <Route path="/patprofile" element={<Patient/>}/>

        <Route path="/loading" element={<Component/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
