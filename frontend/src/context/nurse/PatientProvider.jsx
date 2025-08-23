import { useState, useEffect } from 'react';
import { PatientContext } from './PatientContext';
import axios from 'axios';
import Loading from '../../components/Loading';
import { useAuth } from '../AuthContext';

export const PatientProvider = ({ children }) => {
    const { auth } = useAuth();
    const [patient, setPatient] = useState({ loading: true, data: null });
    const [selectedPatient, setSelectedPatient] = useState(() => {
        // initialize from localStorage if it exists
        const stored = localStorage.getItem("selectedPatient");
        return stored ? JSON.parse(stored) : null;
    });

    // keep localStorage in sync whenever it changes
    useEffect(() => {
        if (selectedPatient) {
            localStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));
        } else {
            localStorage.removeItem("selectedPatient");
        }
    }, [selectedPatient]);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/${auth.role}/get-patient`,
                    {
                        withCredentials: true,
                        validateStatus: function (status) {
                            // accepts all status codes, so it won't throw error for intended 300+ status
                            return true;
                        }
                    }
                );
                if (res.status === 400) {
                    console.log(res.data)
                    setPatient({ loading: false, data: null });
                    console.log('Patient got set to:', patient);

                    return;
                }
                if (res.status === 404) {
                    throw new Error(res.data);
                }

                setPatient({ loading: false, data: res.data.patient });
            } catch (err) {
                console.error(err);
                setPatient({ loading: false, data: null });
            }
        };

        fetchPatient();
    }, []);

    return (
        <PatientContext.Provider value={{ patient: patient.data, setPatient, selectedPatient, setSelectedPatient }}>
            {patient.loading ? <Loading /> : children}
        </PatientContext.Provider>
    );
};
