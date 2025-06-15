const BASE_API_URL = "http://127.0.0.1:8000"; 

export default API_ROUTES = {

    // Appointments
    GET_APPOINTMENTS: `${BASE_API_URL}/appointment`, 
    GET_APPOINTMENT: (App_id) => `${BASE_API_URL}/appointment/${App_id}`, 
    CREATE_APPOINTMENT: `${BASE_API_URL}/appointment`, 
    EDIT_APPOINTMENT: (App_id) => `${BASE_API_URL}/appointment/${App_id}`,
    DELETE_APPOINTMENT: (App_id) => `${BASE_API_URL}/appointment/${App_id}`,

    // Documents
    GET_DOCUMENTS: `${BASE_API_URL}/document`, 
    

    // Meetings

    // Patient (none-staff)

    // Staff 

    // User 

}
