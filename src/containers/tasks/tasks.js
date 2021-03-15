import { fetchTasks } from "../../apis/tasks";
import apiConstants from '../../apis/apiConstants';
import { useQuery } from 'react-query';

const Tasks = () => {
    
    const  { isLoading, error, data, isError } = useQuery(apiConstants.GET_TASKS, fetchTasks);

    const renderTasks = (data) => {
        if(!data?.data) {
            return null;
        }
        return data?.data?.tasks?.map( task => <p key={`${task.id}`}>{task.message}</p>)
    }

    return (
        <div>
            TASKS
            {
                isLoading 
                ? <p>Loading ...</p>
                : isError
                    ? <p>{error.message}</p>
                    : renderTasks(data)
            }
        </div>
    )
}

export default Tasks;
