import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// APIs
import { fetchTasks, postTaskUpdate } from "../../apis/tasks";
import { fetchUsers } from "../../apis/users";

// Components
import TaskCard from "../../components/taskCard/taskCard";

//Assets
import './tasks.scss';
import DroppablePane from '../../components/droppablePane/droppablePane';
import axios from 'axios';

const Tasks = () => {

    const [ isPaneMode, setIsPaneMode] = useState(true);
    const [ tasks, setTasks ] = useState([]);
    const [ users, setUsers ] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [ tasksUpdating, setTasksUpdating ] = useState({});
    const [ tasksUpdateErrors, setTasksUpdateErrors ] = useState({});
    
    useEffect( () => {
        let cancelTokenTasks = axios.CancelToken.source();
        let cancelTokenUsers = axios.CancelToken.source();
        loadData(cancelTokenTasks, cancelTokenUsers);

        return () => {
            cancelTokenTasks.cancel();
            cancelTokenUsers.cancel();
        }
    }, [])

    const loadData = async (cancelTokenTasks, cancelTokenUsers) => {
        try {
            setIsLoading(true);
            let tasksProm = fetchTasks(cancelTokenTasks);
            let usersProm = fetchUsers(cancelTokenUsers);

            let [tasksResp, usersResp] = await Promise.all([tasksProm, usersProm]);
            setTasks(tasksResp?.data?.tasks);
            setUsers(usersResp?.data?.users);
            setError('');
            setIsLoading(false);
        } catch (e) {
            if(axios.isCancel(e)) {
                return;
            }
            setError(e.message);
            setIsLoading(false);
        } 
    } 

    const updateTask = async (data) => {
        try {
            setTasksUpdating({...tasksUpdating, [data.id]: true});
            let dataToPost = {...data, taskid: data.id}
            let updateResp = await postTaskUpdate(dataToPost);
            console.log(updateResp);
            setTasksUpdating({...tasksUpdating, [data.id]: false});
            setTasksUpdateErrors({...tasksUpdateErrors, [data.id]: ''});
        } catch (e) {
            if(axios.isCancel(e)) {
                return;
            }
            setTasksUpdateErrors({...tasksUpdateErrors, [data.id]: e.message});
            setTasksUpdating({...tasksUpdating, [data.id]: false});
        } 
    }

    const renderTasks = (tasks) => {
        const usersMap = {};
        users?.forEach(user => {
            usersMap[user.id] = {...user}
        });

        if(!tasks) {
            return null;
        }

        return tasks?.map( task => <TaskCard 
                key={`${task.id}`} 
                task={task} 
                user={usersMap[task.assigned_to]} 
                isUpdating={tasksUpdating[task.id]} 
                updateError={tasksUpdateErrors[task.id]}/>)
    }

    const handleDrop = (priority, item) => {
        let newTasks = tasks.map( task => {
            if(item.id === task.id) {
                let newTask = {...task, priority: `${priority}`};
                updateTask(newTask);
                return newTask;
            } else {
                return {...task};
            }
        });
        
        setTasks(newTasks);
    }

    const renderPanes = () => {

        return (
            <div className="panes-container">
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Low</p>
                    <DroppablePane className={'pane'} onDrop={(item) => handleDrop(1, item)}>
                        {renderTasks(tasks.filter( task => Number(task.priority) === 1))}
                    </DroppablePane>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>Medium</p>
                    <DroppablePane  className={'pane'} onDrop={(item) => handleDrop(2, item)}>
                        {renderTasks(tasks.filter( task => Number(task.priority) === 2))}
                    </DroppablePane>
                </div>
                <div className={'priority-pane-container'}>
                    <p className={'pane-label'}>High</p>
                    <DroppablePane  className={'pane'} onDrop={(item) => handleDrop(3, item)}>
                        {renderTasks(tasks.filter( task => Number(task.priority) === 3))}
                    </DroppablePane>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        console.log(tasks);
        if( isPaneMode ) {
            return renderPanes()
        } else {
            return renderTasks(tasks);
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
                        isLoading
                        ? <p>Loading ...</p>
                        : error
                            ? <p> { error } </p>
                            : renderContent()
                    }
                </div>
            </div>
        </DndProvider>
    )
}

export default Tasks;
