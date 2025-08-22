import { User, Stethoscope, Users } from 'lucide-react'
import NurseLayout from '../../layouts/NurseLayout'
import { usePatient } from '../../context/nurse/PatientContext'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PageHeader = () => {
  return (
    <div className='w-full header flex justify-between items-center py-2 px-6'>
      <h2 className='flex gap-2 justify-center items-center'>
        <span className='text-blue-400'><User size={30} /></span>
        <span className='text-2xl font-semibold'>Nurse Profile</span>
      </h2>
    </div>
  )
}

const PersonalInformation = ({ nurse }) => {
  const Info = ({ label, value }) => {
    return (
      <div>
        <p className='text-gray-400 text-md font-semibold'>{label}</p>
        <p className='font-semibold text-lg'>{value}</p>
      </div>
    )
  }

  return (
    <div className="nurseInfo bg-white p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-blue-400'><User /></span>
        <span className='text-xl font-semibold'>Nurse Information</span>
      </h3>
      <div className='w-full grid grid-cols-2 gap-y-2'>
        <Info label={'Name'} value={nurse.name} />
        <Info label={'Nurse ID'} value={nurse.id} />
        <Info label={'Department'} value={nurse.department} />
        <Info label={'Shift'} value={nurse.shift} />
        <Info label={'Email'} value={nurse.email} />
        <Info label={'Phone'} value={nurse.contact} />
      </div>
    </div>
  )
};

const SupervisingDoctor = ({ doctor }) => {
  const Info = ({ label, value }) => {
    return (
      <div>
        <p className='text-gray-400 text-md'>{label}</p>
        <p className='font-semibold text-lg'>{value}</p>
      </div>
    )
  }

  return (
    <div className="supervisingDoctor bg-white p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-yellow-400'><Stethoscope /></span>
        <span className='text-xl font-semibold'>Supervising Doctor</span>
      </h3>
      <div className='w-full grid grid-cols-1 gap-y-2'>
        <Info label={'Name'} value={doctor.name} />
        <Info label={'Speciality'} value={doctor.speciality} />
        <Info label={'Email'} value={doctor.email} />
        <Info label={'Phone'} value={doctor.contact} />
      </div>
    </div>
  )
};

const PatientList = ({ patient }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '' })

  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (!formData.username) {
      alert('Please enter the username of the patient');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/nurse/assign-patient',
        { username: formData.username },
        { withCredentials: true }
      );
      console.log('Patient Assigned Successfully');
      navigate(0); // refreshes the page
    } catch(err){
      console.error('Error assigning patient: ', err);
      alert(err.response?.data?.message || 'Failed to add patient. Please try again.');
      
    }
  }

  const Card = ({ name, room, id, condition }) => {
    const conditionStyles = (condition) => {
      switch (condition.toLowerCase()) {
        case 'stable':
          return 'bg-green-400';
        case 'critical':
          return 'bg-red-400';
        default:
          return '';
      }
    }
    return (
      <div className='cursor-pointer min-w-75 max-w-150 flex-1 flex justify-between gap-4 rounded-xl px-6 py-4 bg-gray-50 border-1 border-gray-200 hover:shadow-md transition-all duration-300'>
        <div className='flex flex-col'>
          <p className='text-lg'>{name}</p>
          <p className='text-gray-400 text-md'>{`Room: ${room}`}</p>
          <p className='text-gray-400 text-md'>{`ID: ${id}`}</p>
        </div>
        <div>
          <p className={`font-semibold text-sm px-2 py-1 rounded-full text-white w-fit ${conditionStyles(condition)}`}>{condition}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='patientList bg-white p-6 w-full min-h-10 rounded-xl col-span-2 border-1 border-gray-200 shadow-md flex flex-col gap-4'>
      <h3 className='flex gap-2 items-center'>
        <span className='text-green-400'><Users /></span>
        <span className='text-xl font-semibold'>{`Assigned Patients`}</span>
      </h3>
      {patient ?
        <div className='w-full flex flex-wrap gap-5 items-center'>
          <Card name={patient.name} room={patient.room} id={patient.id} condition={patient.condition} />
        </div> :
        <div>
          <p className='text-gray-400 text-lg font-semibold mb-4'>No patient assigned.</p>
          <div className='min-w-75 max-w-150 flex-1 flex flex-col gap-4 rounded-xl px-6 py-4 bg-gray-50 border-1 border-gray-200 shadow-md'>
            <p className='text-lg font-semibold'>Add Patient</p>
            <form className='flex gap-4' onSubmit={handleAddPatient}>
              <input
                type="text"
                id='patientUsername'
                placeholder="Enter Patient's Username"
                value={formData.username}
                onChange={(e) => setFormData({ username: e.target.value })}
                className='flex-1 border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent'
                autoComplete='off'
              />
              <button
                type='submit'
                className='cursor-pointer bg-accent text-white font-medium px-6 py-2 rounded-md hover:shadow-md transition-all durattion-300'
              >
                Add Patient
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  )
}

const Profile = () => {
  const { auth } = useAuth();
  const nurse = auth.user;
  const { patient } = usePatient();
  console.log(patient);
  
  const doctor = {
    name: 'John Doe',
    speciality: 'Critical Care Medicine',
    email: 'jdoe@gmail.com',
    contact: '+1 (555) 123-4567'
  }

  return (
    <NurseLayout>
      <PageHeader />
      <div className='patientData w-full grid grid-cols-2 gap-x-4 gap-y-4'>
        <PersonalInformation nurse={nurse} />
        <SupervisingDoctor doctor={doctor} />
        <PatientList patient={patient} />
      </div>
    </NurseLayout>
  )
}

export default Profile
