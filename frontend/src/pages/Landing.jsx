import { 
  Users, 
  Calendar, 
  Activity, 
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useState } from 'react';

const FeatureCard = ({ icon: Icon, title, description, features }) => {

  return (
    <div className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 p-6">
      <div className="mb-6">
        <div className="mb-4">
          <Icon className="h-12 w-12 text-sky-700 group-hover:text-sky-800 transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4 text-sky-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white h-full rounded-lg border border-gray-300 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 pb-0 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

// Input component
const Input = ({ className = "", ...props }) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Button component
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variantClasses = variant === "secondary" 
    ? "bg-white text-sky-600 hover:bg-gray-400 hover:text-white" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  
  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Link component
const Link = ({ children, href, className = "", ...props }) => (
  <a href={href} className={`${className}`} {...props}>
    {children}
  </a>
);

function Landing () {

    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      facilityType: ''
    });

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
  
  //fix later since 2 function are using the same ...
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };


    return(
        <div className="flex flex-col">
            {/* Hero Section  */}
            <div className="w-full h-[65vh] bg-blue-100 flex flex-row">
                <div className="flex-[1.25] px-10 flex justify-center align-center items-center">
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            <p className="px-4 py-1 rounded-full bg-gray-50 text-gray-600 font-medium">Trusted by 500+ Healthcare Facilities</p>
                        </div>
                        <h1 className="text-6xl text-gray-700 font-semibold px-2">Streamline Your Hospital Operations</h1>
                        <h2 className="text-lg px-2 pt-2 text-gray-600">
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
                <section id="features" className="w-full py-24 bg-gray-100">
                    <div className="container mx-auto px-6 max-w-7xl">
                        {/* Header Section */}
                        <div className="text-center mb-10">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-700">
                                Comprehensive Healthcare Management
                            </h2>
                            <p className="max-w-4xl mx-auto text-lg text-gray-500 leading-relaxed">
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
                    </div>
                  </section>

                  {/* Testimonials */}
              <section className="w-full pt-24 pb-10">
                <div className="container mx-auto px-4 ">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold tracking-tighter text-gray-700">
                        Trusted by Healthcare Professionals
                      </h2>
                      <p className="max-w-[900px] text-gray-600 text-lg">
                        See what healthcare providers are saying about our platform.
                      </p>
                    </div>
                  </div>
                  <div className="mx-auto grid items-start py-12 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4">
                          "MediCare+ has transformed how we manage our clinic. The patient portal has significantly reduced
                          our administrative workload."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                            <span className="text-sky-600 font-semibold">DR</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600">Dr. Sarah Johnson</p>
                            <p className="text-sm text-gray-500">Family Medicine Clinic</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4">
                          "The analytics dashboard gives us insights we never had before. We've improved our patient
                          satisfaction scores by 40%."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                            <span className="text-sky-600 font-semibold">MR</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-600">Michael Rodriguez</p>
                            <p className="text-sm text-gray-500">Hospital Administrator</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4">
                          "Implementation was smooth and the support team is exceptional. Our staff adapted to the system
                          within days."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
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
              <section className="w-full py-12 md:py-24 lg:py-32 bg-sky-700">
                <div className="container mx-auto px-4 md:px-6">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                        Ready to Transform Your Healthcare Practice?
                      </h2>
                      <p className="text-blue-100">
                        Join thousands of healthcare providers who trust MediCare Pro to streamline their operations.
                      </p>
                    </div>
                    <div className="w-[550px] space-y-2">
                      <div className="flex gap-2">
                        <Input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email" 
                          className="flex-1 bg-white w-[450px]" 
                        />
                        <Button onClick={handleSubmit} variant="secondary">
                          Get Started
                        </Button>
                      </div>
                      <p className="text-xs text-blue-100">Start your 30-day free trial. No credit card required.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 bg-sky-900">
                <p className="text-xs text-gray-400 font-medium">© 2024 MediCare Pro. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                  <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 font-medium">
                    Privacy Policy
                  </Link>
                  <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 font-medium">
                    Terms of Service
                  </Link>
                  <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-400 font-medium">
                    HIPAA Compliance
                  </Link>
                </nav>
              </footer>
            </div>

    )
}

export default Landing