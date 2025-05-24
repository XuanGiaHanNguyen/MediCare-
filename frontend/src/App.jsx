import {BrowserRouter, Routes, Route} from "react-router-dom"

import Landing from "./pages/Landing"
import Header from "./component/header"


function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
