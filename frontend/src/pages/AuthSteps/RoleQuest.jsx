import { useState } from "react";
import { UserIcon } from "../../assets/icon"
import { useNavigate } from "react-router-dom";

import Header from "../../component/header";

function RoleQuestionaire (){
    const [selectedRole, setSelectedRole] = useState("");
    const navigate = useNavigate()

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const getRoleButtonClass = (role) => {
        const baseClass = "border-2 border-sky-600 text-sky-800 font-medium w-full flex text-center justify-center py-3 rounded-md hover:bg-sky-600 hover:text-white cursor-pointer";
        const selectedClass = "bg-sky-600 text-white";
        
        return selectedRole === role ? `${baseClass} ${selectedClass}` : baseClass;
    };

    const handleSubmit = ()=> {
        sessionStorage.setItem("Role", selectedRole)
        navigate("/signup")
    }

    return(
        <div>
            <Header></Header>
            <div className="w-full h-screen bg-sky-100 flex items-center justify-center">
                <div className="bg-white shadow-md p-5 rounded-md flex flex-col items-center w-1/2 gap-3 py-8 px-10">
                    <h1 className="text-3xl text-sky-800 font-semibold flex flex-row"><span>{UserIcon}</span>Create an Account </h1>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-15 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-15 h-2 bg-sky-200 rounded-full"></div>
                        <div className="w-15 h-2 bg-sky-200 rounded-full"></div>
                    </div>
                    <p className="text-sm text-sky-900 mb-4">Step 1 of 3</p>
                    <h2 className="text-lg font-medium flex w-full text-gray-600">Please Select Your Role</h2>

                    <div 
                        className={getRoleButtonClass("healthcare")}
                        onClick={() => handleRoleSelect("healthcare")}
                    >
                        Healthcare Professional
                    </div>

                    <div 
                        className={getRoleButtonClass("patient")}
                        onClick={() => handleRoleSelect("patient")}
                    >
                        Medical Patient
                    </div>
                

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

export default RoleQuestionaire