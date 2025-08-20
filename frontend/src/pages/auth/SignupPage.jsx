import { useParams, Navigate } from "react-router-dom";
import PatientSignup from "./signup/PatientSignup";
import DoctorSignup from "./signup/DoctorSignup";
import NurseSignup from "./signup/NurseSignup";
import FamilySignup from "./signup/FamilySignup";

const SignupPage = () => {
    const { role } = useParams();

    switch (role) {
        case 'patient':
            return <PatientSignup />;
        case 'doctor':
          return <DoctorSignup />;
        case 'nurse':
          return <NurseSignup />;
        case 'family':
          return <FamilySignup />;
        default:
            return <Navigate to="/role-select/signup" />;
    }
};

export default SignupPage;