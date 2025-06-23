import { useEffect, useState } from "react";
import { UserIcon, GoogleIcon } from "../../assets/icon"
import { useNavigate } from "react-router-dom";
import React from "react";
import  API_ROUTES from "../../constant/APIRoutes"
import axios from "axios"

import Header from "../../component/header";
import toast from "react-hot-toast";

import { useGoogleLogin } from "@react-oauth/google";


function SignUp() {

    let [ staff, setStaff ] = useState(false)

    useEffect(()=> {
        if (given === "healthcare"){
            setStaff(true)
        } else {
            setStaff(false)
        }
    })

    const [name, setName] = useState("")
    const [email, setEmail]= useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    const given = sessionStorage.getItem("Role")


    const navigate = useNavigate()

    const login = useGoogleLogin({
        onSuccess: 
        async (tokenResponse) => {
            const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`
                    }
                }
            )
            if (response.status === 200){

                console.log(response.data)

                const postObject = {
                    is_staff: staff, 
                    full_name: response.data.name, 
                    email: response.data.email,
                    password: response.data.sub, 
                    google: "yes"
                }

                sessionStorage.setItem("Name", response.data.name)

                const login = await axios.post(API_ROUTES.CREATE_USER, postObject)

                if (login.status === 200) {
                    toast.success("User created successfully")
                    localStorage.setItem("Id", login.data.insertedId)
                    sessionStorage.removeItem("Role")

                    if (given === "healthcare"){
                        navigate("/medprofile")
                    }else{
                        navigate("/patprofile")}
                } else {
                    toast.error("Error in the Google Authentication process")
                }

            } else {
                toast.error("Error in retrieving information.")
            }
        },
        onError: error => toast.error("Login Failed:", error)
    });


    async function handleSubmit (){
        
        sessionStorage.setItem("Name", name)
        
        
        //1. Check if password match 
        if (password === confirm){
            let SignUpObject = {
                is_staff: staff, 
                full_name: name, 
                email: email,
                password: password, 
                google: "no"
            }
            const response = await axios.post(API_ROUTES.CREATE_USER, SignUpObject)

            if (response.status === 200) {
                
                toast.success("User created successfully")
                localStorage.setItem("Id", response.data.insertedId)
                sessionStorage.removeItem("Role")

                if (given === "healthcare"){
                    navigate("/medprofile")
                }else{
                    navigate("/patprofile")
        }
            }
        } else {
            toast.error("Your password dont match")
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
                    <div className="w-15 h-2 bg-sky-200 rounded-full"></div>
                </div>
                <p className="text-sm text-sky-900 mb-4">Step 2 of 3</p>
                <h2 className="text-lg font-medium flex w-full text-gray-600">Please provide Your Name and Email</h2>

                <button 
                    className="border-2 border-sky-600 text-sky-800 font-semibold w-full flex text-center justify-center py-3 rounded-md cursor-pointer hover:bg-sky-50"
                    type="button"
                    onClick={(e)=> login()}
                >
                    <span className="pr-2">{GoogleIcon}</span> Sign Up with Google 
                </button>


                <div className="flex items-center justify-center w-full">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-4 text-gray-700 font-medium">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="w-full space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            onChange={(e)=>setName(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e)=> setEmail(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e)=>setPassword(e.target.value)}
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
                            onChange={(e)=>setConfirm(e.target.value)}
                            className="w-full px-3 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                            placeholder="Confirm your password"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    className="border-2 w-full flex text-center items-center px-6 py-2 rounded-md font-medium text-white bg-sky-700 cursor-pointer hover:bg-sky-800 mt-4"
                >
                    <p className="text-center w-full">Continue</p>
                </button>
                <button onClick={(e)=> navigate("/role")} className="border-2 w-full flex text-center items-center px-6 py-2 rounded-md font-medium text-sky-700 border-sky-700 cursor-pointer hover:bg-sky-50">
                    <p className="text-center w-full">Back</p>
                </button>
            </div>
        </div>
    </div>
    )
}

export default SignUp