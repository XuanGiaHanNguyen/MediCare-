import Header from "../../component/header";

function PasswordResetSuccess() {
    // Success check icon component
    const SuccessIcon = (
        <svg 
            className="w-16 h-16 text-sky-600" 
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
    );

    return(
        <div>
           <Header></Header>     
            <div className="w-full h-screen bg-sky-100 flex items-center justify-center">
                <div className="bg-white p-5 rounded-md flex flex-col items-center w-1/2 gap-6 py-12 px-10">
                    
                    {/* Success Icon */}
                    <div className="">
                        {SuccessIcon}
                    </div>

                    {/* Success Title */}
                    <h1 className="text-3xl text-sky-800 font-semibold text-center">
                        Password Reset Successful!
                    </h1>

                    {/* Success Message */}
                    <p className="text-gray-600 text-center text-lg leading-relaxed max-w-md">
                        Your password has been successfully reset. You can now log in with your new password.
                    </p>

                    {/* Return to Homepage Button */}
                    <div className="flex w-full justify-center pt-4">
                        <button 
                            onClick={() => window.location.href = "/"} 
                            className="border-2 px-8 py-3 rounded-md font-medium text-white bg-sky-700 hover:bg-sky-800 transition-colors cursor-pointer text-center"
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