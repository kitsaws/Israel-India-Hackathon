import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";

const PrivateRoutes = ({ role }) => {
    const { auth } = useAuth();

    useEffect(() => {
      console.log(`PrivateRoutes: Checking authentication for role: ${role}`);
      console.log(auth.role === role)
    }, [role, auth]);

    return (!auth.user) ? <Navigate to="/role-select/login" replace /> : <Outlet />
}

export default PrivateRoutes