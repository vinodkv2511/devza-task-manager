import { useState } from 'react';
import { useQuery } from 'react-query';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// APIs
import { fetchTasks } from "../../apis/tasks";
import apiConstants from '../../apis/apiConstants';
import { fetchUsers } from "../../apis/users";

// Components
import TaskCard from "../../components/taskCard/taskCard";

//Assets
import './tasks.scss';
import DroppablePane from '../../components/droppablePane/droppablePane';
import { PRIORITY } from '../../constants';

const Tasks = () => {

    const [ isPaneMode, setIsPaneMode] = useState(true);
    
    const  { isLoading: isTasksLoading, error: tasksError, data: tasksResp, isError: isTasksError } = useQuery(apiConstants.GET_TASKS, fetchTasks);
    const  { isLoading: isUsersLoading, error: usersError, data: usersResp, isError: isUsersError } = useQuery(apiConstants.GET_USERS, fetchUsers );

    const renderTasks = (tasks, users) => {
        const usersMap = {};
        users?.forEach(user => {
            usersMap[user.id] = {...user}
        });

        if(!tasksResp?.data) {
            return null;
        }

        return tasks?.map( task => <TaskCard key={`${task.id}`} task={task} user={usersMap[task.assigned_to]}/>)
    }

    const renderPanes = (tasks, users) => {

        return (
            <div className="panes-container">
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Low</p>
                    <DroppablePane className={'pane'}>
                        {renderTasks(tasks.filter( task => PRIORITY[task.priority] === 'low'), users)}
                    </DroppablePane>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Medium</p>
                    <DroppablePane  className={'pane'}>
                        {renderTasks(tasks.filter( task => PRIORITY[task.priority] === 'medium'), users)}
                    </DroppablePane>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>High</p>
                    <DroppablePane  className={'pane'}>
                        {renderTasks(tasks.filter( task => PRIORITY[task.priority] === 'high'), users)}
                    </DroppablePane>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        if( isPaneMode ) {
            return renderPanes(tasksResp?.data?.tasks, usersResp?.data?.users)
        } else {
            return renderTasks(tasksResp?.data?.tasks, usersResp?.data?.users);
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
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
        </DndProvider>
    )
}

export default Tasks;
