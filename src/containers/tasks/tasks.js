import { useQuery } from 'react-query';

// APIs
import { fetchTasks } from "../../apis/tasks";
import apiConstants from '../../apis/apiConstants';
import { fetchUsers } from "../../apis/users";

// Components
import TaskCard from "../../components/taskCard/taskCard";

const Tasks = () => {
    
    const  { isLoading: isTasksLoading, error: tasksError, data: tasksResp, isError: isTasksError } = useQuery(apiConstants.GET_TASKS, fetchTasks);
    const  { isLoading: isUsersLoading, error: usersError, data: usersResp, isError: isUsersError } = useQuery(apiConstants.GET_USERS, fetchUsers );

    const renderTasks = (tasksResp, usersResp) => {
        const usersMap = {};
        usersResp?.data?.users?.forEach(user => {
            usersMap[user.id] = {...user}
        });

        if(!tasksResp?.data) {
            return null;
        }
        return tasksResp?.data?.tasks?.map( task => <TaskCard key={`${task.id}`} task={task} user={usersMap[task.assigned_to]}/>)
    }

    return (
        <div>
            TASKS
            {
                (isTasksLoading || isUsersLoading)
                ? <p>Loading ...</p>
                : (isUsersError || isTasksError)
                    ? <p> { isUsersError ? usersError.message : tasksError.message} </p>
                    : renderTasks(tasksResp, usersResp)
            }
        </div>
    )
}

export default Tasks;
