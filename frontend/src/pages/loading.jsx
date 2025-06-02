import Header from "../component/header"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function SimpleLoadingScreen() {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          navigate("/dock")
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

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