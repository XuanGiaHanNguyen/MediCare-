import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom" // Add this import
import Ambulance from "../assets/ambulance.png"
import Header from "../component/header"

export default function Component() {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate() // Initialize navigation hook

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          // Navigate to dashboard after loading completes
          setTimeout(() => {
            navigate('/dock') // Change this to your desired route
          }, 500) // Small delay before navigation for better UX
          return 100
        }
        return prev + 1
      })
    }, 50) // This will take about 5 seconds to complete (100 * 50ms)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen bg-sky-100 flex items-center justify-center ">
        <div className="text-center pb-32">
          {/* Animated Circle and Ambulance */}
          <div className="relative mx-auto w-[480px] h-[480px] flex items-center justify-center">
            {/* Ambulance Image - moved right */}
            <motion.img
              src={Ambulance}
              alt="Ambulance"
              className="w-[360px] h-[360px] object-contain z-10 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
            <motion.div
            className=""
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.p
              className="text-sky-800 text-3xl font-bold"
            >
              Loading your health dashboard
            </motion.p>
          </motion.div>
  
          {/* Simple Pulse Dots */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-sky-700 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}