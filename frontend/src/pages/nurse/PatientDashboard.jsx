import NurseLayout from '../../layouts/NurseLayout'
import { Activity, LogOut, User, Users, PenLine, CircleAlert, Heart, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PageHeader = ({ handleEditPatient, handlePatientLogout }) => {
  return (
    <div className='w-full header flex justify-between items-center py-2 px-6'>
      <h2 className='flex gap-2 justify-center items-center'>
        <span className='text-blue-400'><Activity size={30} /></span>
        <span className='text-2xl font-semibold'>Patient Dashboard</span>
      </h2>
      <div className='flex gap-2'>
        <button
          onClick={handleEditPatient}
          className="cursor-pointer px-4 py-2 flex justify-center items-center gap-2 border-1 text-blue-400 transition-all duration-300 hover:text-white hover:bg-blue-400 rounded-full"
        >
          <PenLine size={20} />
          <span>Edit Patient Info</span>
        </button>
        <button
          onClick={handlePatientLogout}
          className="cursor-pointer px-4 py-2 flex justify-center items-center gap-2 border-1 text-secondary-text transition-all duration-300 hover:text-white hover:bg-secondary-text rounded-full"
        >
          <LogOut />
          <span>Logout Patient</span>
        </button>
      </div>
    </div>
  )
}

const PatientInformation = ({ patient }) => {
  const Info = ({ label, value }) => {
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
      <div>
        <p className='text-gray-400 text-md font-semibold'>{label}</p>
        {label.toLowerCase() === 'condition' ?
          <p className={`font-semibold text-sm px-2 py-1 rounded-full text-white w-fit ${conditionStyles(value)}`}>{value}</p> :
          <p className='font-semibold text-lg'>{value}</p>
        }
      </div>
    )
  }

  return (
    <div className="patientInfo p-6 w-full min-h-10 rounded-xl col-span-2 border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-blue-400'><User /></span>
        <span className='text-xl font-semibold'>Patient Information</span>
      </h3>
      <div className='w-full grid grid-cols-3 gap-y-2'>
        <Info label={'Name'} value={patient.name} />
        <Info label={'Age'} value={patient.age} />
        <Info label={'Gender'} value={patient.gender} />
        <Info label={'Patient ID'} value={patient.id} />
        <Info label={'Room'} value={patient.room} />
        <Info label={'Admission'} value={patient.admission} />
        <Info label={'Condition'} value={patient.condition} />
      </div>
    </div>
  )
}

const EmotionalState = ({ data }) => {
  const Info = ({ label, value }) => {
    return (
      <div>
        <p className='text-gray-400 text-sm mb-1'>{label}</p>
        {label.toLowerCase() === 'current state' ?
          <p className={`font-semibold text-sm px-2 py-1 rounded-full border-1 border-gray-200 w-fit`}>{value}</p> :
          <p className='font-semibold text-lg'>{value}</p>
        }
      </div>
    )
  }

  return (
    <div className="emotionalState p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-yellow-400'><CircleAlert /></span>
        <span className='text-xl font-semibold'>Emotional State</span>
      </h3>
      <div className="flex flex-col gap-4">
        <Info label={'Current State'} value={'Anxious'} />
        <Info label={'Last Updated: 2 hours ago'} value={''} />
      </div>

    </div>
  )
}

const CurrentVitals = ({ vitals }) => {
  const Card = ({ logo, label, value }) => {
    return (
      <div className='min-w-75 flex-1 flex flex-col gap-1 justify-center items-center rounded-xl py-6 bg-gray-100 border-1 border-gray-200'>
        <span>{logo}</span>
        <span className='text-gray-400'>{label}</span>
        <span className='text-xl font-bold'>{value}</span>
      </div>
    )
  }
  return (
    <div className="currentVitals col-span-3 p-6 w-full min-h-10 rounded-xl border-1 border-gray-100 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-green-400'><TrendingUp /></span>
        <span className='text-xl font-semibold'>Current Vitals</span>
      </h3>
      <div className='w-full flex flex-wrap gap-5 items-center'>
        <Card logo={<Heart className='text-red-500' />} label={'Heart Rate'} value={String(vitals.heartRate) + ' BPM'} />
        <Card logo={<Heart className='text-red-500' />} label={'Heart Rate'} value={String(vitals.heartRate) + ' BPM'} />
        <Card logo={<Heart className='text-red-500' />} label={'Heart Rate'} value={String(vitals.heartRate) + ' BPM'} />
        <Card logo={<Heart className='text-red-500' />} label={'Heart Rate'} value={String(vitals.heartRate) + ' BPM'} />
      </div>
    </div>
  )
}

const FamilyMembers = ({ family }) => {
  const Card = ({ name, relation, phno }) => {
    return (
      <div className='min-w-75 flex-1 flex flex-col gap-4 rounded-xl px-6 py-4 bg-gray-100 border-1 border-gray-200'>
        <div>
          <p className='text-lg font-semibold'>{name}</p>
          <p className='text-gray-400'>{relation}</p>
        </div>
        <span className='text-gray-400'>{phno}</span>
      </div>
    )
  }
  return (
    <div className="familyMembers col-span-3 p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-green-400'><Users /></span>
        <span className='text-xl font-semibold'>Family Members</span>
      </h3>
      <div className='w-full flex flex-wrap gap-5 items-center'>
        {family.map(member => (
          <Card name={member.name} relation={member.relation} phno={member.phno} />
        ))}
      </div>
    </div>
  )
}


const PatientDashboard = () => {
  const navigate = useNavigate();

  const patient = {
    name: 'John Doe',
    age: 56,
    gender: 'Male',
    id: 'P001',
    room: 'ICU-101',
    admission: '2024-01-15',
    condition: 'Stable',
    family: [
      {
        name: 'Jane Smith',
        relation: 'Wife',
        phno: '+1 (555) 123-4567'
      },
      {
        name: 'Mike Smith',
        relation: 'Son',
        phno: '+1 (555) 234-5678'
      },
      {
        name: 'Lisa Johnson',
        relation: 'Sister',
        phno: '+1 (555) 345-6789'
      }
    ]
  }
  const emotionData = {}
  const vitals = {
    heartRate: 70,
  }


  const handlePatientLogout = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/auth/nurse/logout-patient`,
        {},
        { withCredentials: true }
      );
      console.log('Patient Logged Out Successfully');

    } catch (err) {
      console.error('Failed to logout', err);
    }
  }
  const handleEditPatient = () => {
    navigate('/nurse/edit-patient')
  }

  return (
    <NurseLayout>
      <PageHeader handleEditPatient={handleEditPatient} handlePatientLogout={handlePatientLogout} />
      <div className='patientData w-full grid grid-cols-3 gap-x-2 gap-y-4'>
        <PatientInformation patient={patient} />
        <EmotionalState data={emotionData} />
        <CurrentVitals vitals={vitals} />
        <FamilyMembers family={patient.family} />
      </div>
    </NurseLayout>
  )
}

export default PatientDashboard
