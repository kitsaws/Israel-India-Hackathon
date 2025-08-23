import { User, Stethoscope, Users } from 'lucide-react'
import GeneralLayout from '../../layouts/GeneralLayout'
import { usePatient } from '../../context/nurse/PatientContext'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const PageHeader = () => {
  return (
    <div className='w-full header flex justify-between items-center py-2 px-6'>
      <h2 className='flex gap-2 justify-center items-center'>
        <span className='text-blue-400'><User size={30} /></span>
        <span className='text-2xl font-semibold'>Doctor Profile</span>
      </h2>
    </div>
  )
}

const PersonalInformation = ({ doctor }) => {
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
        <span className='text-xl font-semibold'>Doctor Information</span>
      </h3>
      <div className='w-full grid grid-cols-2 gap-y-2'>
        <Info label={'Name'} value={doctor.name} />
        <Info label={'Department'} value={doctor.department} />
        <Info label={'Email'} value={doctor.email} />
        <Info label={'Phone'} value={doctor.telephone} />
      </div>
    </div>
  )
};

const WorkingNurses = ({ nurses }) => {
  const Card = ({ nurse }) => {
    return (
      <div className='cursor-pointer min-w-75 max-w-150 flex-1 flex justify-between gap-4 rounded-xl px-6 py-6 bg-gray-50 border-1 border-gray-200 transition-all duration-300'>
        <div className='flex flex-col'>
          <p className='text-lg font-semibold'>{nurse.name}</p>
          <p className='text-gray-400 text-md'>{`Nurse ID: ${nurse.nurseId}`}</p>
        </div>
        <div>
          {/* <p className={`font-semibold text-sm px-2 py-1 rounded-full text-white w-fit`}>{nurse.patient}</p> */}
          <p className={`text-sm px-2 py-1 rounded-full border-1 border-text-muted text-text-muted w-fit`}>1 patient</p>
        </div>
      </div>
    )
  }

  return (
    <div className="supervisingDoctor bg-white p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-yellow-400'><Stethoscope /></span>
        <span className='text-xl font-semibold'>{`Working Nurses (${nurses.length})`}</span>
      </h3>

      <div className='w-full flex flex-col gap-2'>
        {nurses.length > 0 ?
          nurses.map(nurse => (<Card key={nurse.nurseId} nurse={nurse} />)) :
          <p>No Nurses Working</p>
        }
      </div>
    </div>
  )
};

const PatientList = ({ patient, showAddPatient, setShowAddPatient, setSelectedPatient }) => {
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
        'http://localhost:3000/api/doctor/assign-patient',
        { username: formData.username },
        { withCredentials: true }
      );
      toast.success('Patient assigned successfully.')
      console.log('Patient Assigned Successfully');
      navigate(0); // refreshes the page
    } catch (err) {
      console.error('Error assigning patient: ', err);
      alert(err.response?.data?.message || 'Failed to add patient. Please try again.');

    }
  }

  const handlePatientSelect = async (p) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/doctor/get-patient-data/${p._id}`,
        { withCredentials: true }
      );
      setSelectedPatient(response.data);
      localStorage.setItem("selectedPatient", JSON.stringify(response.data));
      navigate('/doctor/patient-dashboard');
    } catch (err) {
      console.error('Internal server error- ', err);
    }
  }

  const Card = ({p}) => {
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
      <div
        className='cursor-pointer min-w-75 max-w-150 flex-1 flex justify-between gap-4 rounded-xl px-6 py-4 bg-gray-50 border-1 border-gray-200 hover:shadow-md transition-all duration-300'
        onClick={() => handlePatientSelect(p)}
      >
        <div className='flex flex-col'>
          <p className='text-lg font-semibold'>{p.name}</p>
          <p className='text-gray-400 text-md'>{`Room: ${p.room}`}</p>
          <p className='text-gray-400 text-md'>{`ID: ${p.id}`}</p>
        </div>
        <div>
          <p className={`font-semibold text-sm px-2 py-1 rounded-full text-white w-fit ${conditionStyles(p.condition)}`}>{p.condition}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='patientList bg-white p-6 w-full min-h-10 rounded-xl col-span-2 border-1 border-gray-200 shadow-md flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h3 className='flex gap-2 items-center'>
          <span className='text-green-400'><Users /></span>
          <span className='text-xl font-semibold'>{`Assigned Patients (${patient.length})`}</span>
        </h3>
        <button
          className='cursor-pointer bg-accent rounded-full h-fit text-white font-semibold px-4 py-2 hover:shadow-md transition-all duration-300'
          onClick={() => setShowAddPatient(!showAddPatient)}
        >
          + Add Patient
        </button>
      </div>
      {patient.length > 0 ?
        <div className='w-full flex flex-wrap gap-5 items-center'>
          {patient.map(p => (<Card
            key={p.patientId}
            p={p}
          />))}
        </div> :
        <p className='text-gray-400 text-lg font-semibold mb-4'>No patient assigned.</p>
      }
      {showAddPatient &&
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
        </div>}
    </div>
  )
}

const Profile = () => {
  const { auth } = useAuth();
  const doctor = auth.user;

  // this is an array of patients
  const { patient, setSelectedPatient } = usePatient();
  const [nurses, setNurses] = useState({ loading: true, data: [] });
  useEffect(() => {
    const fetchNursesList = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/doctor/get-nurse', 
          { withCredentials: true }
        );
        setNurses({ loading: false, data: response.data });
      } catch (err) {
        console.error('Couldnt fetch nurses list: ', err);
        setNurses({ loading: false, data: [] });
      }
    }

    fetchNursesList();
  }, [])

  useEffect(() => {
    localStorage.removeItem('selectedPatient');
    setSelectedPatient(null);
  }, [])

  const [showAddPatient, setShowAddPatient] = useState(false);
  return (
    <GeneralLayout>
      <PageHeader />
      <div className='patientData w-full grid grid-cols-2 gap-x-4 gap-y-4'>
        <PersonalInformation doctor={doctor} />
        <WorkingNurses nurses={nurses.data} />
        <PatientList patient={patient} showAddPatient={showAddPatient} setShowAddPatient={setShowAddPatient} setSelectedPatient={setSelectedPatient} />
      </div>
    </GeneralLayout>
  )
}

export default Profile
