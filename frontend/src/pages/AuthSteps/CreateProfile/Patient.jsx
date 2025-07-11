import { useState } from "react";
import { UserIcon, UserDisplayIcon } from "../../../assets/icon"
import { useNavigate } from "react-router-dom";
import React from "react";

import API_ROUTES from "../../../constant/APIRoutes";

import toast from "react-hot-toast"
import axios from "axios";

import Header from "../../../component/header";

function Patient (){

    const [Diagnosis, setDiagnosis] = useState('')
    const [Language, setLanguage] = useState('')
    const [Tele, setTele] = useState()
    const [Bio, setBio] = useState("")
    const [Phone, setPhone] = useState("")
    const [Age, setAge] = useState('')

    const userId = localStorage.getItem("Id")
    const name = sessionStorage.getItem("Name")

    const navigate = useNavigate()

    async function handleSubmit () {
        let Object = {
            userId: userId, 
            language: Language, 
            tele_avail: Tele, 
            phone: Tele === "No" ? "Not given" : (Phone || "Not given"),
            age: Age, 
            bio: Bio, 
            diagnosis: Diagnosis, 
            name: name 
        }

        console.log(Object)
        const response = await axios.post(API_ROUTES.CREATE_PATIENT, Object)

        if (response.status === 200){
            navigate("/loading")
        } else {
            toast.error("Cannot submit changes")
        }
 
    };


    return(
    <div>
        <Header></Header>
        <div className="w-full py-10 bg-sky-100 flex items-center justify-center">
            <div className="bg-white p-5 shadow-md rounded-md flex flex-col items-center w-1/2 gap-3 py-8 px-10">
                <h1 className="text-3xl text-sky-800 font-semibold flex flex-row items-center">
                    <span>{UserIcon}</span>Create an Account 
                </h1>
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                    <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                    <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                </div>
                <p className="text-sm text-sky-900 mb-4">Step 3 of 3</p>
                <h2 className="text-lg font-medium flex w-full text-gray-600">Costumize your Profile</h2>

                <div 
                    className="border-2 border-sky-600 w-full flex justify-start px-8 py-3 rounded-md cursor-pointer flex flex-row gap-3"
                >
                    <div className="rounded-full p-1 bg-sky-700">
                        {UserDisplayIcon}
                    </div>
                    <div>
                       <p className="font-bold text-lg text-gray-700">{name}</p>
                       <p className="font-normal text-xs pb-1 text-gray-700"> Patient</p>
                       <div className="flex flex-row gap-1">
                            <p className="border-2 bg-sky-800 text-white text-sm rounded-full px-4">
                                {/* ternary operator: || */}
                                {Diagnosis || "High blood pressure"}
                            </p>
                            <p className="border-2 bg-sky-800 text-white text-sm rounded-full px-4">
                                {Language || "English"}
                            </p>
                            <p className="border-2 bg-sky-800 text-white text-sm rounded-full px-4">
                                Telegraph: { Tele || "Yes"}
                            </p>
                       </div>
                    </div>
                    
                </div>

                <div className="flex items-center justify-center w-full py-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="w-full space-y-4">
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Age 
                        </label>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            onChange={(e)=> setAge(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Enter your Current Age"
                        />
                    </div>

                    <div>
                        <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Diagnosis
                        </label>
                        <input
                            type="text"
                            id="diagnosis"
                            name="diagnosis"
                            onChange={(e)=> setDiagnosis(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Enter your Diagnosis"
                        />
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Language 
                        </label>
                        <input
                            type="language"
                            id="language"
                            name="language"
                            onChange={(e)=> setLanguage(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Enter your Primary Language"
                        />
                    </div>

                    <div>
                        <label htmlFor="telehealth" className="block text-sm font-medium text-gray-700 mb-1">
                            Telehealth Availability
                        </label>
                        <select
                            id="telehealth"
                            name="telehealth"
                            onChange={(e)=> setTele(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                        >
                            <option value="">Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {/* Phone number field - shows only when Telehealth is Yes */}
                    {Tele === "Yes" && (
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={Phone}
                                onChange={(e)=> setPhone(e.target.value)}
                                className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="shortBio" className="block text-sm font-medium text-gray-700 mb-1">
                            Short Biography
                        </label>
                        <textarea
                            id="shortBio"
                            name="shortBio"
                            onChange={(e)=> setBio(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Write a short biography..."
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    className="border-2 w-full flex text-center items-center px-6 py-2 rounded-md font-medium text-white bg-sky-700 cursor-pointer hover:bg-sky-800 mt-4"
                >
                    <p className="text-center w-full">Finish</p>
                </button>
                <button onClick={(e)=> navigate("/signup")} className="border-2 w-full flex text-center items-center px-6 py-2 rounded-md font-medium text-sky-700 border-sky-700 cursor-pointer hover:bg-sky-50">
                    <p className="text-center w-full">Back</p>
                </button>
            </div>
        </div>
    </div>
    )
}

export default Patient