import { useEffect, useState } from 'react'
import PatientLayout from '../../layouts/PatientLayout'
import { useAuth } from '../../context/AuthContext'


const ProgressBar = ({ goals }) => {
  let completedGoals = goals.filter(goal => goal.isCompleted);

  return (
    <div className="w-[60%] rounded-full h-3 bg-gray-200">
      <div
        className="h-full bg-accent rounded-full transition-all duration-300"
        style={{ width: `${(completedGoals.length / goals.length) * 100}%` }}
      ></div>
    </div>
  )
}

const Goals = () => {
  const { auth } = useAuth();
  const user = auth.user
  
  const [goals, setGoals] = useState(user.goals);
  const [completedGoals, setCompletedGoals] = useState([])
  useEffect(() => {
    setGoals(user.goals);
  }, [user.goals])
  useEffect(() => {
    setCompletedGoals(goals.filter(goal => goal.isCompleted));
  }, [goals])

  return (
    <PatientLayout>
      <div className='p-5 w-full flex flex-col gap-5 justify-center items-center mt-5'>
        <p className='text-4xl text-accent font-semibold' >
          {`${completedGoals.length}/${goals.length}`}
        </p>
        <h2 className='text-4xl font-semibold' >Today's Goals</h2>
        <ProgressBar goals={goals} />
      </div>
      <div className='p-5 mt-5 w-full flex flex-col justify-center items-center gap-4 text-2xl'>
        {goals.map(goal => {
          return (
            <div className={`w-[60%] rounded-xl shadow-md py-8 px-6 flex flex-col gap-1 justify-center ${goal.isCompleted ? 'bg-gray-300' : 'bg-primary'}`}>
              <p className="font-bold">{goal.title}</p>
              <p className="text-text-muted text-base">{goal.description}</p>
              <p className={`cursor-pointer px-4 py-2 rounded-xl w-fit text-lg text-white ${goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}>
                {goal.isCompleted ? "Completed" : "In Progress"}
              </p>
            </div>
          )
        })}
      </div>
    </PatientLayout>
  )
}

export default Goals
