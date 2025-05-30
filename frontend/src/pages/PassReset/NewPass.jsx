import { useState } from "react";
import { UnlockIcon } from "../../assets/icon"
import { useNavigate } from "react-router-dom";

import Header from "../../component/header";

function NewPass (){
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log("Form submitted:", formData);
        navigate("/back")
    };

    return(
    <div>
        <Header></Header>
        <div className="w-full min-h-screen py-10 bg-sky-100 flex items-center justify-center">
            <div className="bg-white p-5 shadow-md rounded-md flex flex-col items-center w-1/2 py-8 px-10">
                <h1 className="text-3xl text-sky-800 font-semibold flex flex-row items-center mb-3">
                    <span className="pr-2">{UnlockIcon}</span>Set New Password 
                </h1>
                <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                    <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                    <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                </div>

                <p className="text-sm text-sky-900 mb-3">Step 3 of 3</p>

                <div className="w-full flex flex-col gap-2">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Confirm your password"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    className="border-2 w-full flex text-center items-center px-6 py-2 rounded-md font-medium text-white bg-sky-700 cursor-pointer hover:bg-sky-800 mt-4"
                >
                    <p className="text-center w-full">Reset Password</p>
                </button>
            </div>
        </div>
    </div>
    )
}

export default NewPass