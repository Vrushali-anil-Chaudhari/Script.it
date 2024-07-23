import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

type ProtectedRouteProps = {
    User: React.ReactElement
}
const ProtectedRoute = ({User}:ProtectedRouteProps) => {
    const navigate = useNavigate()
    const access_token = localStorage.getItem("access_token")
    useEffect(()=>{
        // const access_token = localStorage.getItem("access_token")
        if(!access_token || access_token == undefined || access_token == null){
            navigate('/signin')
            return;
        }
    },[navigate , access_token]);
    return User;
}

export default ProtectedRoute;