import GeneralLayout from '../../layouts/GeneralLayout'
import { Activity, LogOut, User, Users, PenLine, CircleAlert, Heart, TrendingUp, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePatient } from '../../context/nurse/PatientContext'
import Loading from '../../components/Loading'
import moment from 'moment'
import axios from 'axios'
import { useEffect, useState } from 'react'

const PageHeader = () => {
  return (
    <div className='w-full header flex justify-between items-center py-2 px-6'>
      <h2 className='flex gap-2 justify-center items-center'>
        <span className='text-blue-400'><Activity size={30} /></span>
        <span className='text-2xl font-semibold'>Patient Dashboard</span>
      </h2>
    </div >
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
    <div className="patientInfo bg-white p-6 w-full min-h-10 rounded-xl col-span-2 border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-blue-400'><User /></span>
        <span className='text-xl font-semibold'>Patient Information</span>
      </h3>
      <div className='w-full grid grid-cols-3 gap-y-2'>
        <Info label={'Name'} value={patient.name} />
        <Info label={'Age'} value={patient.age} />
        <Info label={'Gender'} value={patient.gender} />
        <Info label={'Patient ID'} value={'P-' + String(patient.patientId).padStart(4, '0')} />
        <Info label={'Room'} value={'R-' + String(patient.room).padStart(3, '0')} />
        <Info label={'Admission'} value={moment(patient.createdAt).format('YYYY-MM-DD')} />
        <Info label={'Condition'} value={patient.condition} />
      </div>
    </div>
  )
}

const EmotionalState = ({ data }) => {
  const Info = ({ label, value }) => {
    console.log('emotion value: ', value);
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
    <div className="emotionalState bg-white p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-yellow-400'><CircleAlert /></span>
        <span className='text-xl font-semibold'>Emotional State</span>
      </h3>
      <div className="flex flex-col gap-4">
        <Info label={'Current State'} value={data} />
        {/* <Info label={'Last Updated: 2 hours ago'} value={''} /> */}
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
    <div className="currentVitals bg-white col-span-3 p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
      <h3 className='flex gap-2 items-center'>
        <span className='text-green-400'><TrendingUp /></span>
        <span className='text-xl font-semibold'>Current Vitals</span>
      </h3>
      <div className='w-full flex flex-wrap gap-5 items-center'>
        <Card logo={<Heart className='text-red-500' />} label={'Heart Rate'} value={String(vitals.heartRate) + ' BPM'} />
        <Card logo={<Activity className='text-blue-500' />} label={'Blood Pressure'} value={String(vitals.bloodPressure) + ' mmHg'} />
        <Card logo={<Wind className='text-green-500' />} label={'O2 Satuartion'} value={String(vitals.oxygenLevel) + ' %'} />
        {/* <Card logo={<Heart className='text-red-500' />} label={'Heart Rate'} value={String(vitals.ventilatorStatus) + ' BPM'} /> */}
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
    <div className="familyMembers bg-white col-span-3 p-6 w-full min-h-10 rounded-xl border-1 border-gray-200 shadow-md flex flex-col gap-4">
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
  const { patient } = usePatient();
  const [emotionData, setEmotionData] = useState({ loading: true, data: null });
  const [vitals, setVitals] = useState({
    loading: true,
    data: {
      heartRate: '',
      bloodPressure: '',
      oxygenLevel: '',
    }
  });

  // Vitals from ESP
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.4.1/vitals');
        setVitals({ loading: false, data: response.data });
      } catch (err) {
        setVitals(prev => ({ ...prev, loading: false }));
        // console.log('Error Fetching Vitals: ', err);
      }
    };

    fetchData(); // ✅ no await here

    const interval = setInterval(fetchData, 1500);

    return () => clearInterval(interval);
  }, []);


  // Emotion Data
  useEffect(() => {
    // Replace with your Python WS server URL
    const socket = new WebSocket("ws://localhost:8765");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      console.log("Message from server:", parsed);
      setEmotionData({ loading: false, data: parsed.emotion }); // update state with latest message
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);


  return (
    <GeneralLayout>
      <PageHeader />
      <div className='patientData w-full grid grid-cols-3 gap-x-2 gap-y-4'>
        <PatientInformation patient={patient} />
        <EmotionalState data={emotionData.data} />
        <CurrentVitals vitals={vitals.data} />
        <FamilyMembers family={patient.family} />
      </div>
    </GeneralLayout>
  )
}

export default PatientDashboard
