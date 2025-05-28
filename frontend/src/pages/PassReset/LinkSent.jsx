import { useState } from "react";
import { LockIcon } from "../../assets/icon"
import { Link } from "react-router-dom";

import Header from "../../component/header";

function LinkSent (){
      
    return(
        <div>
            <Header></Header>
            <div className="w-full h-screen bg-sky-100 flex items-center justify-center">
                <div className="bg-white p-5 rounded-md flex flex-col items-center w-1/2 gap-3 py-8 px-10">
                    <h1 className="text-3xl text-sky-800 font-semibold flex flex-row"><span>{LockIcon}</span>Check Your Email!</h1>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-15 h-2 bg-sky-200 rounded-full"></div>
                    </div>
                    <p className="text-sm text-sky-900 mb-4">Step 2 of 3</p>
                    <h2 className="text-lg font-medium w-full text-gray-600 flex text-center justify-center"> We have sent the password reset instruction to your email.</h2>

                
                    <div className="w-full text-gray-600 flex text-center justify-center px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600">
                        Your Email Address
                    </div>

                    <Link to="/enteremail"
                        className="font-medium w-full flex text-center justify-center py-2 rounded-md bg-sky-600 text-white cursor-pointer"
                    >
                        Resend Email 
                    </Link>

        
                </div>
            </div>
        </div>
    )
}

export default LinkSent