import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";

const PrivateRoutes = ({ children, role }) => {
    const { auth } = useAuth();

    useEffect(() => {
      console.log(`PrivateRoutes: Checking authentication for role: ${role}`);
      console.log(auth.role === role)

    }, [role, auth]);

    if(!auth.user) return <Navigate to="/role-select/login" replace />

    if(role && auth.role !== role) {
        return <Navigate to='/' replace />
    }

  return children;
}

export default PrivateRoutes