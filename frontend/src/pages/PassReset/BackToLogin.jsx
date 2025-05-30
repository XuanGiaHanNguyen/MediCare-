import Header from "../../component/header";

import { useState, useEffect } from "react";

function PasswordResetSuccess() {
    const [showCheckmark, setShowCheckmark] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowCheckmark(true), 800);
    }, []);
    // Success check icon component with animation
    const SuccessIcon = (
        <div className="relative">
            {/* Circle background with pulse animation */}
            <div className={`w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center transition-all duration-1000 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                <svg 
                    className={`w-12 h-12 text-sky-600 transition-all duration-700 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            {/* Pulse rings */}
            <div className={`absolute inset-0 w-20 h-20 bg-sky-200 rounded-full animate-ping opacity-20 ${showCheckmark ? 'block' : 'hidden'}`}></div>
            <div className={`absolute inset-0 w-20 h-20 bg-sky-300 rounded-full animate-pulse opacity-10 ${showCheckmark ? 'block' : 'hidden'}`}></div>
        </div>
    );

    return(
        <div>
            <Header></Header>
            <div className="w-full h-screen bg-sky-100 flex items-center justify-center">
                <div className={`bg-white p-5 rounded-md flex flex-col items-center w-1/2 gap-6 py-12 px-10 shadow-md transition-all duration-1000 transform `}>
                    
                    {/* Success Icon */}
                    <div className="mb-4">
                        {SuccessIcon}
                    </div>

                    {/* Success Title */}
                    <h1 className={`text-3xl text-sky-800 font-semibold text-center transition-all duration-1000 delay-300`}>
                        Password Reset Successful!
                    </h1>

                    {/* Success Message */}
                    <p className={`text-gray-600 text-center text-lg leading-relaxed max-w-md transition-all duration-1000 delay-500`}>
                        Your password has been successfully reset. You can now log in with your new password.
                    </p>

                    {/* Return to Homepage Button */}
                    <div className={`flex w-full justify-center pt-4 transition-all duration-1000 delay-700`}>
                        <button 
                            onClick={() => window.location.href = "/"} 
                            className="border-2 px-8 py-3 rounded-md font-medium text-white bg-sky-700 hover:bg-sky-800 hover:scale-105 transition-all duration-300 cursor-pointer text-center transform hover:shadow-lg"
                        >
                            Return to Homepage
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PasswordResetSuccess