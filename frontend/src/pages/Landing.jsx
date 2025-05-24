import { 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  Shield, 
  Stethoscope, 
  CheckCircle 
} from 'lucide-react';
const FeatureCard = ({ icon: Icon, title, description, features }) => {
  return (
    <div className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 p-6">
      <div className="mb-6">
        <div className="mb-4">
          <Icon className="h-12 w-12 text-blue-600 group-hover:text-blue-700 transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function Landing () {

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
    },
    {
      icon: FileText,
      title: "Billing & Insurance",
      description: "Automated billing processes with insurance claim management and payment tracking.",
      features: [
        "Insurance Processing",
        "Payment Gateway",
        "Financial Analytics"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with HIPAA compliance and data protection protocols.",
      features: [
        "HIPAA Compliant",
        "Data Encryption",
        "Access Controls"
      ]
    },
    {
      icon: Stethoscope,
      title: "Staff Management",
      description: "Comprehensive staff scheduling, payroll, and performance management system.",
      features: [
        "Shift Scheduling",
        "Payroll Integration",
        "Performance Tracking"
      ]
    }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

    return(
        <div className="flex flex-col">
            {/* Hero Section  */}
            <div className="w-full h-[60vh] bg-blue-100 flex flex-row">
                <div className="flex-[1.25] px-10 flex justify-center align-center items-center">
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            <p className="px-4 py-1 rounded-full bg-gray-50 text-gray-600 font-medium">Trusted by 500+ Healthcare Facilities</p>
                        </div>
                        <h1 className="text-6xl font-semibold px-2">Streamline Your Hospital Operations</h1>
                        <h2 className="text-lg px-2 pt-2">
                            Complete hospital management solution that digitizes patient records, schedules appointments, manages staff, and optimizes healthcare delivery for better patient outcomes.
                        </h2>
                    </div>
                </div>
                 <div className="flex-1">
                    <div className="m-10 mr-12 rounded-xl p-8 bg-white shadow-lg border border-gray-100 shadow-lg">
                        <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                placeholder="doctor@hospital.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                            />
                            </div>

                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                            />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                                Remember me
                            </label>
                            </div>
                            <button 
                            type="button"
                            className="text-sm text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                            >
                            Forgot password?
                            </button>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-4 focus:ring-blue-200 focus:outline-none"
                        >
                            Sign In
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button 
                                type="button"
                                className="text-sky-600 hover:text-sky-700 hover:underline font-medium transition-colors"
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
                <section id="features" className="w-full py-14 bg-gray-100">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        {/* Header Section */}
                        <div className="text-center mb-16">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                                Comprehensive Healthcare Management
                            </h2>
                            <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
                                Everything you need to run a modern healthcare facility efficiently and provide exceptional patient care.
                            </p>
                        </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {features.map((feature, index) => (
                            <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            features={feature.features}
                            />
                        ))}
                        </div>

                        {/* Call-to-Action */}
                        <div className="text-center mt-16">
                        <div className="inline-flex flex-col sm:flex-row gap-4">
                            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-200 focus:outline-none">
                            Start Free Trial
                            </button>
                            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold border-2 border-gray-200 hover:border-gray-300 rounded-lg transition-colors focus:ring-4 focus:ring-gray-200 focus:outline-none">
                            Schedule Demo
                            </button>
                        </div>
                        </div>
                    </div>
                    </section>
            </div>

    )
}

export default Landing
