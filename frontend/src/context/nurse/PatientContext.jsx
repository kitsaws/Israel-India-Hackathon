import { createContext, useContext } from 'react';

export const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);