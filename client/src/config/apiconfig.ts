export const API_URL = import.meta.env.VITE_BACKEND_URL

// type APIRoutes = {
//     [key:string]: {
//         [key:string]: string | ((value:string)=>string)
//     }
// }

// Below is the alternative :


export const apiRoutes = {
    auth: {
        login: `${API_URL}/auth/login/`,
        register: `${API_URL}/auth/register/`,
        profile: `${API_URL}/api/get_profile`,
        logout: `${API_URL}/auth/logout/`,
    },
    tasks: {
        getTaskStatus: (task_id: string) => `${API_URL}/api/task-status/${task_id}/`,
    },
    files: {
        upload: `${API_URL}/api/upload/`,
        deleteSingleFile: (fileName: string) => `${API_URL}/api/delete/${fileName}/`,
        deleteAllFiles: `${API_URL}/api/deleteall/`,
        searchFromFiles: `${API_URL}/api/get_files/`,
        getUploadedFiles: `${API_URL}/api/get_uploaded_files`,
        getFileContent: (fileName: string) => `${API_URL}/api/download/${fileName}/`,
    },
};
