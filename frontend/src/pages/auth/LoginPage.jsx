import { useParams, Navigate } from "react-router-dom";
import PatientLogin from "./login/PatientLogin";

const LoginPage = () => {
    const { role } = useParams();

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