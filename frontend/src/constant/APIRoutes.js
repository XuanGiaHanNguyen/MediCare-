const BASE_API_URL = "http://127.0.0.1:3000"; 

const API_ROUTES = {

    // Appointments
    GET_APPOINTMENTS: `${BASE_API_URL}/appointment`, 
    GET_APPOINTMENT: (app_id) => `${BASE_API_URL}/appointment/${app_id}`, 
    CREATE_APPOINTMENT: `${BASE_API_URL}/appointment`, 
    EDIT_APPOINTMENT: (app_id) => `${BASE_API_URL}/appointment/${app_id}`,
    DELETE_APPOINTMENT: (app_id) => `${BASE_API_URL}/appointment/${app_id}`,

    // Documents
    GET_DOCUMENTS: `${BASE_API_URL}/document`, 
    GET_DOCUMENT: (doc_id) => `${BASE_API_URL}/document/${doc_id}`, 
    CREATE_DOCUMENT: `${BASE_API_URL}/document`, 
    DELETE_DOCUMENT: (doc_id) => `${BASE_API_URL}/document/${doc_id}`,
    
    // Meetings
    GET_MEETINGS: `${BASE_API_URL}/meeting`, 
    GET_MEETING: (meeting_id) => `${BASE_API_URL}/meeting/${meeting_id}`, 
    CREATE_MEETING: `${BASE_API_URL}/meeting`, 
    EDIT_MEETING: (meeting_id) => `${BASE_API_URL}/meeting/${meeting_id}`,
    DELETE_MEETING: (meeting_id) => `${BASE_API_URL}/meeting/${meeting_id}`,

    // Patient (none-staff)
    GET_PATIENTS: `${BASE_API_URL}/patient`, 
    GET_PATIENT: (patient_id) => `${BASE_API_URL}/patient/${patient_id}`, 
    CREATE_PATIENT: `${BASE_API_URL}/patient`, 
    EDIT_PATIENT: (patient_id) => `${BASE_API_URL}/patient/${patient_id}`,

    // Staff
    GET_STAFFS: `${BASE_API_URL}/staff`, 
    GET_STAFF: (staff_id) => `${BASE_API_URL}/staff/${staff_id}`, 
    CREATE_STAFF: `${BASE_API_URL}/staff`, 
    EDIT_STAFF: (staff_id) => `${BASE_API_URL}/staff/${staff_id}`,

    // User
    GET_USERS: `${BASE_API_URL}/user`, 
    GET_USER: (user_id) => `${BASE_API_URL}/user/${user_id}`, 
    CREATE_USER: `${BASE_API_URL}/user`, 
    EDIT_USER: (user_id) => `${BASE_API_URL}/user/${user_id}`,
    LOGIN: `${BASE_API_URL}/user/login`, 

    //Request
    CREATE_REQUEST: `${BASE_API_URL}/request`,
    GET_REQUEST: (user_id)=> `${BASE_API_URL}/request/${user_id}`, 
    SEEN_REQUEST: (user_id)=> `${BASE_API_URL}/request/${user_id}`, 

}

export default API_ROUTES
