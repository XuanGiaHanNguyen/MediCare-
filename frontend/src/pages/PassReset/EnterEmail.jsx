import { useState } from "react";
import { LockIcon } from "../../assets/icon"
import { useNavigate } from "react-router-dom";

import Header from "../../component/header";

function EnterEmail (){

    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleSubmit = ()=>{
        sessionStorage.setItem("Email", email)
        navigate("/linksent")
    }
    
    return(
        <div>
            <Header></Header>
            <div className="w-full h-screen bg-sky-100 flex items-center justify-center">
                <div className="bg-white p-5 rounded-md shadow-md flex flex-col items-center w-1/2 gap-3 py-8 px-10">
                    <h1 className="text-3xl text-sky-800 font-semibold flex flex-row"><span>{LockIcon}</span>Forgot Password?</h1>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-15 h-2 bg-sky-200 rounded-full"></div>
                        <div className="w-15 h-2 bg-sky-200 rounded-full"></div>
                    </div>
                    <p className="text-sm text-sky-900 mb-4">Step 1 of 3</p>
                    <h2 className="text-lg font-medium flex w-full text-gray-600">Please Enter Your Email</h2>

                    <input
                            type="text"
                            id="email"
                            name="email"
                            onChange = {(e)=> setEmail(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="example@gmail.com"
                    />
          
                    <div className="flex w-full justify-end pt-2">
                        <button onClick={(e)=> handleSubmit()} className="border-2 px-6 py-2 rounded-md font-medium text-white bg-sky-700 cursor-pointer">
                            Continue
                        </button >
                    </div>

                </div>
            </div>
        </div>
    )
}

export default EnterEmail