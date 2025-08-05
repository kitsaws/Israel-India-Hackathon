import { useParams, Navigate } from "react-router-dom";
import PatientSignup from "./signup/PatientSignup";

const SignupPage = () => {
    const { role } = useParams();

    switch (role) {
        case 'patient':
            return <PatientSignup />;
        // case 'doctor':
        //   return <DoctorSignup />;
        default:
            return <Navigate to="/role-select/signup" />;
    }
};

export default SignupPage;