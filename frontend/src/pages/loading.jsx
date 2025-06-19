import Header from "../component/header"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import API_ROUTES from "../constant/APIRoutes"
import axios from "axios"
import toast from "react-hot-toast"

export default function SimpleLoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  
  useEffect(() => {
    const startTime = Date.now()
    let apiComplete = false
    let minTimeComplete = false
    let userRole = null // Store role locally in the effect
    
    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 100
        }
        return prev + 2 // Slower progress to allow time for API
      })
    }, 50)

    // API fetch function
    const fetchData = async () => {
      try {
        let Id = localStorage.getItem("Id")
        const response = await axios.get(API_ROUTES.GET_USER(Id))
        
        if (response.status !== 200) {
          toast.error('API request failed')
        }
        
  
        userRole = response.data.is_staff // Store in local variable
        setRole(response.data.is_staff)
        
        apiComplete = true
        checkCompletion()

      } catch (error) {
        console.error('API fetch error:', error)
        toast.error(error.message || 'An error occurred')
        apiComplete = true 
        checkCompletion()
      }
    }
    
    const minTimeTimer = setTimeout(() => {
      minTimeComplete = true
      checkCompletion()
    }, 3000)

    // Check if both conditions are met
    const checkCompletion = () => {
      if (apiComplete && minTimeComplete && !isComplete) {
        setIsComplete(true)
        setProgress(100)
        clearInterval(progressTimer)
        
        // Small delay to show 100% progress
        setTimeout(() => {
          let Id = localStorage.getItem("Id")
          if (userRole === false) {
            navigate(`/dock/patient/${Id}`)
          } else if (userRole === true) {
            navigate(`/dock/staff/${Id}`)
          } else {
            toast.error("UserId Not Found")
            navigate("/")
          }
        }, 500)
      }
    }

    // Start the API fetch
    fetchData()

    // Cleanup
    return () => {
      clearInterval(progressTimer)
      clearTimeout(minTimeTimer)
    }
  }, [navigate, isComplete])

  return (
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
  )
}