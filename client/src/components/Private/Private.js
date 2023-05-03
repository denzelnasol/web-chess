import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API
import { verifyAccount } from 'api/Account';

/**
 * Wrapper function to manage access to restricted components (require login)
 * 
 * @param component component to wrap
 * @returns Component that either renders passed in component, or login page
 */
function Private({ ...props }) {
    const ComponentToRender = props.componentToRender;
    const navigate = useNavigate();
    
    useEffect(() => {
        async function authenticateAccount() { 
            const isAuthenticated = await verifyAccount();
            if (!isAuthenticated) {
                navigate('/login');
            }
        }

        authenticateAccount();
    }, []);
    
    return (
        <ComponentToRender />
    );
}

export default Private;