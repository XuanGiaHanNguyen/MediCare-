import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import toast from "react-hot-toast";
import Header from "../header";

function PatientRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect( () => {
      async function Auth (){
        let userId = localStorage.getItem("Id")
        const response = await axios.get(API_ROUTES.GET_USER(userId))
        if (response.data.is_staff === true){
            setIsAuthorized(true)
        }else{
            setIsAuthorized(false)
            toast.error("Not authorized to visit this page.")
        }
      }
    
    Auth()
    
  }, []);

  if (isAuthorized === null) {
    return(
      <div>
        <Header />
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            {/* Simple spinning circle */}
            <div className="w-40 h-40 border-10 border-sky-200 border-t-sky-700 rounded-full animate-spin mx-auto mb-10"></div>
            
            {/* Loading text */}
            <h1 className="text-3xl font-bold text-sky-900 mb-4">Setting up your dashboard...</h1>

          </div>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : (<Navigate to="/" />) ;
}

export default PatientRoute;
