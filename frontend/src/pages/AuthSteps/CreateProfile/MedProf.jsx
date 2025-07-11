import { useState } from "react";
import { UserIcon, UserDisplayIcon } from "../../../assets/icon"
import { useNavigate } from "react-router-dom";
import axios from "axios"

import React from "react";
import toast from "react-hot-toast";

import Header from "../../../component/header";
import API_ROUTES from "../../../constant/APIRoutes"

function MedProf (){

    const [StaffRole, setStaffRole] = useState('')
    const [Language, setLanguage] = useState('')
    const [Tele, setTele] = useState('')
    const [Bio, setBio] = useState("")
    const [Phone, setPhone] = useState("")
    const [Year, setYear] = useState('')
    const id = localStorage.getItem("Id")

    const name = sessionStorage.getItem("Name")

    const navigate = useNavigate()

    async function handleSubmit (){
        // Validation for mandatory fields
        if (!StaffRole || !Language || !Tele || !Bio) {
            toast.error("Please fill in all mandatory fields");
            return;
        }

        // If telehealth is Yes but no phone number provided
        if (Tele === "Yes" && !Phone) {
            toast.error("Phone number is required when telehealth is available");
            return;
        }

        const Object = {
            userId: id, 
            language: Language, 
            tele_avail: Tele, 
            phone: Tele === "No" ? "Not given" : (Phone || "Not given"),
            role: StaffRole,
            year: Year,
            bio: Bio, 
            name: name 
        }

        try {
            const response = await axios.post(API_ROUTES.CREATE_STAFF, Object)
            if (response.status === 200){
                navigate("/loading")
            } else {
                toast.error("Cannot edit profile, try again later")
            }
        } catch (error) {
            toast.error("Cannot edit profile, try again later")
        }
    };

    return(
    <div>
        <Header></Header>
        <div className="w-full py-10 bg-sky-100 flex items-center justify-center">
            <div className="bg-white shadow-md p-5 rounded-md flex flex-col items-center w-1/2 gap-3 py-8 px-10">
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
                       <p className="font-normal text-xs pb-1 text-gray-700"> Medical Professional</p>
                       <div className="flex flex-row gap-1">
                            <p className="border-2 bg-sky-800 text-white text-sm rounded-full px-4">
                                {StaffRole || "Research Assistant"}
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
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Hospital Role <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={StaffRole}
                            onChange={(e)=> setStaffRole(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Enter your Hospital Role"
                            required
                        />
                    </div>

                    {/* Years of Experience field - shows only when StaffRole is entered */}
                    {StaffRole && (
                        <div>
                            <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-1">
                                Years of Experience
                            </label>
                            <input
                                type="number"
                                id="years"
                                name="years"
                                value={Year}
                                onChange={(e)=> setYear(e.target.value)}
                                className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                                placeholder="Enter years of experience"
                                min="0"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Language <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            value={Language}
                            onChange={(e)=> setLanguage(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Enter your Primary Language"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="telehealth" className="block text-sm font-medium text-gray-700 mb-1">
                            Telehealth Availability <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="telehealth"
                            name="telehealth"
                            value={Tele}
                            onChange={(e)=> setTele(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            required
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
                            Short Biography <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="shortBio"
                            name="shortBio"
                            value={Bio}
                            onChange={(e)=> setBio(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Write a short biography..."
                            required
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

export default MedProf