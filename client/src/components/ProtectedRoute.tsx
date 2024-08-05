import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ProtectedRouteProps = {
    User: React.ReactElement;
};

const ProtectedRoute = ({ User }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");

        if (!access_token || access_token === undefined || access_token === null) {
            setSessionExpired(true);
            return;
        }
    }, [navigate]);

    const handleSessionExpiry = () => {
        setSessionExpired(false);
        localStorage.removeItem("access_token");
        navigate('/signin');
    };

    if (sessionExpired) {
        return (
            <div className="session-expiry-modal">
                <div className="modal-content">
                    <p>Your session has expired. Please log in again to continue.</p>
                    <button onClick={handleSessionExpiry}>Login Again</button>
                </div>
            </div>
        );
    }

    return User;
};

export default ProtectedRoute;
