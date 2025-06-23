import { 
  Users, 
  Calendar, 
  Activity, 
  CheckCircle,
  Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GoogleIcon } from '../assets/icon';
import { useGoogleLogin } from '@react-oauth/google';

import axios from "axios"
import toast from "react-hot-toast"
import API_ROUTE from "../constant/APIRoutes"

import Header from "../component/header"

const FeatureCard = ({ icon: Icon, title, description, features, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-700 ease-out p-6 transform hover:-translate-y-3 hover:scale-[1.02] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ 
        transitionDelay: `${index * 50}ms`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <div className="mb-6">
        <div className="mb-4 transform group-hover:scale-110 transition-all duration-500 ease-out">
          <Icon className="h-12 w-12 text-sky-600 group-hover:text-sky-700 transition-all duration-500 ease-out group-hover:rotate-12" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-3 transform group-hover:translate-x-2 transition-all duration-500 ease-out">{title}</h3>
        <p className="text-gray-600 leading-relaxed transform group-hover:translate-x-2 transition-all duration-500 ease-out delay-75">{description}</p>
      </div>
      
      <div className="space-y-3">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-3 transform hover:translate-x-3 transition-all duration-400 ease-out opacity-0 animate-fade-in-up"
            style={{ 
              transitionDelay: `${idx * 100}ms`,
              animationDelay: `${600 + index * 150 + idx * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <CheckCircle className="h-4 w-4 text-sky-600 flex-shrink-0 transform group-hover:scale-125 transition-all duration-400 ease-out" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ children, className = "", index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`bg-white h-full rounded-lg border border-gray-200 shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-600 ease-out hover:scale-[1.02] ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    } ${className}`}
    style={{ 
      transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Input component
const Input = ({ className = "", ...props }) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transform focus:scale-105 transition-all duration-300 ease-out ${className}`}
    {...props}
  />
);

// Button component
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-all duration-400 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 transform hover:scale-105 active:scale-95";
  const variantClasses = variant === "secondary" 
    ? "bg-white text-sky-600 hover:bg-gray-50 hover:text-sky-700 hover:shadow-lg" 
    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg";
  
  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Link component
const Link = ({ children, href, className = "", ...props }) => (
  <a href={href} className={`transition-all duration-300 ease-out hover:scale-105 ${className}`} {...props}>
    {children}
  </a>
);

function Landing () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
 
    const navigate = useNavigate()

    const [heroVisible, setHeroVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [testimonialsVisible, setTestimonialsVisible] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);

    useEffect(() => {
      const heroTimer = setTimeout(() => setHeroVisible(true), 100);
      const formTimer = setTimeout(() => setFormVisible(true), 200);
      const featuresTimer = setTimeout(() => setFeaturesVisible(true), 400);
      const testimonialsTimer = setTimeout(() => setTestimonialsVisible(true), 1200);
      const ctaTimer = setTimeout(() => setCtaVisible(true), 1800);
      const footerTimer = setTimeout(() => setFooterVisible(true), 2200);
      
      return () => {
        clearTimeout(heroTimer);
        clearTimeout(formTimer);
        clearTimeout(featuresTimer);
        clearTimeout(testimonialsTimer);
        clearTimeout(ctaTimer);
        clearTimeout(footerTimer);
      };
    }, []);

    const features = [
    {
      icon: Users,
      title: "Patient Management",
      description: "Complete patient records, medical history, and treatment tracking in one secure platform.",
      features: [
        "Electronic Health Records (EHR)",
        "Patient Portal Access",
        "Medical History Tracking"
      ]
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Smart scheduling system that optimizes doctor availability and reduces patient wait times.",
      features: [
        "Online Booking System",
        "Automated Reminders",
        "Resource Optimization"
      ]
    },
    {
      icon: Activity,
      title: "Real-time Analytics",
      description: "Comprehensive dashboards and reports to monitor hospital performance and patient outcomes.",
      features: [
        "Performance Metrics",
        "Financial Reports",
        "Quality Indicators"
      ]
    }
  ];

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse)
    },
    onError: toast.error("Error Occured during Log In")
  })

  
  async function handleSubmit () {
    let Object = {
      email: email, 
      password: password
    }

    let response = await axios.post(API_ROUTE.LOGIN, Object)
    console.log(response.data.success)
    if (response.data.success === true){
      const userId = response.data.user._id.toString()
      localStorage.setItem("Id", userId)
      navigate("/loading")
    } else {
      toast.error(`Error in Login process - Try again later`)
    }

  };

    return(
        <div className="flex flex-col">
            <Header/>
            <style jsx>{`
              @keyframes fade-in-up {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
              
              .animate-fade-in-up {
                animation: fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              }
              
              .animate-float {
                animation: float 3s ease-in-out infinite;
              }
            `}</style>
            
            {/* Hero Section  */}
            <div className="w-full bg-sky-800 flex flex-row overflow-hidden">
                <div className="flex-[1.25] px-10 flex justify-center align-center items-center">
                    <div className={`flex flex-col gap-4 transform transition-all duration-1000 ease-out ${
                      heroVisible ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <div className={`flex transform transition-all duration-800 ease-out delay-300 ${
                          heroVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                        }`}>
                            <p className="px-4 py-2 rounded-full bg-sky-100 backdrop-blur-sm text-gray-800 font-medium hover:bg-white/90 transition-all duration-400 ease-out animate-float hover:animate-none shadow-sm">
                              Trusted by 500+ Healthcare Facilities
                            </p>
                        </div>
                        <h1 className={`text-6xl text-gray-200 font-semibold px-2 leading-tight transform transition-all duration-1000 ease-out delay-500 ${
                          heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        }`}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                          Streamline Your Hospital Operations
                        </h1>
                        <h2 className={`text-lg px-2 pt-2 text-gray-400 leading-relaxed transform transition-all duration-800 ease-out delay-700 ${
                          heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                            Complete hospital management solution that digitizes patient records, schedules appointments, manages staff, and optimizes healthcare delivery for better patient outcomes.
                        </h2>
                    </div>
                </div>
                 <div className="flex-1">
                    <div className={`m-10 rounded-xl p-8 bg-white/95 backdrop-blur-sm shadow-xl border border-white/50 transform transition-all duration-1000 ease-out hover:shadow-2xl hover:scale-[1.02] ${
                      formVisible ? 'opacity-100' : ' opacity-0'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <div className="space-y-6">
                        <div className="space-y-4">
                            <div className={`transform transition-all duration-600 ease-out delay-200 hover:translate-x-1 ${
                              formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                type="email"
                                onChange = {(e)=>setEmail(e.target.value)}
                                placeholder="doctor@hospital.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-400 ease-out placeholder-gray-400 transform focus:scale-105 bg-white/90"
                            />
                            </div>

                            <div className={`transform transition-all duration-600 ease-out delay-400 hover:translate-x-1 ${
                              formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-400 ease-out placeholder-gray-400 transform focus:scale-105 bg-white/90"
                            />
                            </div>
                        </div>

                        <div className={`flex items-center justify-between transform transition-all duration-600 ease-out delay-600 ${
                          formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                            <div className="flex items-center transform hover:translate-x-1 transition-all duration-300 ease-out">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-blue-500 transform hover:scale-110 transition-all duration-300 ease-out"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                                Remember me
                            </label>
                            </div>
                            <button 
                            type="button"
                            onClick = {(e)=> navigate("/enteremail")}
                            className="text-sm text-sky-600 hover:text-sky-700 hover:underline transition-all duration-300 ease-out transform hover:scale-105"
                            >
                            Forgot password?
                            </button>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            className={`w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-400 ease-out focus:ring-4 focus:ring-blue-200 focus:outline-none transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                              formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}
                            style={{ transitionDelay: '800ms' }}
                        >
                            Sign In
                        </button>

                        <div className="flex items-center justify-center w-full">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="px-4 text-gray-700 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        <button 
                            onClick={(e) => handleGoogle()}
                            className={`border-2 border-sky-600 text-sky-800 font-semibold w-full flex text-center justify-center py-3 rounded-md cursor-pointer hover:bg-sky-50 transition-all duration-400 ease-out active:scale-95 ${
                              formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}
                            style={{ transitionDelay: '800ms' }}
                        >
                            <span className="pr-2">{GoogleIcon}</span> Log In with Google 
                        </button>

                        <div className={`text-center transform transition-all duration-600 ease-out delay-1000 ${
                          formVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                            <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button 
                                onClick={(e) => navigate("/role")}
                                type="button"
                                className="text-sky-600 hover:text-sky-700 hover:underline font-medium transition-all duration-300 ease-out transform hover:scale-105"
                            >
                                Sign up here
                            </button>
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Features Section  */}
                <section id="features" className={`w-full py-24 bg-gradient-to-b from-gray-50 to-gray-100 transform transition-all duration-1000 ease-out ${
                  featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                    <div className="container mx-auto px-6 max-w-7xl">
                        {/* Header Section */}
                        <div className={`text-center mb-16 transform transition-all duration-800 ease-out delay-200 ${
                          featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        }`}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        <div className="space-y-4">
                            <h2 className="text-5xl font-bold tracking-tight text-gray-700 transform hover:scale-105 transition-all duration-500 ease-out">
                                Comprehensive Healthcare Management
                            </h2>
                            <p className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed transform hover:translate-y-1 transition-all duration-400 ease-out">
                                Everything you need to run a modern healthcare facility efficiently and provide exceptional patient care.
                            </p>
                        </div>
                        </div>

                        {/* Features Grid */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 transform transition-all duration-800 ease-out delay-400 ${
                          featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        }`}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                        {features.map((feature, index) => (
                            <FeatureCard
                            key={index}
                            index={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            features={feature.features}
                            />
                        ))}
                        </div>
                    </div>
                  </section>

                  {/* Testimonials */}
              <section className={`w-full pt-24 pb-10 bg-white transform transition-all duration-1000 ease-out ${
                testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                <div className="container mx-auto px-4 ">
                  <div className={`flex flex-col items-center justify-center space-y-4 text-center transform transition-all duration-800 ease-out delay-200 ${
                    testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                    <div className="space-y-4">
                      <h2 className="text-5xl font-bold tracking-tighter text-gray-700 transform hover:scale-105 transition-all duration-500 ease-out">
                        Trusted by Healthcare Professionals
                      </h2>
                      <p className="max-w-[900px] text-gray-600 text-lg transform hover:translate-y-1 transition-all duration-400 ease-out">
                        See what healthcare providers are saying about our platform.
                      </p>
                    </div>
                  </div>
                  <div className={`mx-auto grid items-start py-12 lg:grid-cols-3 gap-8 transform transition-all duration-800 ease-out delay-400 ${
                    testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                    <Card index={0}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-4 w-4 fill-yellow-400 text-yellow-400 transform hover:scale-125 transition-all duration-400 ease-out hover:rotate-12" 
                              style={{ transitionDelay: `${i * 100}ms` }}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4 transform hover:translate-x-1 transition-all duration-300 ease-out">
                          "MediCare+ has transformed how we manage our clinic. The patient portal has significantly reduced
                          our administrative workload."
                        </p>
                        <div className="flex items-center gap-3 transform hover:translate-x-2 transition-all duration-400 ease-out">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-400 ease-out">
                            <span className="text-sky-600 font-semibold">DR</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600">Dr. Sarah Johnson</p>
                            <p className="text-sm text-gray-500">Family Medicine Clinic</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card index={1}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-4 w-4 text-yellow-400 fill-yellow-400 transform hover:scale-125 transition-all duration-400 ease-out hover:rotate-12" 
                              style={{ transitionDelay: `${i * 100}ms` }}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4 transform hover:translate-x-1 transition-all duration-300 ease-out">
                          "The analytics dashboard gives us insights we never had before. We've improved our patient
                          satisfaction scores by 40%."
                        </p>
                        <div className="flex items-center gap-3 transform hover:translate-x-2 transition-all duration-400 ease-out">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-400 ease-out">
                            <span className="text-sky-600 font-semibold">MR</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600">Michael Rodriguez</p>
                            <p className="text-sm text-gray-500">Hospital Administrator</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card index={2}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-4 w-4 text-yellow-400 fill-yellow-400 transform hover:scale-125 transition-all duration-400 ease-out hover:rotate-12" 
                              style={{ transitionDelay: `${i * 100}ms` }}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4 transform hover:translate-x-1 transition-all duration-300 ease-out">
                          "Implementation was smooth and the support team is exceptional. Our staff adapted to the system
                          within days."
                        </p>
                        <div className="flex items-center gap-3 transform hover:translate-x-2 transition-all duration-400 ease-out">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-400 ease-out">
                            <span className="text-sky-600 font-semibold">LC</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600">Lisa Chen</p>
                            <p className="text-sm text-gray-500">Pediatric Clinic Director</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className={`w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-sky-600 to-sky-700 transform transition-all duration-1000 ease-out ${
                ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                <div className="container mx-auto px-4 md:px-6">
                  <div className={`flex flex-col items-center justify-center space-y-6 text-center transform transition-all duration-800 ease-out delay-200 ${
                    ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white transform hover:scale-105 transition-all duration-500 ease-out">
                        Ready to Transform Your Healthcare Practice?
                      </h2>
                      <p className="text-blue-100 text-lg transform hover:translate-y-1 transition-all duration-400 ease-out">
                        Join thousands of healthcare providers who trust MediCare Pro to streamline their operations.
                      </p>
                    </div>
                    <div className={`w-[550px] space-y-3 transform transition-all duration-800 ease-out delay-400 ${
                      ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                      <div className="flex gap-3">
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          className="flex-1 bg-white/95 backdrop-blur-sm w-[450px] border-white/30" 
                        />
                        <Button variant="secondary" className="bg-white/95 backdrop-blur-sm hover:bg-white">
                          Get Started
                        </Button>
                      </div>
                      <p className="text-xs text-blue-100 transform hover:translate-y-1 transition-all duration-300 ease-out">
                        Start your 30-day free trial. No credit card required.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className={`flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 bg-sky-900 transform transition-all duration-800 ease-out ${
                footerVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                <p className="text-xs text-gray-300 font-medium transform hover:translate-x-1 transition-all duration-300 ease-out">© 2024 MediCare Pro. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                  <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-300 font-medium hover:text-white">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-300 font-medium hover:text-white">
                    Terms of Service
                  </Link>
                  <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-300 font-medium hover:text-white">
                    HIPAA Compliance
                  </Link>
                </nav>
              </footer>
            </div>

    )
}

export default Landing