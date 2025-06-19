import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../../constant/APIRoutes";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(async () => {
    let userId = localStorage.getItem("Id")
    const response = await axios.get(API_ROUTES.GET_USER(userId))
    if (response.data.is_staff === false){
        setIsAuthorized(true)
    }else{
        setIsAuthorized(false)
        toast.error("Not authorized to visit this page.")
    }
    
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : (<Navigate to="/" />) ;
}

export default ProtectedRoute;
