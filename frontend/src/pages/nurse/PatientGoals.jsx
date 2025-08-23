import { useState, useEffect } from 'react'
import NurseLayout from '../../layouts/NurseLayout'
import { usePatient } from '../../context/nurse/PatientContext'
import { Calendar, CircleCheckBig, Plus, Target, X, ListTodo } from 'lucide-react'
import moment from 'moment'
import { toast } from "react-toastify";
import axios from 'axios'

const PageHeader = ({ showAddGoal, setShowAddGoal }) => {
  return (
    <div className='w-full header flex justify-between items-center py-2 px-6'>
      <h2 className='flex gap-2 justify-center items-center'>
        <span className='text-blue-400'><Target size={30} /></span>
        <span className='text-2xl font-semibold'>Patient Goals</span>
      </h2>
      <button
        className='cursor-pointer bg-accent rounded-full h-fit text-white font-semibold px-4 py-2 hover:shadow-md transition-all duration-300'
        onClick={() => setShowAddGoal(!showAddGoal)}
      >
        + Add New Goal
      </button>
    </div>
  )
}

const AddGoal = ({ setGoals, setShowAddGoal }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  console.log(formData);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Please enter both title and description');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/nurse/set-goal',
        { ...formData },
        { withCredentials: true }
      );
      toast.success('Goal added successfully');
      setGoals(response.data)
      setShowAddGoal(false);
    } catch (err) {
      toast.error('Something went wrong')
      console.error('Internal Server Error: ', err);
    }
  }

  return (
    <div className='addGoal p-6 flex flex-col gap-4 bg-white rounded-xl border-1 border-gray-200 shadow-md col-span-3'>
      <h3 className='flex gap-2 items-center'>
        <span className='text-accent'><Plus /></span>
        <span className='text-xl font-semibold'>Add New Goal</span>
      </h3>
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-muted mb-1">Goal Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter goal title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-muted mb-1">Description</label>
          <input
            type="text"
            id="description"
            placeholder="Describe the goal and any specific instruction..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className='buttons flex gap-4'>
          <button
            type='submit'
            className='cursor-pointer w-fit bg-accent text-white font-medium py-2 px-4 rounded-full hover:shadow-md transition-all duration-300'
          >
            + Add Goal
          </button>
          <button
            type='button'
            onClick={() => setShowAddGoal(false)}
            className='cursor-pointer w-fit bg-white font-medium py-2 px-4 rounded-full border-1 border-gray-200 hover:shadow-md hover:bg-orange-400 hover:text-white transition-all duration-300'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

const CountCard = ({ title, count }) => {
  const goalColor = (title) => {
    switch (title.toLowerCase()) {
      case 'total goals':
        return 'text-accent';
      case 'completed goals':
        return 'text-orange-400';
      case 'active goals':
        return 'text-green-400';
    }

  }

  return (
    <div className="totalGoals flex flex-col gap-2 justify-center items-center bg-white rounded-xl py-8 border-1 border-gray-200 shadow-md">
      <p className={`text-2xl font-semibold ${goalColor(title)}`}>{count}</p>
      <p className='text-md text-text-muted'>{title}</p>
    </div>
  )

}

const ActiveGoalsList = ({ goals, patient, setGoals }) => {
  const Card = ({ goal }) => {
    const handleMarkComplete = async () => {
      try {
        const response = await axios.put(
          'http://localhost:3000/api/nurse/patient/togglegoal',
          {
            username: patient.username,
            goalId: goal._id
          },
          { withCredentials: true }
        );
        console.log('Updated goal status: ', response.data);
        setGoals(response.data.goals)
      } catch (err) {
        toast.error('Something went wrong')
        console.error('Internal Server Error', err);
      }
    }

    return (
      <div className='w-full flex justify-between px-2 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl'>
        <div className='flex flex-col gap-2 w-full p-4'>
          <p className='text-xl font-semibold mb-2'>{goal.title}</p>
          <p className='text-md text-gray-400'>{goal.description}</p>
          <p className='flex gap-2 items-center text-sm text-gray-400'>
            <Calendar size={20} />
            <span>
              Created: {moment(goal.createdAt).format('YYYY-MM-DD')}
            </span>
          </p>
        </div>
        <button
          className='cursor-pointer bg-green-400 rounded-full text-sm text-white h-fit py-2 px-4 hover:shadow-md'
          onClick={handleMarkComplete}
          title='Mark as Completed'
        >
          <CircleCheckBig size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="activeGoalsList p-6 flex flex-col gap-4 bg-white rounded-xl border-1 border-gray-200 shadow-md col-span-3">
      <h3 className='flex gap-2 items-center'>
        <span className='text-green-400'><Target /></span>
        <span className='text-xl font-semibold'>{`Active Goals (${goals.length})`}</span>
      </h3>
      {goals.map((goal, i) => <Card key={i} goal={goal} />)}
    </div>
  )
}

const CompletedGoalsList = ({ goals, patient, setGoals }) => {
  const Card = ({ goal }) => {
    const handleMarkActive = async () => {
      try {
        const response = await axios.put(
          'http://localhost:3000/api/nurse/patient/togglegoal',
          {
            username: patient.username,
            goalId: goal._id
          },
          { withCredentials: true }
        );
        console.log('Updated goal status: ', response.data);
        setGoals(response.data.goals)
      } catch (err) {
        toast.error('Something went wrong')
        console.error('Internal Server Error', err);
      }
    }

    const handleRemoveGoal = async () => {
      try {
        const response = await axios.delete(
          'http://localhost:3000/api/nurse/patient/deletegoal',
          {
            data: {
              username: patient.username,
              goalId: goal._id
            },
            withCredentials: true
          }
        );
        setGoals(response.data.goals);
        toast.success('Goal removed successfully.')
      } catch (err) {
        console.error('Internal Server Error: ', err);
        toast.error('Error removing goal. Please try again.')
      }
    }

    return (
      <div className='w-full flex justify-between px-2 py-4 bg-orange-50 border-2 border-gray-100 rounded-xl'>
        <div className='flex flex-col gap-2 w-full p-4'>
          <p className='text-xl text-text-muted mb-2 line-through'>{goal.title}</p>
          <p className='text-md text-text-muted'>{goal.description}</p>
          <div className='flex gap-4'>
            <p className='flex gap-2 items-center text-sm text-gray-400'>
              <Calendar size={20} />
              <span>
                Created: {moment(goal.createdAt).format('YYYY-MM-DD')}
              </span>
            </p>
            <p className='flex gap-2 items-center text-sm text-gray-400'>
              <Calendar size={20} />
              <span>
                Completed: {moment(goal.completedAt).format('YYYY-MM-DD')}
              </span>
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          <span className='rounded-full bg-orange-400 text-white font-semibold text-sm p-2 h-fit'>Completed</span>
          <div className="btns flex flex-col gap-1 items-center">
            <button
              className='cursor-pointer bg-white rounded-full text-sm text-black h-fit py-2 px-4 hover:shadow-md border-1 border-gray-200 hover:bg-orange-400 hover:text-white transition-all duration-300'
              onClick={handleMarkActive}
              title='Mark Not Complete'
            >
              <ListTodo size={20} />
            </button>

            <button
              className='cursor-pointer bg-white rounded-full text-sm text-secondary-text h-fit py-2 px-4 hover:shadow-md border-1 border-gray-200 hover:bg-secondary-text hover:text-white transition-all duration-300'
              onClick={handleRemoveGoal}
              title='Remove Goal'
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="completedGoalsList p-6 flex flex-col gap-4 bg-white rounded-xl border-1 border-gray-200 shadow-md col-span-3">
      <h3 className='flex gap-2 items-center'>
        <span className='text-orange-400'><CircleCheckBig /></span>
        <span className='text-xl font-semibold'>{`Completed Goals (${goals.length})`}</span>
      </h3>
      {goals.map((goal, i) => <Card key={i} goal={goal} />)}
    </div>
  )
}

const PatientGoals = () => {
  const { patient } = usePatient();
  const [goals, setGoals] = useState(patient.goals);
  const [activeGoals, setActiveGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);

  useEffect(() => {
    if (goals.length) {
      setActiveGoals(goals.filter(goal => goal.completed === false));
      setCompletedGoals(goals.filter(goal => goal.completed === true));
    }
  }, [goals]);

  return (
    <NurseLayout>
      <PageHeader showAddGoal={showAddGoal} setShowAddGoal={setShowAddGoal} />
      <div className='w-full grid grid-cols-3 gap-x-2 gap-y-4'>
        <CountCard title={'Total Goals'} count={goals.length} />
        <CountCard title={'Active Goals'} count={activeGoals.length} />
        <CountCard title={'Completed Goals'} count={completedGoals.length} />
        {showAddGoal && <AddGoal setGoals={setGoals} setShowAddGoal={setShowAddGoal} />}
        <ActiveGoalsList goals={activeGoals} patient={patient} setGoals={setGoals} />
        <CompletedGoalsList goals={completedGoals} patient={patient} setGoals={setGoals} />
      </div>
    </NurseLayout>
  )
}

export default PatientGoals;
