import { Navigate } from "react-router-dom";
import PatientLogin from "./login/PatientLogin";
import { useRole } from "../../context/RoleContext";

const LoginPage = () => {
    const { role } = useRole();

    switch (role) {
        case 'patient':
            return <PatientLogin />;
        // case 'doctor':
        //   return <DoctorSignup />;
        default:
            return <Navigate to="/role-select/login" />;
    }
};

export default LoginPage;