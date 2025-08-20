import { Navigate } from "react-router-dom";
import PatientLogin from "./login/PatientLogin";
import DoctorLogin from "./login/DoctorLogin";
import NurseLogin from './login/NurseLogin';
import FamilyLogin from "./login/FamilyLogin";
import { useRole } from "../../context/RoleContext";

const LoginPage = () => {
    const { role } = useRole();

    switch (role) {
        case 'patient':
            return <PatientLogin />;
        case 'doctor':
          return <DoctorLogin />;
        case 'nurse':
          return <NurseLogin />;
        case 'family':
          return <FamilyLogin />;
        default:
            return <Navigate to="/role-select/login" />;
    }
};

export default LoginPage;