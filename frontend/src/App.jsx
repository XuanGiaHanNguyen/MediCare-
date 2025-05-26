import {BrowserRouter, Routes, Route} from "react-router-dom"

import Landing from "./pages/Landing"
import RoleQuestionaire from "./pages/AuthSteps/RoleQuest"

import Header from "./component/header"


function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/role" element={<RoleQuestionaire/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
