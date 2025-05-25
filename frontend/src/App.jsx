import {BrowserRouter, Routes, Route} from "react-router-dom"

import Landing from "./pages/Landing"
import SignUp from "./pages/SignUp"

import Header from "./component/header"


function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
