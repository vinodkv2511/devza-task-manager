import { useState } from 'react';
import { useQuery } from 'react-query';

// APIs
import { fetchTasks } from "../../apis/tasks";
import apiConstants from '../../apis/apiConstants';
import { fetchUsers } from "../../apis/users";

// Components
import TaskCard from "../../components/taskCard/taskCard";

//Assets
import './tasks.scss';
import DroppablePane from '../../components/droppablePane/droppablePane';

const Tasks = () => {

    const [ isPaneMode, setIsPaneMode] = useState(true);
    
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

    const renderPanes = () => {

        return (
            <div className="panes-container">
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Low</p>
                    <DroppablePane className={'pane'}/>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Medium</p>
                    <DroppablePane  className={'pane'}/>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>High</p>
                    <DroppablePane  className={'pane'}/>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        if( isPaneMode ) {
            return renderPanes()
        } else {
            return renderTasks(tasksResp, usersResp);
        }
    }

    return (
        <div className='page tasks-page'>
            <div className='head-row'>
                HEAD
            </div>
            <div className={`content-row tasks-content-container ${isPaneMode ? 'pane' : 'list'}`}>
                {
                    (isTasksLoading || isUsersLoading)
                    ? <p>Loading ...</p>
                    : (isUsersError || isTasksError)
                        ? <p> { isUsersError ? usersError.message : tasksError.message} </p>
                        : renderContent()
                }
            </div>
        </div>
    )
}

export default Tasks;
