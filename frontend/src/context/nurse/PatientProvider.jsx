import { useState, useEffect } from 'react';
import { PatientContext } from './PatientContext';
import axios from 'axios';

export const PatientProvider = ({ children }) => {

    const [patient, setPatient] = useState({ loading: true, data: null });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/nurse/get-patient', { withCredentials: true });
                setPatient({ loading: false, data: res.data });
            } catch (err) {
                console.error(err);
                setPatient({ loading: false, data: null });
            }
        };

        fetchPatient();
    }, []);

    return (
        <PatientContext.Provider value={{ patient, setPatient }}>
            {children}
        </PatientContext.Provider>
    );
};
